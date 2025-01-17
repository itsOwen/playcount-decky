import { useState, useEffect } from 'react';
import { fetchNoCors } from '@decky/api';
import {
    DialogBody,
    DialogButton,
    DialogControlsSection,
    DialogHeader,
    ModalRoot,
    Tabs
} from '@decky/ui';
import { PlayerStats, ChartData, ModalPage } from './types';
import { StatsTab } from './StatsTab';
import { TrendsTab } from './TrendsTab';
import { AnalysisTab } from './AnalysisTab';
import { InsightsTab } from './InsightsTab';
import {
    calculateGrowth,
    calculateEnhancedVolatility,
    calculateStabilityScore,
    calculateWeekOverWeekGrowth,
    calculateHourlyGrowthTrend,
    predictTrend
} from './utils';
import { CACHE } from '../../utils/Cache';

interface PlayerStatsModalProps {
    appId: string;
    closeModal: () => void;
}

const CACHE_KEY_PREFIX = 'player_stats_';
const CACHE_KEY_CHART = 'chart_data_';

export const PlayerStatsModal = ({ appId, closeModal }: PlayerStatsModalProps) => {
    const [currentPage, setCurrentPage] = useState<ModalPage>(ModalPage.STATS);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<PlayerStats>({
        currentPlayers: 0,
        weekAverage: 0,
        weekPeak: 0,
        weekGrowth: 0,
        monthAverage: 0,
        monthPeak: 0,
        monthGrowth: 0,
        allTimePeak: 0,
        allTimePeakDate: '',
        peak24h: 0,
        weekendPeak: 0,
        nightAvg: 0,
        dayAvg: 0,
        monthlyGrowth: 0,
        volatility: 0,
        stabilityScore: 0,
        weekOverWeekGrowth: 0,
        hourlyGrowth: 0,
        predictedTrend: 'stable',
        trendConfidence: 0
    });

    const processData = (data: ChartData[]) => {
        const current = data[data.length - 1].players;
        const last24Hours = data.slice(-24);
        const last7Days = data.slice(-168);
        const last30Days = data.slice(-720);

        const weekAvg = Math.round(last7Days.reduce((sum, item) => sum + item.players, 0) / last7Days.length);
        const weekPeak = Math.max(...last7Days.map(item => item.players));
        const weekGrowth = calculateGrowth(last7Days);

        const monthAvg = Math.round(last30Days.reduce((sum, item) => sum + item.players, 0) / last30Days.length);
        const monthPeak = Math.max(...last30Days.map(item => item.players));
        const monthGrowth = calculateGrowth(last30Days);

        const allTimePeak = Math.max(...data.map(item => item.players));
        const peakDate = new Date(data.find(item => item.players === allTimePeak)?.timestamp || 0)
            .toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        const peak24h = Math.max(...last24Hours.map(item => item.players));

        // Calculate weekend data
        const weekendData = last7Days.filter(item => [0, 6].includes(new Date(item.timestamp).getDay()));
        const weekendPeak = Math.max(...weekendData.map(item => item.players));

        // Calculate night and day averages
        const nightData = last7Days.filter(item => {
            const hour = new Date(item.timestamp).getHours();
            return hour >= 0 && hour < 6;
        });
        const nightAvg = Math.round(nightData.reduce((sum, item) => sum + item.players, 0) / nightData.length);

        const dayData = last7Days.filter(item => {
            const hour = new Date(item.timestamp).getHours();
            return hour >= 6 && hour < 24;
        });
        const dayAvg = Math.round(dayData.reduce((sum, item) => sum + item.players, 0) / dayData.length);

        // Calculate enhanced metrics
        const volatility = calculateEnhancedVolatility(last24Hours);
        const stabilityScore = calculateStabilityScore(volatility);
        const weekOverWeekGrowth = calculateWeekOverWeekGrowth(last7Days);
        const hourlyGrowth = calculateHourlyGrowthTrend(last24Hours);
        const trendPrediction = predictTrend(last7Days);

        return {
            currentPlayers: current,
            weekAverage: weekAvg,
            weekPeak,
            weekGrowth,
            monthAverage: monthAvg,
            monthPeak,
            monthGrowth,
            allTimePeak,
            allTimePeakDate: peakDate,
            peak24h,
            weekendPeak,
            nightAvg,
            dayAvg,
            monthlyGrowth: monthGrowth,
            volatility,
            stabilityScore,
            weekOverWeekGrowth,
            hourlyGrowth,
            predictedTrend: trendPrediction.trend,
            trendConfidence: trendPrediction.confidence
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check cache first
                const cachedChartData = await CACHE.loadValue(`${CACHE_KEY_CHART}${appId}`);
                const cachedStats = await CACHE.loadValue(`${CACHE_KEY_PREFIX}${appId}`);

                if (cachedChartData && cachedStats) {
                    setChartData(cachedChartData);
                    setStats(cachedStats);
                    setIsLoading(false);
                    return;
                }

                // If not in cache, fetch from API
                const response = await fetchNoCors(
                    `https://steamcharts.com/app/${appId}/chart-data.json`,
                    { method: "GET" }
                );

                if (!response.ok) throw new Error('Failed to fetch data');

                const data = JSON.parse(await response.text());
                const processedData = data.map((item: [number, number]) => ({
                    timestamp: item[0],
                    players: item[1]
                }));

                // Process and cache the data
                const processedStats = processData(processedData);
                
                // Save to cache
                await CACHE.setValue(`${CACHE_KEY_CHART}${appId}`, processedData);
                await CACHE.setValue(`${CACHE_KEY_PREFIX}${appId}`, processedStats);

                setChartData(processedData);
                setStats(processedStats);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [appId]);

    return window.SP_REACT.createElement(
        ModalRoot,
        { onCancel: closeModal },
        [
            window.SP_REACT.createElement(DialogHeader, null, 'PlayCount Stats'),
            window.SP_REACT.createElement(
                DialogBody,
                {
                    style: {
                        padding: '2px',
                        minHeight: '250px',
                        maxHeight: '70vh',
                        overflowY: 'auto'
                    }
                },
                window.SP_REACT.createElement(
                    Tabs,
                    {
                        activeTab: currentPage,
                        onShowTab: (tab: string) => setCurrentPage(tab as ModalPage),
                        tabs: [
                            { 
                                id: ModalPage.STATS, 
                                title: "Stats", 
                                content: window.SP_REACT.createElement(StatsTab, { stats, isLoading }) 
                            },
                            { 
                                id: ModalPage.CHARTS, 
                                title: "Trends", 
                                content: window.SP_REACT.createElement(TrendsTab, { chartData, isLoading }) 
                            },
                            { 
                                id: ModalPage.ANALYSIS, 
                                title: "Analysis", 
                                content: window.SP_REACT.createElement(AnalysisTab, { stats, isLoading }) 
                            },
                            { 
                                id: ModalPage.INSIGHTS, 
                                title: "Insights", 
                                content: window.SP_REACT.createElement(InsightsTab, { stats, isLoading }) 
                            }
                        ]
                    }
                )
            ),
            window.SP_REACT.createElement(DialogControlsSection, null,
                window.SP_REACT.createElement(DialogButton, {
                    onClick: closeModal
                }, 'Close')
            )
        ]
    );
};