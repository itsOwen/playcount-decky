/**
 * Custom hook for managing plugin settings
 * Provides reactive settings state with automatic persistence
 */

import { loadSettings, saveSettings, subscribeToSettings, Settings, DEFAULT_SETTINGS } from '../utils/Settings';

type SettingsKey = keyof Settings;

interface UseSettingsReturn {
  settings: Settings;
  updateSetting: <K extends SettingsKey>(key: K, value: Settings[K]) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

/**
 * Hook for managing settings state with automatic persistence
 * @returns Settings state and update functions
 */
export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = window.SP_REACT.useState<Settings>(loadSettings);

  window.SP_REACT.useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return unsubscribe;
  }, []);

  /**
   * Update a single setting
   */
  const updateSetting = window.SP_REACT.useCallback(<K extends SettingsKey>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev: Settings) => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  /**
   * Update multiple settings at once
   */
  const updateSettings = window.SP_REACT.useCallback((updates: Partial<Settings>) => {
    setSettings((prev: Settings) => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  /**
   * Reset settings to defaults
   */
  const resetSettings = window.SP_REACT.useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

/**
 * Hook for reading settings only (no update capabilities)
 * Use this in components that only need to display based on settings
 * @returns Current settings state
 */
export const useSettingsValue = (): Settings => {
  const [settings, setSettings] = window.SP_REACT.useState<Settings>(loadSettings);

  window.SP_REACT.useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return unsubscribe;
  }, []);

  return settings;
};
