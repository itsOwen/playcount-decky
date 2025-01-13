export type BadgePosition = 'top-right' | 'top-left';

export interface Settings {
  badgePosition: BadgePosition;
  badgeSize: number;
  roundedCorners: boolean;
  showLibraryCount: boolean;
  showStoreCount: boolean;
  storeTextSize: number;
  storeTextPosition: number;
  storeTextBottom: number;
}

export const DEFAULT_SETTINGS: Settings = {
  badgePosition: 'top-right',
  badgeSize: 1,
  roundedCorners: true,
  showLibraryCount: true,
  showStoreCount: true,
  storeTextSize: 1,
  storeTextPosition: 20,
  storeTextBottom: 2
};

// Using a custom event for settings changes
const SETTINGS_CHANGE_EVENT = 'playcount-settings-change';

export function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem('playCountSettings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem('playCountSettings', JSON.stringify(settings));
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: settings }));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function subscribeToSettings(callback: (settings: Settings) => void): () => void {
  const handler = (event: CustomEvent<Settings>) => callback(event.detail);
  window.addEventListener(SETTINGS_CHANGE_EVENT as any, handler as EventListener);
  return () => window.removeEventListener(SETTINGS_CHANGE_EVENT as any, handler as EventListener);
}