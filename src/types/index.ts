/**
 * Shared type definitions for playcount-decky
 */

// Steam API response types
export interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  };
}

export interface SteamChartsDataPoint {
  DateTime: string;
  Players: number;
}

// Player statistics types
export interface PlayerStats {
  currentPlayers: number;
  peak24h: number;
  weekAverage: number;
  monthAverage: number;
  allTimePeak: number;
  allTimePeakDate: string;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface ExtendedStats {
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  predictedPeak: number;
  healthScore: number;
  weekendPeak: number;
  nightAvg: number;
  dayAvg: number;
}

export interface ChartDataPoint {
  name: string;
  players: number;
  date: Date;
}

// Settings types
export type BadgePosition = 'top-left' | 'top-right';
export type IconType = 'dot' | 'circle' | 'users' | 'signal' | 'pulse';

export interface PluginSettings {
  showLibraryCount: boolean;
  showStoreCount: boolean;
  badgeSize: number;
  badgePosition: BadgePosition;
  roundedCorners: boolean;
  enableCountAnimation: boolean;
  storeTextSize: number;
  storeTextPosition: number;
  storeTextBottom: string;
  hideStoreOnlineText: boolean;
  hideLibraryOnlineText: boolean;
  useCustomColors: boolean;
  customBadgeColor: string;
  customTextColor: string;
  customIconColor: string;
  libraryIconType: IconType;
  storeIconType: IconType;
}

// Cache types
export interface CacheItem<T = unknown> {
  value: T;
  timestamp: number;
}

export type CacheSubscriber = () => void;

// Icon component types
export interface IconComponentResult {
  component: React.ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
}

// React component prop types
export interface PlayerBadgeProps {
  count: string;
  appId?: string;
}

export interface AnimatedCounterProps {
  finalValue: number | string;
  duration?: number;
  isLoading?: boolean;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export interface PlayerStatsModalProps {
  appId: string;
  closeModal?: () => void;
}

// Tab props for PlayerStats
export interface StatsTabProps {
  stats: PlayerStats;
}

export interface TrendsTabProps {
  chartData: ChartDataPoint[];
}

export interface AnalysisTabProps {
  stats: PlayerStats;
  extendedStats: ExtendedStats;
  chartData: ChartDataPoint[];
}

export interface InsightsTabProps {
  stats: PlayerStats;
  extendedStats: ExtendedStats;
}
