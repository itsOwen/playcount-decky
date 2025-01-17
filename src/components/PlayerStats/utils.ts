import { ChartData } from './types';

export const calculateMovingAverage = (data: number[], window: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length - window + 1; i++) {
    const windowSlice = data.slice(i, i + window);
    const average = windowSlice.reduce((a, b) => a + b) / window;
    result.push(average);
  }
  return result;
};

export const calculateLinearRegression = (yValues: number[]): { slope: number; intercept: number; r2: number } => {
  const xValues = Array.from({ length: yValues.length }, (_, i) => i);
  const n = yValues.length;

  const xMean = xValues.reduce((a, b) => a + b) / n;
  const yMean = yValues.reduce((a, b) => a + b) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  const yPredicted = xValues.map(x => slope * x + intercept);
  const ssRes = yValues.reduce((sum, y, i) => sum + Math.pow(y - yPredicted[i], 2), 0);
  const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const r2 = 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
};

export const calculateEnhancedVolatility = (data: ChartData[], decayFactor: number = 0.94): number => {
  if (data.length < 2) return 0;

  let weightSum = 0;
  let volatilitySum = 0;
  let weight = 1;

  for (let i = 1; i < data.length; i++) {
    const currentValue = data[i].players;
    const previousValue = data[i - 1].players;

    if (previousValue === 0) continue;

    const percentChange = Math.abs(currentValue - previousValue) / previousValue * 100;
    volatilitySum += percentChange * weight;
    weightSum += weight;
    weight *= decayFactor;
  }

  return Math.round(volatilitySum / weightSum);
};

export const calculateStabilityScore = (volatility: number): number => {
  const normalizedVolatility = Math.min(volatility, 100) / 100;
  const stabilityScore = 100 * Math.pow(1 - normalizedVolatility, 1.5);
  return Math.round(stabilityScore);
};

export const calculateWeekOverWeekGrowth = (data: ChartData[]): number => {
  // Need at least 4 weeks of data for better analysis
  if (data.length < 28) return 0;

  // Group data into weeks and calculate daily averages
  const weeks: { [key: string]: number[] }[] = [];
  let currentWeek: { [key: string]: number[] } = {};

  // Convert timestamps to local time and group by day of week
  data.forEach(item => {
    const date = new Date(item.timestamp);
    const dayOfWeek = date.getDay().toString();

    if (!currentWeek[dayOfWeek]) {
      currentWeek[dayOfWeek] = [];
    }

    currentWeek[dayOfWeek].push(item.players);

    // Start a new week when we hit Sunday
    if (date.getDay() === 0 && Object.keys(currentWeek).length > 0) {
      weeks.push(currentWeek);
      currentWeek = {};
    }
  });

  // Add the last partial week if it exists
  if (Object.keys(currentWeek).length > 0) {
    weeks.push(currentWeek);
  }

  // 2 weeks data atleast for comparison
  if (weeks.length < 2) return 0;

  // Calculate weekly averages with proper handling of missing data
  const calculateWeeklyAverage = (week: { [key: string]: number[] }) => {
    let totalSum = 0;
    let totalCount = 0;

    // Calculate average for each day first
    Object.entries(week).forEach(([day, values]) => {
      if (values.length > 0) {
        // Remove outliers (values more than 2 standard deviations from mean)
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
        const filteredValues = values.filter(v => Math.abs(v - mean) <= 2 * std);

        const dayAvg = filteredValues.length > 0
          ? filteredValues.reduce((a, b) => a + b, 0) / filteredValues.length
          : mean;

        // Weight weekends slightly higher but not as extreme as before
        const weight = (day === '0' || day === '6') ? 1.2 : 1;
        totalSum += dayAvg * weight;
        totalCount += weight;
      }
    });

    return totalCount > 0 ? totalSum / totalCount : 0;
  };

  // Get the last 4 weeks
  const recentWeeks = weeks.slice(-4);

  // Calculate recent trends
  const weekAverages = recentWeeks.map(calculateWeeklyAverage);

  // Calculate week-over-week growth using exponential moving average
  const alpha = 0.7; // Weight factor for more recent weeks
  let weightedCurrentAvg = 0;
  let weightedPreviousAvg = 0;
  let weightSum = 0;

  for (let i = 0; i < weekAverages.length - 1; i++) {
    const weight = Math.pow(alpha, weekAverages.length - 2 - i);
    weightedCurrentAvg += weekAverages[i + 1] * weight;
    weightedPreviousAvg += weekAverages[i] * weight;
    weightSum += weight;
  }

  weightedCurrentAvg /= weightSum;
  weightedPreviousAvg /= weightSum;

  // Calculate final growth percentage
  const growth = weightedPreviousAvg !== 0
    ? ((weightedCurrentAvg - weightedPreviousAvg) / weightedPreviousAvg) * 100
    : 0;

  return Math.round(growth);
};

