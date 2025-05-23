export type BadgePosition = 'top-right' | 'top-left';
export type IconType = 'dot' | 'signal' | 'wifi' | 'globe' | 'users' | 'gamepad' | 'power';

export interface Settings {
  badgePosition: BadgePosition;
  badgeSize: number;
  roundedCorners: boolean;
  showLibraryCount: boolean;
  showStoreCount: boolean;
  storeTextSize: number;
  storeTextPosition: number;
  storeTextBottom: number;
  hideLibraryOnlineText: boolean;
  hideStoreOnlineText: boolean;
  libraryIconType: IconType;
  storeIconType: IconType;
  enableCountAnimation: boolean;
  useCustomColors: boolean;
  customBadgeColor: string;
  customTextColor: string;
  customIconColor: string;
}

export const DEFAULT_SETTINGS: Settings = {
  badgePosition: 'top-right',
  badgeSize: 1,
  roundedCorners: true,
  showLibraryCount: true,
  showStoreCount: true,
  storeTextSize: 1,
  storeTextPosition: 20,
  storeTextBottom: 2,
  hideLibraryOnlineText: false,
  hideStoreOnlineText: false,
  libraryIconType: 'dot',
  storeIconType: 'users',
  enableCountAnimation: true,
  useCustomColors: false,
  customBadgeColor: '#4B9EEA',
  customTextColor: '#FFFFFF',
  customIconColor: '#4CAF50'
};

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