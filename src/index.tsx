/**
 * PlayCount - Decky plugin for Steam Deck
 * Shows current player counts for Steam games
 */

import { routerHook } from '@decky/api';
import {
  definePlugin,
  staticClasses,
  ButtonItem,
  PanelSection,
  PanelSectionRow,
} from '@decky/ui';
import { FaUsers, FaGithub, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { PlayerCount } from './components/PlayerCount';
import { Settings } from './components/Settings';
import { patchStore } from './patches/StorePatch';
import { patchLibrary } from './patches/LibraryPatch';
import { Cache, CACHE } from './utils/Cache';
import { SOCIAL_LINKS, COLORS } from './constants';

// Social button colors
const SOCIAL_COLORS = {
  discord: '#5865F2',
  github: COLORS.TEXT_PRIMARY,
  email: '#8B5CF6',
} as const;

interface SocialButtonProps {
  icon: JSX.Element;
  text: string;
  url: string;
}

/**
 * Social media button component
 */
const SocialButton = ({ icon, text, url }: SocialButtonProps) => {
  return window.SP_REACT.createElement(
    PanelSectionRow,
    null,
    window.SP_REACT.createElement(
      ButtonItem,
      {
        layout: 'below',
        onClick: () => window.open(url, '_blank'),
      },
      window.SP_REACT.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '2px',
          },
        },
        [
          window.SP_REACT.createElement(
            'div',
            {
              key: 'icon',
              style: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px',
              },
            },
            icon
          ),
          window.SP_REACT.createElement(
            'span',
            {
              key: 'text',
              style: {
                flex: 1,
                fontSize: '15px',
              },
            },
            text
          ),
        ]
      )
    )
  );
};

/**
 * Plugin definition
 */
export default definePlugin(() => {
  // Initialize cache
  Cache.init();

  // Add global player count component
  routerHook.addGlobalComponent('PlayerCount', () =>
    window.SP_REACT.createElement(PlayerCount)
  );

  // Apply patches
  const storePatch = patchStore();
  const libraryPatch = patchLibrary();

  return {
    // Plugin title
    title: window.SP_REACT.createElement(
      'div',
      { className: staticClasses.Title },
      'PlayCount'
    ),

    // Plugin content (settings panel)
    content: window.SP_REACT.createElement('div', null, [
      // Settings component
      window.SP_REACT.createElement(Settings, { key: 'settings' }),

      // About section
      window.SP_REACT.createElement(
        PanelSection,
        { key: 'about-section', title: 'About' },
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: 'about-row' },
          window.SP_REACT.createElement(
            'div',
            { style: { padding: '10px 0' } },
            'Shows current player count for your Steam games.'
          )
        )
      ),

      // Social links section
      window.SP_REACT.createElement(
        PanelSection,
        { key: 'social-section', title: 'Connect with Me' },
        [
          window.SP_REACT.createElement(SocialButton, {
            key: 'discord',
            icon: window.SP_REACT.createElement(FaDiscord, {
              color: SOCIAL_COLORS.discord,
              size: 24,
            }),
            text: 'Join our Discord',
            url: SOCIAL_LINKS.DISCORD,
          }),
          window.SP_REACT.createElement(SocialButton, {
            key: 'github',
            icon: window.SP_REACT.createElement(FaGithub, {
              color: SOCIAL_COLORS.github,
              size: 24,
            }),
            text: 'Github',
            url: SOCIAL_LINKS.GITHUB,
          }),
          window.SP_REACT.createElement(SocialButton, {
            key: 'email',
            icon: window.SP_REACT.createElement(FaEnvelope, {
              color: SOCIAL_COLORS.email,
              size: 24,
            }),
            text: 'Email Me',
            url: SOCIAL_LINKS.EMAIL,
          }),
        ]
      ),
    ]),

    // Plugin icon
    icon: window.SP_REACT.createElement(FaUsers),

    // Cleanup on unmount
    onDismount() {
      routerHook.removeGlobalComponent('PlayerCount');

      // Clean up patches
      if (storePatch) storePatch();
      if (libraryPatch) libraryPatch();

      // Clean up cache
      if (CACHE) {
        CACHE.destroy();
      }
    },
  };
});
