/**
 * Settings component - plugin configuration UI
 * Refactored to use useSettings hook and reduce repetition
 */

import {
  PanelSection,
  PanelSectionRow,
  DropdownItem,
  SliderField,
  SingleDropdownOption,
  ToggleField,
  ButtonItem,
} from '@decky/ui';
import { useSettings } from '../hooks/useSettings';
import { Settings as SettingsType } from '../utils/Settings';
import { CACHE } from '../utils/Cache';
import { iconOptions } from '../utils/IconUtils';
import { getColorSlider } from './ColorPicker';
import { BADGE_POSITIONS } from '../constants';

const { useCallback, useMemo } = window.SP_REACT;

// Position options for dropdown
const positionOptions = BADGE_POSITIONS.map(({ value, label }) => ({
  data: value,
  label,
}));

// Slider notch configurations
const SIZE_NOTCHES = [
  { notchIndex: 0, label: 'Small' },
  { notchIndex: 4, label: 'Default' },
  { notchIndex: 8, label: 'Large' },
];

const HORIZONTAL_NOTCHES = [
  { notchIndex: 0, label: '0%' },
  { notchIndex: 20, label: '20%' },
  { notchIndex: 40, label: '40%' },
];

const VERTICAL_NOTCHES = [
  { notchIndex: 0, label: '-50px' },
  { notchIndex: 75, label: '25px' },
  { notchIndex: 150, label: '100px' },
];

/**
 * Helper to create a toggle field row
 */
const createToggleRow = (
  key: string,
  label: string,
  description: string,
  checked: boolean,
  onChange: (value: boolean) => void
) =>
  window.SP_REACT.createElement(
    PanelSectionRow,
    { key },
    window.SP_REACT.createElement(ToggleField, {
      label,
      description,
      checked,
      onChange,
    })
  );

/**
 * Helper to create a slider field row
 */
const createSliderRow = (
  key: string,
  label: string,
  description: string,
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
  notchLabels: Array<{ notchIndex: number; label: string }>
) =>
  window.SP_REACT.createElement(
    PanelSectionRow,
    { key },
    window.SP_REACT.createElement(SliderField, {
      label,
      description,
      value,
      min,
      max,
      step,
      onChange,
      notchLabels,
      showValue: true,
    })
  );

/**
 * Helper to create a dropdown field row
 */
const createDropdownRow = (
  key: string,
  label: string,
  description: string,
  options: Array<{ data: string; label: string }>,
  selectedOption: string,
  onChange: (newValue: SingleDropdownOption) => void
) =>
  window.SP_REACT.createElement(
    PanelSectionRow,
    { key },
    window.SP_REACT.createElement(DropdownItem, {
      label,
      description,
      rgOptions: options,
      selectedOption,
      onChange,
    })
  );

