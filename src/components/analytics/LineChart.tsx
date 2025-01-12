import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  date: string;
  average: number;
  target: number;
  belowPercentage: number;
  abovePercentage: number;
}

interface Props {
  data: ChartData[];
}

export function LineChart({ data }: Props) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Average Weight',
        data: data.map(d => d.average),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Target Weight',
        data: data.map(d => d.target),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Below Target %',
        data: data.map(d => d.belowPercentage),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        yAxisID: 'percentage'
      },
      {
        label: 'Above Target %',
        data: data.map(d => d.abovePercentage),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'percentage'
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      percentage: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Percentage (%)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
} 