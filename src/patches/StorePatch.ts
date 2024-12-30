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
    const unlisten = History.listen(async (info) => {
      try {
        if (info.pathname === '/steamweb') {
          getCurrentAppID();
        } else {
          CACHE.setValue(CACHE.APP_ID_KEY, "");
        }
      } catch (err) {
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
        oldUrl = "" // This is necessary so that the appID will be set again after closing the external browser
        setTimeout(() => getCurrentAppID(), 1500)
        return
      }

      if (storeTab?.url && storeTab.url !== oldUrl) {
        oldUrl = storeTab.url;
        const appId = storeTab.url.match(/\/app\/([\d]+)\/?/)?.[1];
        if (appId) {
          CACHE.setValue(CACHE.APP_ID_KEY, appId);
          // As long as the steam store is open do refreshes
          setTimeout(() => getCurrentAppID(), 1500)
        } else {
          CACHE.setValue(CACHE.APP_ID_KEY, "");
          // As long as the steam store is open do refreshes
          setTimeout(() => getCurrentAppID(), 1500)
        }
      }
      // If tabs do not contain steamstore
      if (!storeTab) {
        CACHE.setValue(CACHE.APP_ID_KEY, "")
      }
      else {
        setTimeout(() => getCurrentAppID(), 1500)
      }
    };

    return unlisten;
  }
  return () => {
    CACHE.setValue(CACHE.APP_ID_KEY, "");
  };
}