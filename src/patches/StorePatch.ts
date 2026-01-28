/**
 * Store page patch - detects Steam store pages and tracks app IDs
 */

import { fetchNoCors } from '@decky/api';
import { findModuleChild } from '@decky/ui';
import { CACHE } from '../utils/Cache';
import { API, ROUTES } from '../constants';
import { extractAppIdFromUrl, isSteamStoreUrl } from '../utils/api';

/**
 * Chrome DevTools tab info
 */
interface Tab {
  description: string;
  devtoolsFrontendUrl: string;
  id: string;
  title: string;
  type: 'page';
  url: string;
  webSocketDebuggerUrl: string;
}

/**
 * History navigation info
 */
interface HistoryInfo {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: { force: number; url: string };
}

interface HistoryModule {
  listen: (callback: (info: HistoryInfo) => Promise<void>) => () => void;
}

/**
 * Get the Steam History module for listening to navigation events
 */
const History: HistoryModule | undefined = findModuleChild((m: unknown) => {
  if (typeof m !== 'object' || m === null) return undefined;
  for (const prop in m as Record<string, unknown>) {
    const module = (m as Record<string, { m_history?: HistoryModule }>)[prop];
    if (module?.m_history) return module.m_history;
  }
  return undefined;
});

/**
 * Poll interval for checking store tabs (ms)
 */
const STORE_POLL_INTERVAL = 1500;


/**
 * Patch the store page to track app IDs for player count display
 * @returns Cleanup function
 */
export function patchStore(): () => void {
  if (!History?.listen) {
    // History module not available, return no-op cleanup
    return () => {
      CACHE.setValue(CACHE.APP_ID_KEY, '');
    };
  }

  let oldUrl = '';
  let pollTimer: ReturnType<typeof setTimeout> | null = null;
  let lastKnownAppId: string | null = null;

  /**
   * Clear the polling timer
   */
  const clearPoll = (): void => {
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
  };

  /**
   * Start polling for store tab changes
   */
  const startPoll = (): void => {
    clearPoll();
    pollTimer = setTimeout(getCurrentAppID, STORE_POLL_INTERVAL);
  };

  /**
   * Handle window focus - restore app ID if on store page
   */
  const handleFocus = async (): Promise<void> => {
    if (window.location.pathname.includes(ROUTES.STEAM_WEB) && lastKnownAppId) {
      await CACHE.setValue(CACHE.APP_ID_KEY, lastKnownAppId);
      getCurrentAppID();
    }
  };

  /**
   * Fetch current tabs and find Steam store app ID
   */
  const getCurrentAppID = async (): Promise<void> => {
    let tabs: Tab[] = [];

    try {
      const response = await fetchNoCors(API.CEF_DEBUG);
      tabs = JSON.parse(await response.text()) || [];
    } catch {
      tabs = [];
    }

    // Find Steam store tab
    const storeTab = tabs.find((tab) => isSteamStoreUrl(tab.url));

    // Check for ITAD (IsThereAnyDeal) - if found, keep polling but don't update
    const itadTab = tabs.find((tab) => tab.url.includes('isthereanydeal.com'));

    if (itadTab) {
      oldUrl = '';
      startPoll();
      return;
    }

    if (storeTab?.url) {
      const appId = extractAppIdFromUrl(storeTab.url);

      // Only update if URL changed or we don't have a known app ID
      if (storeTab.url !== oldUrl || !lastKnownAppId) {
        oldUrl = storeTab.url;

        if (appId) {
          lastKnownAppId = appId;
          await CACHE.setValue(CACHE.APP_ID_KEY, appId);
        } else {
          lastKnownAppId = null;
          await CACHE.setValue(CACHE.APP_ID_KEY, '');
        }
      }

      startPoll();
    } else {
      // No store tab found
      if (lastKnownAppId && document.hasFocus()) {
        // Keep the last known app ID if we have focus
        await CACHE.setValue(CACHE.APP_ID_KEY, lastKnownAppId);
      } else {
        // Clear everything
        clearPoll();
        lastKnownAppId = null;
        await CACHE.setValue(CACHE.APP_ID_KEY, '');
      }
    }
  };

  // Add event listeners
  window.addEventListener('focus', handleFocus);

  // Listen for navigation changes
  const unlisten = History.listen(async (info) => {
    try {
      if (info.pathname === ROUTES.STEAM_WEB.replace('/', '')) {
        getCurrentAppID();
      } else if (info.pathname.includes('steamweb')) {
        getCurrentAppID();
      } else {
        clearPoll();
        lastKnownAppId = null;
        CACHE.setValue(CACHE.APP_ID_KEY, '');
      }
    } catch {
      clearPoll();
      lastKnownAppId = null;
      CACHE.setValue(CACHE.APP_ID_KEY, '');
    }
  });

  // Return cleanup function
  return () => {
    unlisten();
    clearPoll();
    window.removeEventListener('focus', handleFocus);
    lastKnownAppId = null;
    CACHE.setValue(CACHE.APP_ID_KEY, '');
  };
}