export const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();

  // Memoized update handlers
  const handleToggle = useCallback(
    (key: keyof SettingsType) => (value: boolean) => updateSetting(key, value as SettingsType[typeof key]),
    [updateSetting]
  );

  const handleSlider = useCallback(
    (key: keyof SettingsType) => (value: number) => updateSetting(key, value as SettingsType[typeof key]),
    [updateSetting]
  );

  const handleDropdown = useCallback(
    (key: keyof SettingsType) => (newValue: SingleDropdownOption) =>
      updateSetting(key, newValue.data as SettingsType[typeof key]),
    [updateSetting]
  );

  const handleColorChange = useCallback(
    (key: keyof SettingsType) => (color: string) => updateSetting(key, color as SettingsType[typeof key]),
    [updateSetting]
  );

  // Library Badge Section
  const libraryBadgeSection = useMemo(
    () =>
      window.SP_REACT.createElement(
        PanelSection,
        { title: 'Library Badge Settings', key: 'library-badge-settings' },
        [
          createToggleRow(
            'show-library-badge-row',
            'Show Library Badge',
            'Show player count badge in game library',
            settings.showLibraryCount,
            handleToggle('showLibraryCount')
          ),

          settings.showLibraryCount &&
            createDropdownRow(
              'position-row',
              'Badge Position',
              'Choose where the player count badge appears',
              positionOptions,
              settings.badgePosition,
              handleDropdown('badgePosition')
            ),

          settings.showLibraryCount &&
            createDropdownRow(
              'library-icon-row',
              'Library Badge Icon',
              'Choose the icon shown in the library badge',
              iconOptions,
              settings.libraryIconType,
              handleDropdown('libraryIconType')
            ),

          settings.showLibraryCount &&
            createToggleRow(
              'enable-animation-row',
              'Smooth Number Animation',
              'Enable smooth animation when player count updates',
              settings.enableCountAnimation,
              handleToggle('enableCountAnimation')
            ),

          settings.showLibraryCount &&
            createSliderRow(
              'size-row',
              'Badge Size',
              'Adjust the size of the badge',
              settings.badgeSize,
              0.7,
              1.5,
              0.1,
              handleSlider('badgeSize'),
              SIZE_NOTCHES
            ),

          settings.showLibraryCount &&
            createToggleRow(
              'hide-library-online-text-row',
              "Hide 'Online' Text in Library",
              'Show only the player count number in library view',
              settings.hideLibraryOnlineText,
              handleToggle('hideLibraryOnlineText')
            ),

          settings.showLibraryCount &&
            createToggleRow(
              'rounded-corners-row',
              'Rounded Corners',
              'Toggle between rounded or sharp corners',
              settings.roundedCorners,
              handleToggle('roundedCorners')
            ),
        ].filter(Boolean)
      ),
    [
      settings.showLibraryCount,
      settings.badgePosition,
      settings.libraryIconType,
      settings.enableCountAnimation,
      settings.badgeSize,
      settings.hideLibraryOnlineText,
      settings.roundedCorners,
      handleToggle,
      handleDropdown,
      handleSlider,
    ]
  );

  // Badge Colors Section
  const badgeColorsSection = useMemo(
    () =>
      window.SP_REACT.createElement(
        PanelSection,
        { title: 'Badge Colors', key: 'badge-colors' },
        [
          createToggleRow(
            'use-custom-colors-row',
            'Use Custom Colors',
            'Override default badge colors',
            settings.useCustomColors,
            handleToggle('useCustomColors')
          ),

          settings.useCustomColors &&
            window.SP_REACT.createElement(
              PanelSectionRow,
              { key: 'badge-color-row' },
              getColorSlider('Badge Color', settings.customBadgeColor, handleColorChange('customBadgeColor'))
            ),

          settings.useCustomColors &&
            window.SP_REACT.createElement(
              PanelSectionRow,
              { key: 'text-color-row' },
              getColorSlider('Text Color', settings.customTextColor, handleColorChange('customTextColor'))
            ),

          settings.useCustomColors &&
            window.SP_REACT.createElement(
              PanelSectionRow,
              { key: 'icon-color-row' },
              getColorSlider('Icon Color', settings.customIconColor, handleColorChange('customIconColor'))
            ),
        ].filter(Boolean)
      ),
    [
      settings.useCustomColors,
      settings.customBadgeColor,
      settings.customTextColor,
      settings.customIconColor,
      handleToggle,
      handleColorChange,
    ]
  );

  // Store Footer Section
  const storeFooterSection = useMemo(
    () =>
      window.SP_REACT.createElement(
        PanelSection,
        { title: 'Store Footer Settings', key: 'store-footer-settings' },
        [
          createToggleRow(
            'show-store-count-row',
            'Show Store Footer',
            'Show player count text in Steam store',
            settings.showStoreCount,
            handleToggle('showStoreCount')
          ),

          settings.showStoreCount &&
            createDropdownRow(
              'store-icon-row',
              'Store Footer Icon',
              'Choose the icon shown in the store footer',
              iconOptions,
              settings.storeIconType,
              handleDropdown('storeIconType')
            ),

          settings.showStoreCount &&
            createToggleRow(
              'hide-store-online-text-row',
              "Hide 'Online' Text in Store",
              'Show only the player count number in store view',
              settings.hideStoreOnlineText,
              handleToggle('hideStoreOnlineText')
            ),

          settings.showStoreCount &&
            createSliderRow(
              'store-text-size-row',
              'Text Size',
              'Adjust the size of the player count text',
              settings.storeTextSize,
              0.7,
              1.5,
              0.1,
              handleSlider('storeTextSize'),
              SIZE_NOTCHES
            ),

          settings.showStoreCount &&
            createSliderRow(
              'store-text-position-row',
              'Horizontal Position',
              'Adjust the left/right position (percentage)',
              settings.storeTextPosition,
              0,
              40,
              1,
              handleSlider('storeTextPosition'),
              HORIZONTAL_NOTCHES
            ),

          settings.showStoreCount &&
            createSliderRow(
              'store-text-bottom-row',
              'Vertical Position',
              'Adjust the vertical position from bottom (pixels)',
              settings.storeTextBottom as number,
              -50,
              100,
              1,
              handleSlider('storeTextBottom'),
              VERTICAL_NOTCHES
            ),
        ].filter(Boolean)
      ),
    [
      settings.showStoreCount,
      settings.storeIconType,
      settings.hideStoreOnlineText,
      settings.storeTextSize,
      settings.storeTextPosition,
      settings.storeTextBottom,
      handleToggle,
      handleDropdown,
      handleSlider,
    ]
  );

  // Clear cache handler
  const handleClearCache = useCallback(() => {
    if (CACHE) {
      CACHE.clear();
    }
  }, []);

  // Reset Section
  const resetSection = useMemo(
    () =>
      window.SP_REACT.createElement(
        PanelSection,
        { title: 'Reset & Cache', key: 'reset-settings' },
        [
          window.SP_REACT.createElement(
            PanelSectionRow,
            { key: 'clear-cache-row' },
            window.SP_REACT.createElement(
              ButtonItem,
              {
                layout: 'below',
                onClick: handleClearCache,
              },
              'Clear Cache'
            )
          ),
          window.SP_REACT.createElement(
            PanelSectionRow,
            { key: 'reset-button-row' },
            window.SP_REACT.createElement(
              ButtonItem,
              {
                layout: 'below',
                onClick: resetSettings,
              },
              'Reset Settings to Default'
            )
          ),
        ]
      ),
    [resetSettings, handleClearCache]
  );

  return [libraryBadgeSection, badgeColorsSection, storeFooterSection, resetSection];
};

export default Settings;
