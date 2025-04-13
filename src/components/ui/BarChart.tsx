"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { actionGetUserStatsLast7Days } from "@/app/dashboard/_actions/actionDashboard";

interface UserStats {
  day: string;
  users: number;
  pendingUsers: number;
  date: string;
}

const chartConfig = {
  users: {
    label: "Verified Users",
    color: "hsl(var(--chart-1))",
  },
  pendingUsers: {
    label: "Pending Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarChartComponent() {
  const [data, setData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await actionGetUserStatsLast7Days();
        setData(result as UserStats[]);
        if ("errMsg" in result) {
          if (result.errMsg) throw new Error(result.errMsg);
        }
      } catch (err) {
        setError("Failed to load user statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading user data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">No user data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
            <Bar
              dataKey="pendingUsers"
              fill="var(--color-pendingUsers)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total users and pending users for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}
