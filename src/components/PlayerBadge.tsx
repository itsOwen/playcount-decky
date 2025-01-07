import { Navigation } from '@decky/ui';
import { loadSettings, BadgePosition, subscribeToSettings } from '../utils/Settings';

interface PlayerBadgeProps {
  count: string;
  appId?: string;
}

const getBadgeColor = (count: string): string => {
  if (!count || count === "No data" || count === "Error") return '#686868';
  const playerCount = parseInt(count.replace(/,/g, ''));
  if (playerCount > 100000) return '#B4C7DC'; // Platinum
  if (playerCount > 50000) return '#CFB53B'; // Gold
  if (playerCount > 10000) return '#A6A6A6'; // Silver
  if (playerCount > 1000) return '#CD7F32'; // Bronze
  return '#686868'; // Base color for low counts
};

const getPositionStyle = (position: BadgePosition) => {
  switch (position) {
    case 'top-left':
      return { top: '50px', left: '20px' };
    case 'top-right':
    default:
      return { top: '50px', right: '20px' };
  }
};

export const PlayerBadge = ({ count, appId }: PlayerBadgeProps) => {
  const [settings, setSettings] = window.SP_REACT.useState(loadSettings());

  window.SP_REACT.useEffect(() => {
    // Subscribe to settings changes
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  const positionStyle = getPositionStyle(settings.badgePosition);
  const baseSize = 12;

  return window.SP_REACT.createElement(
    'div',
    {
      className: "playerBadge",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (appId) {
          Navigation.NavigateToExternalWeb(`https://steamcharts.com/app/${appId}`);
        }
      },
      style: {
        position: 'absolute',
        ...positionStyle,
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: getBadgeColor(count),
        padding: `${4 * settings.badgeSize}px ${8 * settings.badgeSize}px`,
        borderRadius: settings.roundedCorners ? `${12 * settings.badgeSize}px` : '0px',
        cursor: 'pointer',
        fontSize: `${baseSize * settings.badgeSize}px`,
        color: '#ffffff',
        zIndex: 1000,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }
    },
    [
      window.SP_REACT.createElement(
        'div',
        {
          key: "status-dot",
          style: {
            width: `${8 * settings.badgeSize}px`,
            height: `${8 * settings.badgeSize}px`,
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            marginRight: `${6 * settings.badgeSize}px`,
            boxShadow: '0 0 4px rgba(76,175,80,0.5)'
          }
        }
      ),
      window.SP_REACT.createElement(
        'span',
        { key: "text" },
        count === "No data" || count === "Error" ? count : `${count} Online`
      )
    ]
  );
};