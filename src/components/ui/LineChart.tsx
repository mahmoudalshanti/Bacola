"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { acionGetLast7DaysSales } from "@/app/dashboard/_actions/actionDashboard";

interface SalesData {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "rgb(22 78 99 / var(--tw-bg-opacity, 1))",
  },
  revenue: {
    label: "Revenue",
    color: "rgb(22 163 74 / var(--tw-bg-opacity, 1))",
  },
} as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-800" />
            <span className="text-sm">
              Sales: <span className="font-medium">{payload[0].value}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm">
              Revenue:{" "}
              <span className="font-medium">
                ${payload[1].value.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function LineChartComponent() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await acionGetLast7DaysSales();
        setData(result as SalesData[]);

        if ("errMsg" in result) {
          if (result.errMsg) throw new Error(result.errMsg);
        }
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 h-[300px] flex items-center justify-center">
          <div>Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "EEE"), // Format as "Mon", "Tue", etc.
    sales: item.sales,
    revenue: item.revenue,
    fullDate: format(new Date(item.date), "MMM d, yyyy"), // For tooltip
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              />
              <Line
                name="Sales"
                dataKey="sales"
                stroke={chartConfig.sales.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                name="Revenue"
                dataKey="revenue"
                stroke={chartConfig.revenue.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-cyan-800" />
            <span>Sales</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span>Revenue</span>
          </div>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales and revenue for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}
