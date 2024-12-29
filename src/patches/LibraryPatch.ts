import {
  afterPatch,
  findInReactTree,
  ServerAPI,
} from 'decky-frontend-lib';
import { CACHE } from "../utils/Cache";
import { ReactElement } from 'react';

export function patchLibrary(serverApi: ServerAPI): () => void {
  let isOnLibraryPage = false;

  // Create a reusable patch function
  function patchAppPage(route: any) {
    const routeProps = findInReactTree(route, (x: any) => x?.renderFunc);
    
    if (routeProps) {
      afterPatch(routeProps, "renderFunc", (_: any, ret: ReactElement) => {
        try {
          // Extract appId from URL
          const appId = window.location.pathname.match(/\/library\/app\/([\d]+)/)?.[1];
          
          if (appId) {
            isOnLibraryPage = true;
            // Update cache with new appId
            CACHE.setValue(CACHE.APP_ID_KEY, appId);
          }
        } catch (error) {
          console.error("Error in library patch:", error);
        }
        
        return ret;
      });
    }
    return route;
  }

  const handleRouteChange = () => {
    if (!window.location.pathname.includes('/library/app/')) {
      if (isOnLibraryPage) {
        isOnLibraryPage = false;
        CACHE.setValue(CACHE.APP_ID_KEY, "");
      }
    }
  };

  window.addEventListener('popstate', handleRouteChange);

  // Add the library page patch
  const unpatch = serverApi.routerHook.addPatch('/library/app/:appid', patchAppPage);

  // Return cleanup function
  return () => {
    if (unpatch) {
      unpatch(null as any);
    }
    window.removeEventListener('popstate', handleRouteChange);
    if (isOnLibraryPage) {
      CACHE.setValue(CACHE.APP_ID_KEY, "");
    }
  };
}