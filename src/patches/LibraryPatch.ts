/**
 * Library page patch - injects player count badge into game library
 */

import {
  afterPatch,
  findInReactTree,
  appDetailsClasses,
  createReactTreePatcher,
} from '@decky/ui';
import { routerHook } from '@decky/api';
import { CACHE } from '../utils/Cache';
import { PlayerBadge } from '../components/PlayerBadge';
import { fetchPlayerCount } from '../utils/api';
import { TIMING, ROUTES } from '../constants';

interface PlayerCountWrapperProps {
  appId: string;
}

/**
 * Wrapper component that fetches and displays player count
 */
const PlayerCountWrapper = ({ appId }: PlayerCountWrapperProps) => {
  const [playerCount, setPlayerCount] = window.SP_REACT.useState<string>('Loading...');
  const mountedRef = window.SP_REACT.useRef<boolean>(true);

  window.SP_REACT.useEffect(() => {
    mountedRef.current = true;

    const fetchAndSetCount = async () => {
      const result = await fetchPlayerCount(appId);

      if (!mountedRef.current) return;

      if (result.success) {
        setPlayerCount(result.formatted);
      } else {
        setPlayerCount(result.formatted); // 'No data' or 'Error'
      }
    };

    fetchAndSetCount();
    const interval = setInterval(fetchAndSetCount, TIMING.PLAYER_COUNT_REFRESH);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [appId]);

  return window.SP_REACT.createElement(PlayerBadge, {
    count: playerCount,
    appId,
  });
};

// Component name for filtering
PlayerCountWrapper.displayName = 'PlayerCountWrapper';

/**
 * Extract app ID from library URL
 */
const extractLibraryAppId = (): string | null => {
  const match = window.location.pathname.match(/\/library\/app\/([\d]+)/);
  return match ? match[1] : null;
};

/**
 * Patch the library page to inject player count badge
 * @returns Cleanup function
 */
export function patchLibrary(): () => void {
  let isOnLibraryPage = false;
  let patchHandler: ReturnType<typeof createReactTreePatcher> | null = null;

  const patchFn = (tree: unknown) => {
    const routeProps = findInReactTree(
      tree,
      (x: any) => !!x?.renderFunc
    );

    if (routeProps) {
      patchHandler = createReactTreePatcher(
        [
          (tree: unknown) =>
            findInReactTree(
              tree,
              (x: any) =>
                !!(x?.props?.children?.props?.overview)
            )?.props?.children,
        ],
        (_args: unknown[], ret?: unknown) => {
          try {
            const container = findInReactTree(
              ret,
              (x: Record<string, unknown>) =>
                Array.isArray((x?.props as Record<string, unknown>)?.children) &&
                ((x?.props as Record<string, unknown>)?.className as string)?.includes(
                  appDetailsClasses.InnerContainer
                )
            ) as { props: { children: Array<{ type?: { name?: string; displayName?: string } }> } } | null;

            if (typeof container !== 'object' || !container) {
              return ret;
            }

            const appId = extractLibraryAppId();

            if (appId) {
              isOnLibraryPage = true;
              CACHE.setValue(CACHE.APP_ID_KEY, appId);

              if (container.props.children) {
                // Remove any existing PlayerCountWrapper components first
                container.props.children = container.props.children.filter(
                  (child) =>
                    !child?.type?.name?.includes('PlayerCountWrapper') &&
                    !child?.type?.displayName?.includes('PlayerCountWrapper')
                );

                // Add the new PlayerCountWrapper
                container.props.children.splice(
                  1,
                  0,
                  window.SP_REACT.createElement(PlayerCountWrapper, {
                    key: 'player-count',
                    appId,
                  })
                );
              }
            }
          } catch (error) {
            console.error('[PlayCount] Error in library patch:', error);
          }
          return ret;
        }
      );

      afterPatch(routeProps, 'renderFunc', patchHandler);
    }
    return tree;
  };

  // Add the patch
  const unpatch = routerHook.addPatch('/library/app/:appid', patchFn);

  // Handle route changes
  const handleRouteChange = () => {
    if (!window.location.pathname.includes(ROUTES.LIBRARY_APP)) {
      if (isOnLibraryPage) {
        isOnLibraryPage = false;
        CACHE.setValue(CACHE.APP_ID_KEY, '');
      }
    }
  };

  window.addEventListener('popstate', handleRouteChange);

  // Return cleanup function
  return () => {
    if (unpatch) {
      routerHook.removePatch('/library/app/:appid', unpatch);
    }

    window.removeEventListener('popstate', handleRouteChange);

    if (isOnLibraryPage) {
      CACHE.setValue(CACHE.APP_ID_KEY, '');
    }
  };
}
