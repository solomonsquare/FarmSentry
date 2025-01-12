import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SalesData {
  month: string;
  quantity: number;
  revenue: number;
}

interface Props {
  data: SalesData[];
}

export function SalesChart({ data }: Props) {
  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
  };

  const formatRevenue = (value: number) => `₦${value.toLocaleString()}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tickFormatter={formatMonth}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'revenue') return formatRevenue(value);
            return value;
          }}
          labelFormatter={formatMonth}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="quantity"
          name="Units Sold"
          fill="#3B82F6"
        />
        <Bar
          yAxisId="right"
          dataKey="revenue"
          name="Revenue"
          fill="#10B981"
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 