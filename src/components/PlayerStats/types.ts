export interface ChartData {
  timestamp: number;
  players: number;
}

export interface PlayerStats {
  currentPlayers: number;
  weekAverage: number;
  weekPeak: number;
  weekGrowth: number;
  monthAverage: number;
  monthPeak: number;
  monthGrowth: number;
  allTimePeak: number;
  allTimePeakDate: string;
  peak24h: number;
  weekendPeak: number;
  nightAvg: number;
  dayAvg: number;
  monthlyGrowth: number;
  volatility: number;
  stabilityScore: number;
  weekOverWeekGrowth: number;
  hourlyGrowth: number;
  predictedTrend: 'growing' | 'stable' | 'declining';
  trendConfidence: number;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export enum ModalPage {
  STATS = 'stats',
  CHARTS = 'charts',
  ANALYSIS = 'analysis',
  INSIGHTS = 'insights'
}