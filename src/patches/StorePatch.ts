import { fetchNoCors } from "@decky/api"
import { findModuleChild } from "@decky/ui"
import { CACHE } from "../utils/Cache"

type Tab = {
  description: string
  devtoolsFrontendUrl: string
  id: string
  title: string
  type: 'page'
  url: string
  webSocketDebuggerUrl: string
}

type Info = {
  hash: string
  key: string
  pathname: string
  search: string
  state: { force: number; url: string }
}

const History: {
  listen: (callback: (info: Info) => Promise<void>) => () => void
} = findModuleChild((m) => {
  if (typeof m !== 'object') return undefined
  for (const prop in m) {
    if (m[prop]?.m_history) return m[prop].m_history
  }
})

export function patchStore(): () => void {
  if (History && History.listen) {
    let oldUrl = "";
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let lastKnownAppId: string | null = null;

    const clearPoll = () => {
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
    };

    const startPoll = () => {
      clearPoll();
      pollTimer = setTimeout(() => getCurrentAppID(), 1500);
    };

    const handleFocus = async () => {
      if (window.location.pathname.includes('/steamweb') && lastKnownAppId) {
        await CACHE.setValue(CACHE.APP_ID_KEY, lastKnownAppId);
        getCurrentAppID();
      }
    };

    window.addEventListener('focus', handleFocus);

    const unlisten = History.listen(async (info) => {
      try {
        if (info.pathname === '/steamweb') {
          getCurrentAppID();
        } else {
          clearPoll();
          lastKnownAppId = null;
          CACHE.setValue(CACHE.APP_ID_KEY, "");
        }
      } catch (err) {
        clearPoll();
        lastKnownAppId = null;
        CACHE.setValue(CACHE.APP_ID_KEY, "");
      }
    });

    const getCurrentAppID = async () => {
      let tabs: Tab[] = [];

      try {
        const response = await fetchNoCors('http://localhost:8080/json');
        tabs = JSON.parse(await response.text()) || [];
      } catch (e) {
        tabs = [];
      }

      const storeTab = tabs.find((tab) =>
        tab.url.includes('https://store.steampowered.com')
      );
      
      const itadTab = tabs.find((tab) =>
        tab.url.includes('https://isthereanydeal.com')
      );

      if (itadTab) {
        oldUrl = "";
        startPoll();
        return;
      }

      if (storeTab?.url) {
        const appId = storeTab.url.match(/\/app\/([\d]+)\/?/)?.[1];
        
        if (storeTab.url !== oldUrl || !lastKnownAppId) {
          oldUrl = storeTab.url;
          if (appId) {
            lastKnownAppId = appId;
            await CACHE.setValue(CACHE.APP_ID_KEY, appId);
          } else {
            lastKnownAppId = null;
            await CACHE.setValue(CACHE.APP_ID_KEY, "");
          }
        }
        
        startPoll();
      } else {
        if (lastKnownAppId && document.hasFocus()) {
          await CACHE.setValue(CACHE.APP_ID_KEY, lastKnownAppId);
        } else {
          clearPoll();
          lastKnownAppId = null;
          await CACHE.setValue(CACHE.APP_ID_KEY, "");
        }
      }
    };

    return () => {
      unlisten();
      clearPoll();
      window.removeEventListener('focus', handleFocus);
      lastKnownAppId = null;
      CACHE.setValue(CACHE.APP_ID_KEY, "");
    };
  }

  return () => {
    CACHE.setValue(CACHE.APP_ID_KEY, "");
  };
}