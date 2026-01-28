/**
 * API utilities for fetching player data
 */

import { fetchNoCors } from '@decky/api';
import { API, NUMBER_FORMAT_LOCALE } from '../constants';
import type { SteamPlayerResponse } from '../types/index';

export interface PlayerCountResult {
  success: boolean;
  count: number;
  formatted: string;
  error?: string;
}

/**
 * Fetch current player count for a Steam app
 * @param appId - Steam application ID
 * @returns PlayerCountResult with count data or error
 */
export const fetchPlayerCount = async (appId: string): Promise<PlayerCountResult> => {
  try {
    const response = await fetchNoCors(
      `${API.STEAM_PLAYER_COUNT}?appid=${appId}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      }
    );

    const data: SteamPlayerResponse = JSON.parse(await response.text());

    if (data.response.result === 1) {
      const count = data.response.player_count;
      const formatted = formatPlayerCount(count);

      return {
        success: true,
        count,
        formatted,
      };
    }

    return {
      success: false,
      count: 0,
      formatted: 'No data',
      error: 'Invalid API response',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      count: 0,
      formatted: 'Error',
      error: errorMessage,
    };
  }
};

/**
 * Format player count number to localized string
 * Uses en-US locale for consistent comma separators
 * @param count - Raw player count number
 * @returns Formatted string (e.g., "1,234")
 */
export const formatPlayerCount = (count: number): string => {
  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(count);
};

/**
 * Parse formatted player count string back to number
 * @param formatted - Formatted player count string
 * @returns Numeric player count
 */
export const parseFormattedCount = (formatted: string): number => {
  return parseInt(formatted.replace(/,/g, ''), 10) || 0;
};

/**
 * Build Steam Charts URL for an app
 * @param appId - Steam application ID
 * @returns Full URL to Steam Charts page
 */
export const getSteamChartsUrl = (appId: string): string => {
  return `${API.STEAM_CHARTS_BASE}${appId}`;
};

/**
 * Check if a URL is a Steam store page
 * @param url - URL to check
 * @returns True if it's a Steam store page
 */
export const isSteamStoreUrl = (url: string): boolean => {
  return url.includes(API.STEAM_STORE_BASE);
};

/**
 * Extract app ID from Steam store URL
 * @param url - Steam store URL
 * @returns App ID or null if not found
 */
export const extractAppIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
};
