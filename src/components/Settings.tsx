import {
  PanelSection,
  PanelSectionRow,
  DropdownItem,
  SliderField,
  SingleDropdownOption,
  ToggleField,
  ButtonItem
} from '@decky/ui';
import { BadgePosition, loadSettings, saveSettings, DEFAULT_SETTINGS, IconType } from '../utils/Settings';
import { iconOptions } from '../utils/IconUtils';

export const Settings = () => {
  const [settings, setSettings] = window.SP_REACT.useState(loadSettings());

  const positions: { [key in BadgePosition]: string } = {
    'top-right': 'Top Right',
    'top-left': 'Top Left'
  };

  const positionOptions = Object.entries(positions).map(([value, label]) => ({
    data: value,
    label: label
  }));

  return [
    // Library Badge Settings Section
    window.SP_REACT.createElement(
      PanelSection,
      { title: "Library Badge Settings", key: "library-badge-settings" },
      [
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "show-library-badge-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Show Library Badge",
              description: "Show player count badge in game library",
              checked: settings.showLibraryCount,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  showLibraryCount: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "position-row" },
          window.SP_REACT.createElement(
            DropdownItem,
            {
              label: "Badge Position",
              description: "Choose where the player count badge appears",
              rgOptions: positionOptions,
              selectedOption: settings.badgePosition,
              onChange: (newValue: SingleDropdownOption) => {
                const position = newValue.data as BadgePosition;
                const newSettings = {
                  ...settings,
                  badgePosition: position
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "library-icon-row" },
          window.SP_REACT.createElement(
            DropdownItem,
            {
              label: "Library Badge Icon",
              description: "Choose the icon shown in the library badge",
              rgOptions: iconOptions,
              selectedOption: settings.libraryIconType,
              onChange: (newValue: SingleDropdownOption) => {
                const iconType = newValue.data as IconType;
                const newSettings = {
                  ...settings,
                  libraryIconType: iconType
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "enable-animation-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Smooth Number Animation",
              description: "Enable smooth animation when player count updates",
              checked: settings.enableCountAnimation,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  enableCountAnimation: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "size-row" },
          window.SP_REACT.createElement(
            SliderField,
            {
              label: "Badge Size",
              description: "Adjust the size of the badge",
              value: settings.badgeSize,
              min: 0.7,
              max: 1.5,
              step: 0.1,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  badgeSize: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              },
              notchLabels: [
                { notchIndex: 0, label: "Small" },
                { notchIndex: 4, label: "Default" },
                { notchIndex: 8, label: "Large" }
              ],
              showValue: true
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "hide-library-online-text-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Hide 'Online' Text in Library",
              description: "Show only the player count number in library view",
              checked: settings.hideLibraryOnlineText,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  hideLibraryOnlineText: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showLibraryCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "rounded-corners-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Rounded Corners",
              description: "Toggle between rounded or sharp corners",
              checked: settings.roundedCorners,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  roundedCorners: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        )
      ]
    ),

    // Store Footer Settings Section
    window.SP_REACT.createElement(
      PanelSection,
      { title: "Store Footer Settings", key: "store-footer-settings" },
      [
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "show-store-count-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Show Store Footer",
              description: "Show player count text in Steam store",
              checked: settings.showStoreCount,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  showStoreCount: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showStoreCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "store-icon-row" },
          window.SP_REACT.createElement(
            DropdownItem,
            {
              label: "Store Footer Icon",
              description: "Choose the icon shown in the store footer",
              rgOptions: iconOptions,
              selectedOption: settings.storeIconType,
              onChange: (newValue: SingleDropdownOption) => {
                const iconType = newValue.data as IconType;
                const newSettings = {
                  ...settings,
                  storeIconType: iconType
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showStoreCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "hide-store-online-text-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Hide 'Online' Text in Store",
              description: "Show only the player count number in store view",
              checked: settings.hideStoreOnlineText,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  hideStoreOnlineText: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              }
            }
          )
        ),
        settings.showStoreCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "store-text-size-row" },
          window.SP_REACT.createElement(
            SliderField,
            {
              label: "Text Size",
              description: "Adjust the size of the player count text",
              value: settings.storeTextSize,
              min: 0.7,
              max: 1.5,
              step: 0.1,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  storeTextSize: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              },
              notchLabels: [
                { notchIndex: 0, label: "Small" },
                { notchIndex: 4, label: "Default" },
                { notchIndex: 8, label: "Large" }
              ],
              showValue: true
            }
          )
        ),
        settings.showStoreCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "store-text-position-row" },
          window.SP_REACT.createElement(
            SliderField,
            {
              label: "Horizontal Position",
              description: "Adjust the left/right position (percentage)",
              value: settings.storeTextPosition,
              min: 0,
              max: 40,
              step: 1,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  storeTextPosition: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              },
              notchLabels: [
                { notchIndex: 0, label: "0%" },
                { notchIndex: 20, label: "20%" },
                { notchIndex: 40, label: "40%" }
              ],
              showValue: true
            }
          )
        ),
        settings.showStoreCount && window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "store-text-bottom-row" },
          window.SP_REACT.createElement(
            SliderField,
            {
              label: "Vertical Position",
              description: "Adjust the vertical position from bottom (pixels)",
              value: settings.storeTextBottom,
              min: -50,
              max: 100,
              step: 1,
              onChange: (value) => {
                const newSettings = {
                  ...settings,
                  storeTextBottom: value
                };
                setSettings(newSettings);
                saveSettings(newSettings);
              },
              notchLabels: [
                { notchIndex: 0, label: "-50px" },
                { notchIndex: 75, label: "25px" },
                { notchIndex: 150, label: "100px" }
              ],
              showValue: true
            }
          )
        )
      ]
    ),

    // Reset to Default Button Section
    window.SP_REACT.createElement(
      PanelSection,
      { title: "Reset Settings", key: "reset-settings" },
      window.SP_REACT.createElement(
        PanelSectionRow,
        { key: "reset-button-row" },
        window.SP_REACT.createElement(
          ButtonItem,
          {
            layout: "below",
            onClick: () => {
              setSettings(DEFAULT_SETTINGS);
              saveSettings(DEFAULT_SETTINGS);
            }
          },
          "Reset All Settings to Default"
        )
      )
    )
  ];
};