/**
 * Color utility functions
 */

import { COLORS, PLAYER_THRESHOLDS } from '../constants';

/**
 * Convert hex color to RGB string format
 * @param hex - Hex color string (with or without #)
 * @returns RGB string in format "r, g, b"
 */
export const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }

  return `${r}, ${g}, ${b}`;
};

/**
 * Get badge color based on player count
 * @param count - Player count string or number
 * @param customColor - Optional custom color to use instead
 * @returns Hex color string
 */
export const getBadgeColor = (
  count: string | number | null | undefined,
  customColor?: string
): string => {
  if (customColor) {
    return customColor;
  }

  if (!count || count === 'No data' || count === 'Error') {
    return COLORS.BADGE_INACTIVE;
  }

  const playerCount = typeof count === 'number'
    ? count
    : parseInt(String(count).replace(/,/g, ''), 10);

  if (isNaN(playerCount)) {
    return COLORS.BADGE_INACTIVE;
  }

  if (playerCount > PLAYER_THRESHOLDS.VERY_HIGH) return COLORS.BADGE_VERY_HIGH;
  if (playerCount > PLAYER_THRESHOLDS.HIGH) return COLORS.BADGE_HIGH;
  if (playerCount > PLAYER_THRESHOLDS.MEDIUM) return COLORS.BADGE_MEDIUM;
  if (playerCount > PLAYER_THRESHOLDS.LOW) return COLORS.BADGE_LOW;

  return COLORS.BADGE_DEFAULT;
};

/**
 * Get color for score/health indicators
 * @param score - Score value (0-100)
 * @returns Hex color string
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return COLORS.SCORE_EXCELLENT;
  if (score >= 60) return COLORS.SCORE_GOOD;
  if (score >= 40) return COLORS.SCORE_FAIR;
  return COLORS.SCORE_POOR;
};

/**
 * Get color for growth percentage indicators
 * @param growth - Growth percentage
 * @returns Hex color string
 */
export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return COLORS.SUCCESS;
  if (growth < 0) return COLORS.ERROR;
  return COLORS.TEXT_MUTED;
};

/**
 * Create a drop shadow filter string for icons
 * @param color - Hex color string
 * @param opacity - Shadow opacity (0-1)
 * @returns CSS filter string
 */
export const createIconShadow = (color: string, opacity: number = 0.5): string => {
  const rgb = hexToRgb(color);
  return `drop-shadow(0 0 2px rgba(${rgb}, ${opacity}))`;
};

/**
 * Parse player count string to number
 * @param count - Formatted player count string (e.g., "1,234")
 * @returns Numeric player count
 */
export const parsePlayerCount = (count: string): number => {
  return parseInt(count.replace(/,/g, ''), 10) || 0;
};
