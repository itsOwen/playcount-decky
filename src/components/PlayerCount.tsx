/**
 * PlayerCount component - displays player count on Steam store pages
 */

import { Navigation, staticClasses } from '@decky/ui';
import { CACHE } from '../utils/Cache';
import { useSettingsValue } from '../hooks/useSettings';
import { getIconComponent } from '../utils/IconUtils';
import { fetchPlayerCount } from '../utils/api';
import { createIconShadow } from '../utils/colors';
import {
  TIMING,
  ROUTES,
  COLORS,
  UI,
  API,
} from '../constants';

const { useState, useEffect, useRef, useCallback } = window.SP_REACT;

export const PlayerCount = () => {
  const [appId, setAppId] = useState<string | undefined>(undefined);
  const [playerCount, setPlayerCount] = useState<string | JSX.Element>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const settings = useSettingsValue();
  const mountedRef = useRef<boolean>(true);

  // Load app ID from cache
  const loadAppId = useCallback(async () => {
    if (!mountedRef.current) return;

    const id = await CACHE.loadValue<string>(CACHE.APP_ID_KEY);
    if (!id || typeof id !== 'string') {
      setIsVisible(false);
      setAppId(undefined);
      return;
    }
    setAppId(id);
  }, []);

  // Handle route changes
  const handleRouteChange = useCallback(() => {
    const isOnGamePage = window.location.pathname.includes(ROUTES.LIBRARY_APP);
    const isOnStorePage = window.location.pathname.includes(ROUTES.STEAM_WEB);

    if (!isOnGamePage && !isOnStorePage) {
      setIsVisible(false);
      setAppId(undefined);
      CACHE.setValue(CACHE.APP_ID_KEY, '');
    }
  }, []);

  // Handle focus event
  const handleFocus = useCallback(() => {
    if (window.location.pathname.includes(ROUTES.STEAM_WEB)) {
      loadAppId();
    }
  }, [loadAppId]);

  // Setup listeners and subscriptions
  useEffect(() => {
    mountedRef.current = true;

    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);

    loadAppId();
    CACHE.subscribe('PlayerCount', loadAppId);
    handleRouteChange();

    return () => {
      mountedRef.current = false;
      CACHE.unsubscribe('PlayerCount');
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
    };
  }, [handleFocus, handleRouteChange, loadAppId]);

  // Fetch and display player count
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const fetchAndDisplayCount = async () => {
      if (!appId || !mountedRef.current) {
        setIsVisible(false);
        return;
      }

      const result = await fetchPlayerCount(appId);

      if (!mountedRef.current) return;

      if (result.success) {
        const iconColor = settings.useCustomColors
          ? settings.customIconColor
          : COLORS.ICON_DEFAULT;
        const iconSize = Math.floor(UI.ICON_BASE_SIZE * settings.storeTextSize);
        const iconData = getIconComponent(settings.storeIconType, iconColor, iconSize);

        const displayText = settings.hideStoreOnlineText
          ? result.formatted
          : `${result.formatted} Online`;

        setPlayerCount(
          window.SP_REACT.createElement(
            'span',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: `${UI.DEFAULT_GAP}px`,
                marginLeft: '1px',
              },
            },
            [
              '|',
              window.SP_REACT.createElement(iconData.component, {
                ...iconData.props,
                key: 'status-icon',
                style: {
                  marginLeft: `${UI.DEFAULT_GAP}px`,
                  filter: createIconShadow(iconColor),
                },
              }),
              window.SP_REACT.createElement(
                'span',
                { key: 'count-text', style: { textTransform: 'none' } },
                displayText
              ),
            ]
          )
        );
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    if (appId) {
      fetchAndDisplayCount();
      interval = setInterval(fetchAndDisplayCount, TIMING.PLAYER_COUNT_REFRESH);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    appId,
    settings.storeTextSize,
    settings.storeIconType,
    settings.hideStoreOnlineText,
    settings.useCustomColors,
    settings.customIconColor,
  ]);

  // Handle click to open Steam Charts
  const handleClick = useCallback(() => {
    if (appId) {
      Navigation.NavigateToExternalWeb(`${API.STEAM_CHARTS_BASE}${appId}`);
    }
  }, [appId]);

  // Don't render if not visible or setting disabled
  if (!isVisible || !settings.showStoreCount) return null;

  const isOnStorePage = window.location.pathname.includes(ROUTES.STEAM_WEB);
  if (!isOnStorePage) return null;

  return window.SP_REACT.createElement(
    'div',
    {
      className: staticClasses.PanelSectionTitle,
      onClick: handleClick,
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '7px 12px',
        fontSize: `${UI.STORE_TEXT_BASE_SIZE * settings.storeTextSize}px`,
        zIndex: 7002,
        position: 'fixed',
        bottom: settings.storeTextBottom,
        left: `${settings.storeTextPosition}%`,
        transform: `translateX(-${settings.storeTextPosition}%)`,
        color: COLORS.TEXT_PRIMARY,
        cursor: 'pointer',
      },
    },
    playerCount
  );
};

export default PlayerCount;
