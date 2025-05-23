import {
  afterPatch,
  findInReactTree,
  appDetailsClasses,
  createReactTreePatcher
} from '@decky/ui';
import { routerHook, fetchNoCors } from '@decky/api';
import { CACHE } from "../utils/Cache";
import { PlayerBadge } from "../components/PlayerBadge";

interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  }
}

const PlayerCountWrapper = ({ appId }: { appId: string }) => {
  const [playerCount, setPlayerCount] = window.SP_REACT.useState("Loading...");

  window.SP_REACT.useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const response = await fetchNoCors(
          `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`,
          {
            method: "GET",
            headers: { 'Accept': 'application/json' }
          }
        );

        const data: SteamPlayerResponse = JSON.parse(await response.text());
        
        if (data.response.result === 1) {
          const formattedCount = new Intl.NumberFormat().format(data.response.player_count);
          setPlayerCount(formattedCount);
        } else {
          setPlayerCount("No data");
        }
      } catch (error) {
        setPlayerCount("Error");
      }
    };

    fetchPlayerCount();
    const interval = setInterval(fetchPlayerCount, 30000);

    return () => clearInterval(interval);
  }, [appId]);

  return window.SP_REACT.createElement(PlayerBadge, { count: playerCount, appId });
};

export function patchLibrary(): () => void {
  let isOnLibraryPage = false;
  
  // Store the patcher function to remove it later
  let patchHandler: any = null;

  const patchFn = (tree: any) => {
    const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc);
    
    if (routeProps) {
      patchHandler = createReactTreePatcher([
        (tree: any) => findInReactTree(tree, (x: any) => x?.props?.children?.props?.overview)?.props?.children
      ], (_: any[], ret?: any) => {
        try {
          const container = findInReactTree(
            ret,
            (x: any) =>
              Array.isArray(x?.props?.children) &&
              x?.props?.className?.includes(
                appDetailsClasses.InnerContainer
              )
          );

          if (typeof container !== 'object') {
            return ret;
          }

          const appId = window.location.pathname.match(/\/library\/app\/([\d]+)/)?.[1];
          
          if (appId) {
            isOnLibraryPage = true;
            CACHE.setValue(CACHE.APP_ID_KEY, appId);

            if (container.props.children) {
              // Remove any existing PlayerCountWrapper components first
              container.props.children = container.props.children.filter(
                (child: any) => !child?.type?.name?.includes('PlayerCountWrapper')
              );
              
              // Add the new PlayerCountWrapper
              container.props.children.splice(
                1,
                0,
                window.SP_REACT.createElement(PlayerCountWrapper, { key: "player-count", appId })
              );
            }
          }
        } catch (error) {
          console.error("Error in library patch:", error);
        }
        return ret;
      });
      
      afterPatch(routeProps, "renderFunc", patchHandler);
    }
    return tree;
  };

  // Add the patch and store the removal function
  const unpatch = routerHook.addPatch('/library/app/:appid', patchFn);

  const handleRouteChange = () => {
    if (!window.location.pathname.includes('/library/app/')) {
      if (isOnLibraryPage) {
        isOnLibraryPage = false;
        CACHE.setValue(CACHE.APP_ID_KEY, "");
      }
    }
  };

  window.addEventListener('popstate', handleRouteChange);

  return () => {
    // Properly remove the router patch
    if (unpatch) {
      routerHook.removePatch('/library/app/:appid', unpatch);
    }
    
    // Clean up event listener
    window.removeEventListener('popstate', handleRouteChange);
    
    // Clear cache
    if (isOnLibraryPage) {
      CACHE.setValue(CACHE.APP_ID_KEY, "");
    }
  };
}