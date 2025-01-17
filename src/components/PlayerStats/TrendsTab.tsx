import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts';
import { ChartData, CustomTooltipProps } from './types';

interface TrendsTabProps {
  chartData: ChartData[];
  isLoading: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload?.[0]) {
    return window.SP_REACT.createElement('div', {
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px'
      }
    }, [
      window.SP_REACT.createElement('div', null, new Date(Number(label)).toLocaleDateString()),
      window.SP_REACT.createElement('div', { style: { color: '#4DFF4D' } },
        `${payload[0].value?.toLocaleString()} players`)
    ]);
  }
  return null;
};

export const TrendsTab = ({ chartData, isLoading }: TrendsTabProps) => {
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
    style: { height: '180px', padding: '4px' }
  }, [
    window.SP_REACT.createElement('div', {
      style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
    }, '30-Day Player Count Trend'),
    window.SP_REACT.createElement(RechartsResponsiveContainer as any, null,
      window.SP_REACT.createElement(RechartsLineChart as any, {
        data: chartData.slice(-720),
        margin: { top: 5, right: 5, left: 5, bottom: 5 }
      }, [
        window.SP_REACT.createElement(RechartsXAxis as any, {
          dataKey: 'timestamp',
          tickFormatter: (value: number) => new Date(value).toLocaleDateString(),
          tick: { fontSize: 10 },
          stroke: '#B4C7DC'
        }),
        window.SP_REACT.createElement(RechartsYAxis as any, {
          tickFormatter: (value: number) => value.toLocaleString(),
          tick: { fontSize: 10 },
          stroke: '#B4C7DC'
        }),
        window.SP_REACT.createElement(RechartsTooltip as any, { content: CustomTooltip }),
        window.SP_REACT.createElement(RechartsLine as any, {
          type: 'monotone',
          dataKey: 'players',
          stroke: '#4DFF4D',
          strokeWidth: 1.5,
          dot: false
        })
      ])
    )
  ]);
};