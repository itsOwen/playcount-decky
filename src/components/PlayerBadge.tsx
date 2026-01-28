/**
 * PlayerBadge component - displays player count badge on library pages
 */

import { Navigation, showModal, Button } from '@decky/ui';
import { useSettingsValue } from '../hooks/useSettings';
import { getIconComponent } from '../utils/IconUtils';
import { getBadgeColor, createIconShadow } from '../utils/colors';
import { AnimatedCounter } from './AnimatedCounter';
import { PlayerStatsModal } from './PlayerStats';
import { API, COLORS, UI } from '../constants';
import type { BadgePosition } from '../utils/Settings';
import type { PlayerBadgeProps } from '../types/index';

const { useMemo, useCallback } = window.SP_REACT;

/**
 * Get CSS position styles for badge placement
 */
const getPositionStyle = (position: BadgePosition): Record<string, string> => {
  switch (position) {
    case 'top-left':
      return { top: '50px', left: '20px' };
    case 'top-right':
    default:
      return { top: '50px', right: '20px' };
  }
};

export const PlayerBadge = ({ count, appId }: PlayerBadgeProps) => {
  const settings = useSettingsValue();

  // Memoize computed values
  const positionStyle = useMemo(
    () => getPositionStyle(settings.badgePosition),
    [settings.badgePosition]
  );

  const bgColor = useMemo(
    () => getBadgeColor(count, settings.useCustomColors ? settings.customBadgeColor : undefined),
    [count, settings.useCustomColors, settings.customBadgeColor]
  );

  const iconColor = useMemo(
    () => settings.useCustomColors ? settings.customIconColor : COLORS.ICON_DEFAULT,
    [settings.useCustomColors, settings.customIconColor]
  );

  const iconSize = useMemo(
    () => UI.ICON_BASE_SIZE * settings.badgeSize,
    [settings.badgeSize]
  );

  // Get icon component once
  const iconData = useMemo(
    () => getIconComponent(settings.libraryIconType, iconColor, iconSize),
    [settings.libraryIconType, iconColor, iconSize]
  );

  // Memoize click handler
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!appId) return;

      // Ctrl/Cmd + Click opens Steam Charts
      if (e.ctrlKey || e.metaKey) {
        Navigation.NavigateToExternalWeb(`${API.STEAM_CHARTS_BASE}${appId}`);
      } else {
        // Regular click opens stats modal
        showModal(
          window.SP_REACT.createElement(PlayerStatsModal, {
            appId,
            closeModal: () => Navigation.CloseSideMenus(),
          })
        );
      }
    },
    [appId]
  );

  // Render player count (with or without animation)
  const renderCount = useCallback(() => {
    if (typeof count === 'object' || !count) return 'Loading...';

    const isLoading = count === 'Loading...';

    if (settings.enableCountAnimation) {
      return window.SP_REACT.createElement(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } },
        [
          window.SP_REACT.createElement(AnimatedCounter, {
            key: 'counter',
            finalValue: count,
            isLoading,
          }),
          !settings.hideLibraryOnlineText &&
            window.SP_REACT.createElement('span', { key: 'online-text' }, 'Online'),
        ]
      );
    }

    return settings.hideLibraryOnlineText ? count : `${count} Online`;
  }, [count, settings.enableCountAnimation, settings.hideLibraryOnlineText]);

  // Don't render if disabled or error state
  if (!settings.showLibraryCount || count === 'Error' || count === 'No data') {
    return null;
  }

  const textColor = settings.useCustomColors ? settings.customTextColor : COLORS.TEXT_PRIMARY;

  return window.SP_REACT.createElement(
    'div',
    {
      className: 'playerBadge',
      style: {
        position: 'absolute',
        ...positionStyle,
        zIndex: 1000,
      },
    },
    window.SP_REACT.createElement(
      Button as React.ComponentType<Record<string, unknown>>,
      {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${UI.DEFAULT_PADDING * settings.badgeSize}px ${UI.DEFAULT_GAP * settings.badgeSize}px`,
          backgroundColor: bgColor,
          borderRadius: settings.roundedCorners
            ? `${UI.BADGE_BASE_SIZE * settings.badgeSize}px`
            : '0px',
          fontSize: `${UI.BADGE_BASE_SIZE * settings.badgeSize}px`,
          color: textColor,
          minWidth: 'auto',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: 'none',
        },
        onClick: handleClick,
      },
      [
        // Icon container
        window.SP_REACT.createElement(
          'div',
          {
            key: 'status-icon',
            style: {
              display: 'flex',
              alignItems: 'center',
              marginRight: `${6 * settings.badgeSize}px`,
            },
          },
          window.SP_REACT.createElement(iconData.component, {
            ...iconData.props,
            style: {
              filter: createIconShadow(iconColor),
              minWidth: `${iconSize}px`,
            },
          })
        ),
        // Count text
        window.SP_REACT.createElement('span', { key: 'text' }, renderCount()),
      ]
    )
  );
};

export default PlayerBadge;
