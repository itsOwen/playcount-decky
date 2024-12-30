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
import { patchStore } from "./patches/StorePatch";
import { patchLibrary } from "./patches/LibraryPatch";
import { Cache } from "./utils/Cache";

export default definePlugin(() => {
  Cache.init();

  // Add global component
  routerHook.addGlobalComponent(
    "PlayerCount",
    () => <PlayerCount />
  );

  // Initialize patches
  const storePatch = patchStore();
  const libraryPatch = patchLibrary();

  return {
    title: <div className={staticClasses.Title}>Player Pulse</div>,
    content: (
      <PanelSection title="About">
        <PanelSectionRow>
          <div>Shows current player count for your Steam games.</div>
        </PanelSectionRow>
        <PanelSection title="Connect with Me">
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => window.open("https://github.com/itsOwen", "_blank")}
            >
              <FaGithub style={{ marginRight: "8px" }} />
              GitHub
            </ButtonItem>
            <ButtonItem
              layout="below"
              onClick={() => window.open("https://twitter.com/owensingh_", "_blank")}
            >
              <FaTwitter style={{ marginRight: "8px" }} />
              Twitter
            </ButtonItem>
            <ButtonItem
              layout="below"
              onClick={() => window.open("https://instagram.com/owensingh_", "_blank")}
            >
              <FaInstagram style={{ marginRight: "8px" }} />
              Instagram
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
        <PanelSection title="Contact">
          <PanelSectionRow>
            <div>Email: owensingh72@gmail.com</div>
          </PanelSectionRow>
        </PanelSection>
      </PanelSection>
    ),
    icon: <FaUsers />,
    onDismount() {
      routerHook.removeGlobalComponent("PlayerCount");
      if (storePatch) storePatch();
      if (libraryPatch) libraryPatch();
    },
  };
});