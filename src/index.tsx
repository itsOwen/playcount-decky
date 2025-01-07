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
import { FaUsers, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import { PlayerCount } from "./components/PlayerCount";
import { Settings } from "./components/Settings";
import { patchStore } from "./patches/StorePatch";
import { patchLibrary } from "./patches/LibraryPatch";
import { Cache } from "./utils/Cache";

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
          [
            window.SP_REACT.createElement(
              PanelSectionRow,
              { key: "about-row" },
              window.SP_REACT.createElement(
                'div',
                null,
                "Shows current player count for your Steam games."
              )
            ),
            window.SP_REACT.createElement(
              PanelSection,
              { key: "connect-section", title: "Connect with Me" },
              window.SP_REACT.createElement(
                PanelSectionRow,
                null,
                [
                  window.SP_REACT.createElement(
                    ButtonItem,
                    {
                      key: "github-button",
                      layout: "below",
                      onClick: () => window.open("https://github.com/itsOwen", "_blank")
                    },
                    [
                      window.SP_REACT.createElement(FaGithub, { 
                        key: "github-icon",
                        style: { marginRight: "8px" } 
                      }),
                      "GitHub"
                    ]
                  ),
                  window.SP_REACT.createElement(
                    ButtonItem,
                    {
                      key: "twitter-button",
                      layout: "below",
                      onClick: () => window.open("https://twitter.com/owensingh_", "_blank")
                    },
                    [
                      window.SP_REACT.createElement(FaTwitter, { 
                        key: "twitter-icon",
                        style: { marginRight: "8px" } 
                      }),
                      "Twitter"
                    ]
                  ),
                  window.SP_REACT.createElement(
                    ButtonItem,
                    {
                      key: "instagram-button",
                      layout: "below",
                      onClick: () => window.open("https://instagram.com/owensingh_", "_blank")
                    },
                    [
                      window.SP_REACT.createElement(FaInstagram, { 
                        key: "instagram-icon",
                        style: { marginRight: "8px" } 
                      }),
                      "Instagram"
                    ]
                  )
                ]
              )
            ),
            window.SP_REACT.createElement(
              PanelSection,
              { key: "contributors-section", title: "Contributors" },
              window.SP_REACT.createElement(
                PanelSectionRow,
                null,
                window.SP_REACT.createElement(
                  'div',
                  { 
                    style: { 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px' 
                    } 
                  },
                  [
                    window.SP_REACT.createElement('div', { key: "contrib-1" }, "OMGDuke"),
                    window.SP_REACT.createElement('div', { key: "contrib-2" }, "JtdeGraaf"),
                    window.SP_REACT.createElement('div', { key: "contrib-3" }, "eXhumer")
                  ]
                )
              )
            )
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