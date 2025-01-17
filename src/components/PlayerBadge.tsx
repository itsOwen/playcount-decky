import { Navigation, showModal, Button } from '@decky/ui';
import { loadSettings, BadgePosition, subscribeToSettings } from '../utils/Settings';
import { getIconComponent } from '../utils/IconUtils';
import { AnimatedCounter } from './AnimatedCounter';
import { PlayerStatsModal } from './PlayerStats';

interface PlayerBadgeProps {
  count: string;
  appId?: string;
}

const getBadgeColor = (count: string, settings: any): string => {
  if (settings.useCustomColors) {
    return settings.customBadgeColor;
  }

  if (!count || count === "No data" || count === "Error") return '#686868';
  const playerCount = parseInt(count.replace(/,/g, ''));
  if (playerCount > 50000) return '#e80e0e';
  if (playerCount > 10000) return '#CFB53B';
  if (playerCount > 5000) return '#A6A6A6';
  if (playerCount > 1000) return '#CD7F32';
  return '#4B9EEA';
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

  if (!settings.showLibraryCount || count === "Error" || count === "No data") return null;

  const positionStyle = getPositionStyle(settings.badgePosition);
  const baseSize = 12;
  const iconSize = 14 * settings.badgeSize;
  const bgColor = getBadgeColor(count, settings);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (appId) {
      if (e.ctrlKey || e.metaKey) {
        Navigation.NavigateToExternalWeb(`https://steamcharts.com/app/${appId}`);
      } else {
        showModal(
          window.SP_REACT.createElement(PlayerStatsModal, {
            appId: appId,
            closeModal: () => {
              Navigation.CloseSideMenus();
            }
          })
        );
      }
    }
  };

  const renderCount = () => {
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
      style: {
        position: 'absolute',
        ...positionStyle,
        zIndex: 1000,
      }
    },
    window.SP_REACT.createElement(
      Button as any,
      {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${4 * settings.badgeSize}px ${8 * settings.badgeSize}px`,
          backgroundColor: bgColor,
          borderRadius: settings.roundedCorners ? `${12 * settings.badgeSize}px` : '0px',
          fontSize: `${baseSize * settings.badgeSize}px`,
          color: settings.useCustomColors ? settings.customTextColor : '#ffffff',
          minWidth: 'auto',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: 'none'
        },
        onClick: handleClick
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
    )
  );
};