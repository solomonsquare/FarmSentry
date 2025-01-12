import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Users, Skull, Activity } from 'lucide-react';
import { FarmCategory, StockEntry } from '../../types';
import { useDashboardStats } from '../../hooks/dashboard/useDashboardStats';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatNaira } from '../../utils/currency';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function DashboardStats({ category }: { category: FarmCategory }) {
  const { stats, loading, error } = useDashboardStats(category);

  // Debug logs to track data flow
  console.log('DashboardStats Render:', {
    category,
    stats,
    totalSold: stats.totalSold,
    totalRevenue: stats.totalRevenue
  });

  if (loading) {
    return <div className="flex justify-center py-8">
      <LoadingSpinner />
    </div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const animalType = category === 'birds' ? 'Birds' : 'Pigs';

  // Format numbers for better readability
  const formatNumber = (num: number) => num?.toLocaleString() || '0';

  // Ensure we have numbers for calculations
  const totalSold = Number(stats.totalSold) || 0;
  const totalRevenue = Number(stats.totalRevenue) || 0;
  const totalExpenses = Number(stats.totalExpenses) || 0;
  const profit = Number(stats.profit) || 0;

  const statsConfig = [
    {
      label: `Current Stock`,
      value: formatNumber(stats.currentStock),
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Deaths',
      value: formatNumber(stats.deathCount),
      icon: Skull,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      label: `${animalType} Sold`,
      value: stats.totalSold > 0 ? formatNumber(stats.totalSold) : '0',
      icon: Activity,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Total Revenue',
      value: stats.totalRevenue > 0 ? formatNaira(stats.totalRevenue) : '₦0.00',
      icon: BarChart3,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Total Expenses',
      value: formatNaira(totalExpenses),
      icon: DollarSign,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      label: 'Net Profit',
      value: formatNaira(profit),
      icon: TrendingUp,
      color: profit >= 0 ? 'green' : 'red',
      bgColor: profit >= 0 ? 'bg-green-100' : 'bg-red-100',
      textColor: profit >= 0 ? 'text-green-600' : 'text-red-600'
    },
  ];

  // Add debug logging
  console.log('Stats Config Debug:', statsConfig.map(stat => ({
    label: stat.label,
    debug: stat.debug
  })));

  // Enhanced chart data with better colors and hover effects
  const chartData = {
    labels: [animalType, 'Medicine', 'Feeds', 'Additional'],
    datasets: [
      {
        label: 'Expenses',
        data: [
          stats.expenses.birds,
          stats.expenses.medicine,
          stats.expenses.feeds,
          stats.expenses.additionals,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)', // blue
          'rgba(239, 68, 68, 0.5)',  // red
          'rgba(16, 185, 129, 0.5)', // green
          'rgba(245, 158, 11, 0.5)'  // yellow
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Expense Breakdown',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${formatNaira(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return formatNaira(value);
            }
            return value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 750
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsConfig.map((stat) => (
          <div
            key={stat.label}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${stat.bgColor} p-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.label}
                    </dt>
                    <dd className={`text-lg font-semibold ${stat.textColor}`}>
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-[250px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}