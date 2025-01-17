import { PlayerStats } from './types';

const statBoxStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '4px',
  padding: '4px 6px',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '4px'
};

interface StatsTabProps {
  stats: PlayerStats;
  isLoading: boolean;
}

export const StatsTab = ({ stats, isLoading }: StatsTabProps) => {
  if (isLoading) {
    return window.SP_REACT.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '12px'
      }
    }, 'Loading...');
  }

  return window.SP_REACT.createElement('div', {
    style: { padding: '4px' }
  }, [
    window.SP_REACT.createElement('div', {
      style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
    }, 'PlayCount Analysis'),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      'Current',
      window.SP_REACT.createElement('span', null, stats.currentPlayers.toLocaleString())
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      '24h Peak',
      window.SP_REACT.createElement('span', null, stats.peak24h.toLocaleString())
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      '7-Day Avg',
      window.SP_REACT.createElement('span', null, [
        stats.weekAverage.toLocaleString(),
        window.SP_REACT.createElement('span', {
          style: {
            color: stats.weekGrowth >= 0 ? '#4DFF4D' : '#FF4D4D',
            marginLeft: '4px',
            fontSize: '10px'
          }
        }, `${stats.weekGrowth >= 0 ? '↑' : '↓'}${Math.abs(stats.weekGrowth)}%`)
      ])
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      '30-Day Avg',
      window.SP_REACT.createElement('span', null, [
        stats.monthAverage.toLocaleString(),
        window.SP_REACT.createElement('span', {
          style: {
            color: stats.monthGrowth >= 0 ? '#4DFF4D' : '#FF4D4D',
            marginLeft: '4px',
            fontSize: '10px'
          }
        }, `${stats.monthGrowth >= 0 ? '↑' : '↓'}${Math.abs(stats.monthGrowth)}%`)
      ])
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      'All-Time Peak',
      window.SP_REACT.createElement('span', null, `${stats.allTimePeak.toLocaleString()} (${stats.allTimePeakDate})`)
    ])
  ]);
};