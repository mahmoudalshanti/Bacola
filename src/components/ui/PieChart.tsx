"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { actionGetProductsByCategory } from "@/app/dashboard/_actions/actionDashboard";
import { capitalizeIfAmpersand } from "@/lib/utils";

interface CategoryData {
  name: string;
  count: number;
  total?: number;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
];

const CustomTooltip = ({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: any[];
  total?: number;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = (data.count / (total || data.total || 1)) * 100;

    return (
      <div className="bg-background p-4 shadow-lg rounded-lg border border-border text-sm space-y-2 min-w-[160px]">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="font-medium text-foreground">
            {capitalizeIfAmpersand(data.name)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Count:</span>
          <span className="font-semibold text-right">{data.count}</span>
          <span className="text-muted-foreground">Percentage:</span>
          <span className="font-semibold text-right">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function PieChartComponent() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await actionGetProductsByCategory();
        const categoriesWithTotal = (result?.categories ?? []).map((cat) => ({
          ...cat,
          total: result.total,
        }));
        setData(categoriesWithTotal);
        setTotalProducts(result.total as number);

        if ("errMsg" in result) {
          if (result.errMsg) throw new Error(result.errMsg);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex-1 pb-0 h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card>
        <CardContent className="flex-1 pb-0 h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full">
      <CardContent className="flex-1 pb-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="count"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip total={totalProducts} />}
                wrapperStyle={{ zIndex: 1000 }} // Ensure tooltip appears above other elements
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-0">
        <div className="leading-none text-muted-foreground text-center">
          Showing {totalProducts} products across {data.length} categories
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 mt-2">
          {data.map((category, index) => (
            <div
              key={category.name}
              className="flex items-center gap-1 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">
                {capitalizeIfAmpersand(category.name)} ({category.count})
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
