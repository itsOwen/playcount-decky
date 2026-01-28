/**
 * Centralized constants for playcount-decky
 * All magic values, URLs, colors, and configuration should be defined here
 */

// API Endpoints
export const API = {
  STEAM_PLAYER_COUNT: 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/',
  STEAM_CHARTS_BASE: 'https://steamcharts.com/app/',
  STEAM_STORE_BASE: 'https://store.steampowered.com',
  CEF_DEBUG: 'http://localhost:8080/json',
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  PLAYER_COUNT_REFRESH: 30000,      // 30 seconds
  CACHE_EXPIRY_SHORT: 1000 * 60 * 5,  // 5 minutes for player count
  CACHE_EXPIRY_LONG: 1000 * 60 * 30,  // 30 minutes for other data
  CACHE_CLEANUP_INTERVAL: 1000 * 60 * 5, // 5 minutes
  ANIMATION_DURATION: 1000,          // 1 second for counter animation
  DEBOUNCE_DELAY: 150,               // 150ms debounce
} as const;

// Cache keys
export const CACHE_KEYS = {
  APP_ID: 'APP_ID',
  PLAYER_COUNT_PREFIX: 'PLAYER_COUNT_',
  SETTINGS: 'playerPulseSettings',
  CACHE_STORAGE: 'playerPulseCache',
} as const;

// UI Sizes
export const UI = {
  BADGE_BASE_SIZE: 12,
  ICON_BASE_SIZE: 14,
  STORE_TEXT_BASE_SIZE: 12,
  DEFAULT_PADDING: 4,
  DEFAULT_GAP: 8,
} as const;

// Color palette for picker
export const COLOR_PALETTE = [
  { name: 'Blue', color: '#4B9EEA' },
  { name: 'Green', color: '#4CAF50' },
  { name: 'Purple', color: '#9C27B0' },
  { name: 'Red', color: '#F44336' },
  { name: 'Orange', color: '#FF9800' },
  { name: 'Teal', color: '#009688' },
  { name: 'Pink', color: '#E91E63' },
  { name: 'Yellow', color: '#FFD700' },
  { name: 'Cyan', color: '#00BCD4' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Black', color: '#000000' },
] as const;

// Theme colors
export const COLORS = {
  // Status colors
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#4B9EEA',

  // Badge colors based on player count thresholds
  BADGE_VERY_HIGH: '#e80e0e',  // > 50000 players
  BADGE_HIGH: '#CFB53B',       // > 10000 players
  BADGE_MEDIUM: '#A6A6A6',     // > 5000 players
  BADGE_LOW: '#CD7F32',        // > 1000 players
  BADGE_DEFAULT: '#4B9EEA',    // <= 1000 players
  BADGE_INACTIVE: '#686868',   // No data or error

  // Text colors
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#b8bcbf',
  TEXT_MUTED: '#8b929a',

  // Chart colors
  CHART_PRIMARY: '#8884d8',
  CHART_SECONDARY: '#82ca9d',
  CHART_ACCENT: '#ffc658',

  // Pie chart colors
  PIE_COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],

  // Score colors
  SCORE_EXCELLENT: '#4CAF50',
  SCORE_GOOD: '#8BC34A',
  SCORE_FAIR: '#FF9800',
  SCORE_POOR: '#F44336',

  // Default icon color
  ICON_DEFAULT: '#4CAF50',
} as const;

// Player count thresholds for badge coloring
export const PLAYER_THRESHOLDS = {
  VERY_HIGH: 50000,
  HIGH: 10000,
  MEDIUM: 5000,
  LOW: 1000,
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  showLibraryCount: true,
  showStoreCount: true,
  badgeSize: 1,
  badgePosition: 'top-right' as const,
  roundedCorners: true,
  enableCountAnimation: true,
  storeTextSize: 1,
  storeTextPosition: 50,
  storeTextBottom: '16px',
  hideStoreOnlineText: false,
  hideLibraryOnlineText: false,
  useCustomColors: false,
  customBadgeColor: '#4B9EEA',
  customTextColor: '#ffffff',
  customIconColor: '#4CAF50',
  libraryIconType: 'dot' as const,
  storeIconType: 'dot' as const,
} as const;

// Icon types available
export const ICON_TYPES = [
  { value: 'dot', label: 'Dot' },
  { value: 'circle', label: 'Circle' },
  { value: 'users', label: 'Users' },
  { value: 'signal', label: 'Signal' },
  { value: 'pulse', label: 'Pulse' },
] as const;

// Badge position options
export const BADGE_POSITIONS = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
] as const;

// Number formatting
export const NUMBER_FORMAT_LOCALE = 'en-US';

// Route patterns
export const ROUTES = {
  LIBRARY_APP: '/library/app/',
  STEAM_WEB: '/steamweb',
} as const;

// Social links
export const SOCIAL_LINKS = {
  DISCORD: 'https://discord.gg/M7Y5kfUea5',
  GITHUB: 'https://github.com/itsOwen',
  EMAIL: 'https://github.com/itsOwen',
} as const;
