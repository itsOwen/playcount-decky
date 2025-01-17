import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts';
import { PlayerStats } from './types';

interface AnalysisTabProps {
  stats: PlayerStats;
  isLoading: boolean;
}

export const AnalysisTab = ({ stats, isLoading }: AnalysisTabProps) => {
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

  const pieData = [
    { name: 'Weekend', value: stats.weekendPeak },
    { name: 'Night', value: stats.nightAvg },
    { name: 'Day', value: stats.dayAvg }
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return window.SP_REACT.createElement('div', {
    style: { padding: '4px', fontSize: '11px' }
  }, [
    window.SP_REACT.createElement('div', { 
      style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' } 
    }, 'Deep Insights'),
    window.SP_REACT.createElement('div', { 
      style: { display: 'flex', justifyContent: 'space-between' } 
    }, [
      window.SP_REACT.createElement('div', { style: { width: '50%' } }, [
        window.SP_REACT.createElement('div', {
          style: {
            marginBottom: '8px',
            fontWeight: 'bold',
            textDecoration: 'underline'
          }
        }, 'Most Active Times:'),
        window.SP_REACT.createElement('ul', { style: { paddingLeft: '15px', marginTop: '4px' } }, [
          window.SP_REACT.createElement('li', null, `🎮 Weekend Peak: ${stats.weekendPeak.toLocaleString()} players`),
          window.SP_REACT.createElement('li', null, `🌙 Night Avg: ${stats.nightAvg.toLocaleString()} players`),
          window.SP_REACT.createElement('li', null, `☀️ Day Avg: ${stats.dayAvg.toLocaleString()} players`)
        ]),
        window.SP_REACT.createElement('div', {
          style: {
            marginTop: '12px',
            marginBottom: '8px',
            fontWeight: 'bold',
            textDecoration: 'underline'
          }
        }, 'Trend Analysis'),
        
        window.SP_REACT.createElement('ul', { style: { paddingLeft: '15px', marginTop: '4px' } }, [
          window.SP_REACT.createElement('li', null, 
            `${stats.monthlyGrowth >= 0 ? '📈 Growing by' : '📉 Decreasing by'} ${Math.abs(stats.monthlyGrowth)}% month over month`
          ),
          window.SP_REACT.createElement('li', null, 
            `🔥 Highest growth in ${(() => {
              const highest = Math.max(stats.weekendPeak, stats.nightAvg, stats.dayAvg);
              if (highest === stats.weekendPeak) return 'weekends';
              if (highest === stats.nightAvg) return 'nights';
              return 'days';
            })()}`
          )
        ])        
      ]),
      window.SP_REACT.createElement('div', { style: { width: '50%', height: '120px' } },
        window.SP_REACT.createElement(RechartsResponsiveContainer as any, null,
          window.SP_REACT.createElement(RechartsPieChart as any, null, [
            window.SP_REACT.createElement(RechartsPie as any, {
              data: pieData,
              cx: '50%',
              cy: '50%',
              outerRadius: 25,
              fill: '#8884d8',
              dataKey: 'value',
              label: ({ name, percent }: any) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
            }, pieData.map((_, index) => (
              window.SP_REACT.createElement(RechartsCell as any, {
                key: `cell-${index}`,
                fill: COLORS[index % COLORS.length],
              })
            ))),
            window.SP_REACT.createElement('text', {
              x: '50%',
              y: '90%',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
              fontSize: '10px',
              fill: '#B4C7DC'
            }, 'Player Distribution')
          ])
        )
      )
    ])
  ]);
};