import { useEffect, useState, useRef } from 'react';
import { fetchNoCors } from '@decky/api';
import { Navigation, staticClasses } from '@decky/ui';
import { CACHE } from '../utils/Cache';
import { loadSettings, subscribeToSettings } from '../utils/Settings';
import { getIconComponent } from '../utils/IconUtils';

interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  }
}

const getRgbFromHex = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  let r, g, b;
  
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }
  
  return `${r}, ${g}, ${b}`;
};

export const PlayerCount = () => {
  const [appId, setAppId] = useState<string | undefined>(undefined);
  const [playerCount, setPlayerCount] = useState<string | JSX.Element>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState(loadSettings());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const unsubscribeSettings = subscribeToSettings(setSettings);

    async function loadAppId() {
      if (!mountedRef.current) return;
      const id = await CACHE.loadValue(CACHE.APP_ID_KEY);
      if (!id) {
        setIsVisible(false);
        setAppId(undefined);
        return;
      }
      setAppId(id);
    }

    const handleFocus = () => {
      if (window.location.pathname.includes('/steamweb')) {
        loadAppId();
      }
    };

    window.addEventListener('focus', handleFocus);
    loadAppId();
    CACHE.subscribe("PlayerCount", loadAppId);

    const handleRouteChange = () => {
      const isOnGamePage = window.location.pathname.includes('/library/app/');
      const isOnStorePage = window.location.pathname.includes('/steamweb');

      if (!isOnGamePage && !isOnStorePage) {
        setIsVisible(false);
        setAppId(undefined);
        CACHE.setValue(CACHE.APP_ID_KEY, "");
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);

    handleRouteChange();

    return () => {
      mountedRef.current = false;
      CACHE.unsubscribe("PlayerCount");
      unsubscribeSettings();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
      setIsVisible(false);
      setAppId(undefined);
      setPlayerCount("");
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const fetchPlayerCount = async () => {
      if (!appId || !mountedRef.current) {
        setIsVisible(false);
        return;
      }

      try {
        const response = await fetchNoCors(
          `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`,
          {
            method: "GET",
            headers: { 'Accept': 'application/json' }
          }
        );

        if (!mountedRef.current) return;

        const data: SteamPlayerResponse = JSON.parse(await response.text());

        if (data.response.result === 1) {
          const formattedCount = new Intl.NumberFormat().format(data.response.player_count);
          const displayCount = typeof formattedCount === 'object' ? "Loading..." : formattedCount;

          const iconColor = settings.useCustomColors ? settings.customIconColor : '#4CAF50';
          const iconRgb = getRgbFromHex(iconColor);
          const iconSize = Math.floor(14 * settings.storeTextSize);

          setPlayerCount(
            window.SP_REACT.createElement('span', { 
              style: { 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginLeft: '1px' 
              } 
            }, [
              '|',
              window.SP_REACT.createElement(
                getIconComponent(settings.storeIconType, iconColor, iconSize).component,
                {
                  ...getIconComponent(settings.storeIconType, iconColor, iconSize).props,
                  key: "status-icon",
                  style: {
                    marginLeft: '8px',
                    filter: `drop-shadow(0 0 2px rgba(${iconRgb}, 0.5))`
                  }
                }
              ),
              window.SP_REACT.createElement('span', {
                style: { textTransform: 'none' }
              }, settings.hideStoreOnlineText ? displayCount : `${displayCount} Online`)
            ])
          );
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        if (!mountedRef.current) return;
        setIsVisible(false);
      }
    };

    if (appId) {
      fetchPlayerCount();
      interval = setInterval(fetchPlayerCount, 30000);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [appId, settings.storeTextSize, settings.storeIconType, settings.hideStoreOnlineText, settings.useCustomColors, settings.customIconColor]);

  if (!isVisible || !settings.showStoreCount) return null;

  const isOnStorePage = window.location.pathname.includes('/steamweb');
  if (!isOnStorePage) return null;

  return window.SP_REACT.createElement(
    'div',
    {
      className: staticClasses.PanelSectionTitle,
      onClick: () => {
        if (appId) {
          Navigation.NavigateToExternalWeb(`https://steamcharts.com/app/${appId}`);
        }
      },
      style: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "7px 12px",
        fontSize: `${12 * settings.storeTextSize}px`,
        zIndex: 7002,
        position: "fixed",
        bottom: settings.storeTextBottom,
        left: `${settings.storeTextPosition}%`,
        transform: `translateX(-${settings.storeTextPosition}%)`,
        color: "#ffffff",
        cursor: "pointer",
      }
    },
    playerCount
  );
};

export default PlayerCount;