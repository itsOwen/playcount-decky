import { Navigation } from '@decky/ui';
import { loadSettings, BadgePosition, subscribeToSettings } from '../utils/Settings';
import { getIconComponent } from '../utils/IconUtils';
import { AnimatedCounter } from './AnimatedCounter';

interface PlayerBadgeProps {
  count: string;
  appId?: string;
}

const getBadgeColor = (count: string): string => {
  if (!count || count === "No data" || count === "Error") return '#686868';
  const playerCount = parseInt(count.replace(/,/g, ''));
  if (playerCount > 50000) return '#00ECEC'; // Platinum - Bright Turquoise
  if (playerCount > 10000) return '#CFB53B'; // Gold
  if (playerCount > 5000) return '#A6A6A6';  // Silver
  if (playerCount > 1000) return '#CD7F32';  // Bronze
  return '#4B9EEA';                          // Base - Electric Blue
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
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  // Return null if there's an error or no data
  if (!settings.showLibraryCount || count === "Error" || count === "No data") return null;

  const positionStyle = getPositionStyle(settings.badgePosition);
  const baseSize = 12;
  const iconSize = 14 * settings.badgeSize; // Increased base icon size from 8 to 14

  const renderCount = () => {
    // Handle the case where count might be an object
    if (typeof count === 'object' || !count) return "Loading...";
    
    const isLoading = count === "Loading...";

    if (settings.enableCountAnimation) {
      return window.SP_REACT.createElement(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } },
        [
          window.SP_REACT.createElement(AnimatedCounter, {
            key: 'counter',
            finalValue: count,
            isLoading: isLoading
          }),
          !settings.hideLibraryOnlineText && window.SP_REACT.createElement(
            'span',
            { key: 'online-text' },
            'Online'
          )
        ]
      );
    }

    return settings.hideLibraryOnlineText ? count : `${count} Online`;
  };

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
          key: "status-icon",
          style: {
            display: 'flex',
            alignItems: 'center',
            marginRight: `${6 * settings.badgeSize}px`,
          }
        },
        window.SP_REACT.createElement(
          getIconComponent(settings.libraryIconType, '#4CAF50', iconSize).component,
          {
            ...getIconComponent(settings.libraryIconType, '#4CAF50', iconSize).props,
            style: { 
              filter: 'drop-shadow(0 0 2px rgba(76,175,80,0.5))',
              minWidth: `${iconSize}px`
            }
          }
        )
      ),
      window.SP_REACT.createElement(
        'span',
        { key: "text" },
        renderCount()
      )
    ]
  );
};