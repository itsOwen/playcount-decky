import { FC } from 'react';
import { Navigation, staticClasses, ServerAPI } from 'decky-frontend-lib';
import { useEffect, useState } from 'react';
import { CACHE } from '../utils/Cache';

interface PlayerCountProps {
  serverAPI: ServerAPI;
}

interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  }
}

export const PlayerCount: FC<PlayerCountProps> = ({ serverAPI }) => {
  const [appId, setAppId] = useState<string | undefined>(undefined);
  const [playerCount, setPlayerCount] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    function loadAppId() {
      CACHE.loadValue(CACHE.APP_ID_KEY).then((id) => {
        console.log("Loaded AppID:", id);  // Debug log
        setAppId(id);
      });
    }
    loadAppId();
    CACHE.subscribe("PlayerCount", loadAppId);

    return () => {
      CACHE.unsubscribe("PlayerCount");
    };
  }, []);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      if (!appId) {
        setIsVisible(false);
        return;
      }

      console.log("Fetching player count for appId:", appId);  // Debug log

      try {
        const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;
        console.log("Fetching URL:", url);  // Debug log

        const response = await serverAPI.fetchNoCors<{ body: string }>(
          url,
          {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        console.log("Raw response:", response);  // Debug log

        if (response.success) {
          try {
            const data: SteamPlayerResponse = JSON.parse(response.result.body);
            console.log("Parsed data:", data);  // Debug log

            if (data.response.result === 1) {
              const formattedCount = new Intl.NumberFormat().format(data.response.player_count);
              setPlayerCount(`🟢 Currently Playing: ${formattedCount}`);
              setIsVisible(true);
            } else {
              setPlayerCount("No player data available");
              setIsVisible(true);
            }
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            console.error("Response body:", response.result.body);
            setPlayerCount("Error parsing data");
            setIsVisible(true);
          }
        } else {
          console.error("Fetch failed:", response);  // Debug log
          throw new Error("Failed to fetch player count");
        }
      } catch (error) {
        console.error("Error in fetchPlayerCount:", error);
        if (error instanceof Error) {
          setPlayerCount(`Error: ${error.message}`);
        } else {
          setPlayerCount("Error fetching player count");
        }
        setIsVisible(true);
      }
    };

    fetchPlayerCount();
  }, [appId, serverAPI]);

  return isVisible ? (
    <div
      className={staticClasses.PanelSectionTitle}
      onClick={() => {
        if (appId) {
          Navigation.NavigateToExternalWeb(
            `https://steamcharts.com/app/${appId}`
          );
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
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 100}%)`,
        transition: "transform 0.22s cubic-bezier(0, 0.73, 0.48, 1)",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        cursor: "pointer",
      }}
    >
      {playerCount}
    </div>
  ) : null;
};