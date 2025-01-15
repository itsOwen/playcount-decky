import {
  routerHook,
} from "@decky/api";
import {
  definePlugin,
  staticClasses,
  ButtonItem,
  PanelSection,
  PanelSectionRow,
} from "@decky/ui";
import { FaUsers, FaGithub, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { PlayerCount } from "./components/PlayerCount";
import { Settings } from "./components/Settings";
import { patchStore } from "./patches/StorePatch";
import { patchLibrary } from "./patches/LibraryPatch";
import { Cache } from "./utils/Cache";

const SocialButton = ({ icon, text, url }: { icon: JSX.Element, text: string, url: string }) => {
  return window.SP_REACT.createElement(
    PanelSectionRow,
    null,
    window.SP_REACT.createElement(
      ButtonItem,
      {
        layout: "below",
        onClick: () => window.open(url, "_blank")
      },
      window.SP_REACT.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '2px'
          }
        },
        [
          window.SP_REACT.createElement(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px'
              }
            },
            icon
          ),
          window.SP_REACT.createElement(
            'span',
            {
              style: {
                flex: 1,
                fontSize: '15px'
              }
            },
            text
          )
        ]
      )
    )
  );
};

export default definePlugin(() => {
  Cache.init();

  routerHook.addGlobalComponent(
    "PlayerCount",
    () => window.SP_REACT.createElement(PlayerCount)
  );

  const storePatch = patchStore();
  const libraryPatch = patchLibrary();

  return {
    title: window.SP_REACT.createElement('div', { className: staticClasses.Title }, "PlayCount"),
    content: window.SP_REACT.createElement(
      'div',
      null,
      [
        window.SP_REACT.createElement(Settings, { key: "settings" }),
        window.SP_REACT.createElement(
          PanelSection,
          { title: "About" },
          window.SP_REACT.createElement(
            PanelSectionRow,
            { key: "about-row" },
            window.SP_REACT.createElement(
              'div',
              { style: { padding: '10px 0' } },
              "Shows current player count for your Steam games."
            )
          )
        ),
        window.SP_REACT.createElement(
          PanelSection,
          { title: "Connect with Me" },
          [
            window.SP_REACT.createElement(SocialButton, {
              icon: window.SP_REACT.createElement(FaDiscord, { color: '#5865F2', size: 24 }),
              text: "Join our Discord",
              url: "https://discord.gg/yourserver"
            }),
            window.SP_REACT.createElement(SocialButton, {
              icon: window.SP_REACT.createElement(FaGithub, { color: '#ffffff', size: 24 }),
              text: "Github",
              url: "https://github.com/itsOwen"
            }),
            window.SP_REACT.createElement(SocialButton, {
              icon: window.SP_REACT.createElement(FaTwitter, { color: '#1DA1F2', size: 24 }),
              text: "Twitter",
              url: "https://twitter.com/owensingh_"
            }),
            window.SP_REACT.createElement(SocialButton, {
              icon: window.SP_REACT.createElement(FaInstagram, { color: '#E4405F', size: 24 }),
              text: "Instagram",
              url: "https://instagram.com/owensingh_"
            })
          ]
        )
      ]
    ),
    icon: window.SP_REACT.createElement(FaUsers),
    onDismount() {
      routerHook.removeGlobalComponent("PlayerCount");
      if (storePatch) storePatch();
      if (libraryPatch) libraryPatch();
    },
  };
});