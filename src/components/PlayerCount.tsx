import { useEffect, useState, useRef } from 'react';
import { fetchNoCors } from '@decky/api';
import { Navigation, staticClasses } from '@decky/ui';
import { CACHE } from '../utils/Cache';

interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  }
}

export const PlayerCount = () => {
  const [appId, setAppId] = useState<string | undefined>(undefined);
  const [playerCount, setPlayerCount] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

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

    loadAppId();
    CACHE.subscribe("PlayerCount", loadAppId);

    const handleRouteChange = () => {
      // Check if we're on either a game page or store page
      const isOnGamePage = window.location.pathname.includes('/library/app/');
      const isOnStorePage = window.location.pathname.includes('/steamweb');

      if (!isOnGamePage && !isOnStorePage) {
        setIsVisible(false);
        setAppId(undefined);
        CACHE.setValue(CACHE.APP_ID_KEY, "");  // Clear cache when leaving both pages
      }
    };

    // Listen for both navigation events and history changes
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);

    // Initial check
    handleRouteChange();

    return () => {
      mountedRef.current = false;
      CACHE.unsubscribe("PlayerCount");
      setIsVisible(false);
      setAppId(undefined);
      setPlayerCount("");
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
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
          setPlayerCount(`🟢 Currently Playing: ${formattedCount}`);
          setIsVisible(true);
        } else {
          setPlayerCount("No player data available");
          setIsVisible(true);
        }
      } catch (error) {
        if (!mountedRef.current) return;
        setPlayerCount(error instanceof Error ? `Error: ${error.message}` : "Error fetching player count");
        setIsVisible(true);
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
  }, [appId]);

  if (!isVisible) return null;

  return (
    <div
      className={staticClasses.PanelSectionTitle}
      onClick={() => {
        if (appId) {
          Navigation.NavigateToExternalWeb(`https://steamcharts.com/app/${appId}`);
        }
      }}
      style={{
        width: 420,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "7px 16px",
        fontSize: "16px",
        zIndex: 7002,
        position: "fixed",
        bottom: 2,
        left: '50%',
        transform: `translateX(-50%)`,
        color: "#ffffff",
        cursor: "pointer",
      }}
    >
      {playerCount}
    </div>
  );
};