export const calculateHourlyGrowthTrend = (data: ChartData[]): number => {
  if (data.length < 24) return 0;

  const last24Hours = data.slice(-24);
  const movingAvg = calculateMovingAverage(last24Hours.map(d => d.players), 3);

  const hourlyChanges = movingAvg.slice(1).map((val, i) => {
    const prevVal = movingAvg[i];
    return prevVal !== 0 ? ((val - prevVal) / prevVal * 100) : 0;
  });

  const weights = hourlyChanges.map((_, i) => Math.pow(0.85, hourlyChanges.length - i - 1));
  const weightedSum = hourlyChanges.reduce((sum, change, i) => sum + change * weights[i], 0);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  return Math.round(weightedSum / weightSum);
};

export const predictTrend = (data: ChartData[]): {
  trend: 'growing' | 'stable' | 'declining';
  confidence: number;
} => {
  if (data.length < 48) return { trend: 'stable', confidence: 0 };

  const playerCounts = data.map(d => d.players);
  const baselineCount = Math.max(...playerCounts);

  // Calculate daily peaks to handle daily cycles
  const dailyPeaks: number[] = [];
  for (let i = 0; i < playerCounts.length; i += 24) {
    const dailySlice = playerCounts.slice(i, i + 24);
    if (dailySlice.length > 0) {
      dailyPeaks.push(Math.max(...dailySlice));
    }
  }

  // Calculate weekly averages to smooth out weekly patterns
  const weeklyAverages: number[] = [];
  for (let i = 0; i < dailyPeaks.length; i += 7) {
    const weekSlice = dailyPeaks.slice(i, i + 7);
    if (weekSlice.length > 0) {
      weeklyAverages.push(weekSlice.reduce((a, b) => a + b, 0) / weekSlice.length);
    }
  }

  // Determine game size category
  const isLargeGame = baselineCount > 100000;
  const isMediumGame = baselineCount > 10000 && baselineCount <= 100000;
  const isNewGame = data.length < 168; // Less than 1 week of data

  // Calculate relative changes with size-specific thresholds
  const getRelativeChange = (values: number[]): number => {
    if (values.length < 2) return 0;
    const recent = values.slice(-Math.min(7, values.length));
    const first = recent[0];
    const last = recent[recent.length - 1];
    return first !== 0 ? ((last - first) / first) * 100 : 0;
  };

  const dailyChange = getRelativeChange(dailyPeaks);
  const weeklyChange = getRelativeChange(weeklyAverages);

  // Size-specific stability thresholds
  const getStabilityThreshold = (): number => {
    if (isNewGame) return 15;
    if (isLargeGame) return 5;
    if (isMediumGame) return 8;
    return 10;
  };

  // Calculate trend considering game size and age
  const stabilityThreshold = getStabilityThreshold();

  // For new games, focus more on recent data
  const relevantChange = isNewGame ? dailyChange : (weeklyChange * 0.7 + dailyChange * 0.3);

  // Calculate confidence
  let confidence = 75; // Base confidence

  // Adjust confidence based on data quality
  if (isNewGame) confidence -= 15;
  if (data.length > 720) confidence += 10; // More confident with 30+ days of data

  // Adjust confidence based on consistency
  const changeConsistency = Math.abs(dailyChange - weeklyChange);
  confidence -= Math.min(25, changeConsistency / 2);

  // Adjust confidence based on player count stability
  const recentCounts = playerCounts.slice(-48);
  const countVariation = Math.sqrt(
    recentCounts.reduce((sum, count) =>
      sum + Math.pow(count - recentCounts[0], 2), 0) / recentCounts.length
  ) / recentCounts[0];
  confidence -= Math.min(20, countVariation * 100);

  // Determine final trend
  let trend: 'growing' | 'stable' | 'declining';

  if (Math.abs(relevantChange) < stabilityThreshold) {
    trend = 'stable';
    confidence = Math.min(95, confidence + 10); // More confident about stability
  } else {
    trend = relevantChange > 0 ? 'growing' : 'declining';
    // Reduce confidence for extreme changes
    if (Math.abs(relevantChange) > stabilityThreshold * 3) {
      confidence = Math.max(50, confidence - 15);
    }
  }

  // Ensure confidence stays within bounds
  confidence = Math.max(0, Math.min(100, Math.round(confidence)));

  return { trend, confidence };
};

export const calculateGrowth = (data: ChartData[]): number => {
  const halfIndex = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, halfIndex);
  const secondHalf = data.slice(halfIndex);

  const firstAvg = firstHalf.reduce((sum, item) => sum + item.players, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, item) => sum + item.players, 0) / secondHalf.length;

  return firstAvg ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0;
};