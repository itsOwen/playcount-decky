import { PlayerStats } from './types';
import { FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';

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

const tooltipInfo = {
  volatility: {
    title: "Volatility Score",
    description: "Measures player count fluctuations over time. Lower score (<30%) indicates stable numbers, higher scores show significant variations."
  },
  stability: {
    title: "Stability Score",
    description: "Overall consistency of player base. >70%: highly stable, 40-70%: moderate, <40%: unstable."
  },
  weekOverWeek: {
    title: "Week-over-Week Growth",
    description: "Compares consecutive weeks using weighted averages. Accounts for weekend peaks and uses 4-week data for reliability."
  },
  hourlyGrowth: {
    title: "Hourly Growth Trend",
    description: "Short-term player changes using moving averages. Shows immediate trends and daily patterns."
  },
  trendPrediction: {
    title: "Trend Prediction",
    description: "Statistical prediction combining multiple metrics. Confidence score shows prediction reliability."
  }
};

const Tooltip = ({ info }: { info: typeof tooltipInfo[keyof typeof tooltipInfo] }) => {
  return window.SP_REACT.createElement('div', {
    style: {
      position: 'absolute',
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '10px',
      padding: '8px 12px',
      background: '#1a1f2d',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      color: '#ffffff',
      fontSize: '11px',
      width: '220px',
      zIndex: 1000,
      pointerEvents: 'none',
      border: '1px solid rgba(255,255,255,0.1)'
    }
  }, [
    window.SP_REACT.createElement('div', {
      style: {
        fontWeight: 'bold',
        marginBottom: '4px',
        color: '#B4C7DC'
      }
    }, info.title),
    window.SP_REACT.createElement('div', {
      style: {
        lineHeight: '1.3'
      }
    }, info.description)
  ]);
};

interface InsightsTabProps {
  stats: PlayerStats;
  isLoading: boolean;
}

export const InsightsTab = ({ stats, isLoading }: InsightsTabProps) => {
  const [activeTooltip, setActiveTooltip] = useState<keyof typeof tooltipInfo | null>(null);

  const renderInfoIcon = (metricKey: keyof typeof tooltipInfo) => {
    return window.SP_REACT.createElement('div', {
      style: {
        position: 'relative',
        display: 'inline-block'
      }
    }, [
      window.SP_REACT.createElement(FaInfoCircle, {
        style: {
          marginLeft: '6px',
          cursor: 'pointer',
          opacity: activeTooltip === metricKey ? 1 : 0.7,
          color: '#B4C7DC'
        },
        size: 12,
        onMouseEnter: () => setActiveTooltip(metricKey),
        onMouseLeave: () => setActiveTooltip(null)
      }),
      activeTooltip === metricKey && window.SP_REACT.createElement(Tooltip, {
        info: tooltipInfo[metricKey]
      })
    ]);
  };

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
    style: { padding: '4px', fontSize: '11px' }
  }, [
    window.SP_REACT.createElement('div', {
      style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
    }, 'Advanced Insights'),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      window.SP_REACT.createElement('div', { 
        style: { 
          display: 'flex',
          alignItems: 'center'
        }
      }, [
        'Volatility Score',
        renderInfoIcon('volatility')
      ]),
      window.SP_REACT.createElement('span', {
        style: {
          color: stats.volatility < 30 ? '#4DFF4D' : 
                 stats.volatility < 60 ? '#FFBB28' : '#FF4D4D'
        }
      }, `${stats.volatility}%`)
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      window.SP_REACT.createElement('div', { 
        style: { 
          display: 'flex',
          alignItems: 'center'
        }
      }, [
        'Stability Score',
        renderInfoIcon('stability')
      ]),
      window.SP_REACT.createElement('span', {
        style: {
          color: stats.stabilityScore > 70 ? '#4DFF4D' : 
                 stats.stabilityScore > 40 ? '#FFBB28' : '#FF4D4D'
        }
      }, `${stats.stabilityScore}%`)
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      window.SP_REACT.createElement('div', { 
        style: { 
          display: 'flex',
          alignItems: 'center'
        }
      }, [
        'Week-over-Week',
        renderInfoIcon('weekOverWeek')
      ]),
      window.SP_REACT.createElement('span', {
        style: {
          color: stats.weekOverWeekGrowth >= 0 ? '#4DFF4D' : '#FF4D4D'
        }
      }, `${stats.weekOverWeekGrowth >= 0 ? '↑' : '↓'}${Math.abs(stats.weekOverWeekGrowth)}%`)
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      window.SP_REACT.createElement('div', { 
        style: { 
          display: 'flex',
          alignItems: 'center'
        }
      }, [
        'Hourly Growth Trend',
        renderInfoIcon('hourlyGrowth')
      ]),
      window.SP_REACT.createElement('span', {
        style: {
          color: stats.hourlyGrowth >= 0 ? '#4DFF4D' : '#FF4D4D'
        }
      }, `${stats.hourlyGrowth >= 0 ? '↑' : '↓'}${Math.abs(stats.hourlyGrowth)}%`)
    ]),
    window.SP_REACT.createElement('div', { style: statBoxStyle }, [
      window.SP_REACT.createElement('div', { 
        style: { 
          display: 'flex',
          alignItems: 'center'
        }
      }, [
        'Trend Prediction',
        renderInfoIcon('trendPrediction')
      ]),
      window.SP_REACT.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }
      }, [
        window.SP_REACT.createElement('span', {
          style: {
            color: stats.predictedTrend === 'growing' ? '#4DFF4D' : 
                   stats.predictedTrend === 'declining' ? '#FF4D4D' : '#FFBB28'
          }
        }, stats.predictedTrend.charAt(0).toUpperCase() + stats.predictedTrend.slice(1)),
        window.SP_REACT.createElement('span', {
          style: { fontSize: '9px', color: '#B4C7DC' }
        }, `${stats.trendConfidence}% confidence`)
      ])
    ])
  ]);
};