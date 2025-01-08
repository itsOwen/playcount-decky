import {
  PanelSection,
  PanelSectionRow,
  DropdownItem,
  SliderField,
  SingleDropdownOption,
  ToggleField
} from '@decky/ui';
import { BadgePosition, loadSettings, saveSettings } from '../utils/Settings';

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

  const handleSizeChange = (value: number) => {
    const newSettings = {
      ...settings,
      badgeSize: value
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handlePositionChange = (newValue: SingleDropdownOption) => {
    const position = newValue.data as BadgePosition;
    const newSettings = {
      ...settings,
      badgePosition: position
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleRoundedCornersChange = (value: boolean) => {
    const newSettings = {
      ...settings,
      roundedCorners: value
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return [
    window.SP_REACT.createElement(
      PanelSection,
      { title: "Badge Settings", key: "badge-settings" },
      [
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "position-row" },
          window.SP_REACT.createElement(
            DropdownItem,
            {
              label: "Badge Position",
              description: "Choose where the player count badge appears",
              rgOptions: positionOptions,
              selectedOption: settings.badgePosition,
              onChange: handlePositionChange
            }
          )
        ),
        window.SP_REACT.createElement(
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
              onChange: handleSizeChange,
              notchLabels: [
                { notchIndex: 0, label: "Small" },
                { notchIndex: 4, label: "Default" },
                { notchIndex: 8, label: "Large" }
              ],
              showValue: true
            }
          )
        ),
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "rounded-corners-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Rounded Corners",
              description: "Toggle between rounded or sharp corners",
              checked: settings.roundedCorners,
              onChange: handleRoundedCornersChange
            }
          )
        )
      ]
    ),
    window.SP_REACT.createElement(
      PanelSection,
      { title: "Display Settings", key: "display-settings" },
      [
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "show-library-count-row" },
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
        window.SP_REACT.createElement(
          PanelSectionRow,
          { key: "show-store-count-row" },
          window.SP_REACT.createElement(
            ToggleField,
            {
              label: "Show Store Count",
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
        )
      ]
    )
  ];
};