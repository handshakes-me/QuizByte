"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Generate last 12 months labels
function getLast12Months(): string[] {
  const months: string[] = [];
  const date = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push(d.toLocaleString("default", { month: "long" }));
  }
  return months;
}

const chartConfig = {
  organizations: {
    label: "Organizations",
    color: "#30A9D9",
  },
} satisfies ChartConfig;

export function OrganizationChart({ data }: { data: number[] }) {
  const months = getLast12Months();

  const chartData = months.map((month, idx) => ({
    month,
    organizations: data[idx] ?? 0, // Fallback to 0 if index is out of bounds
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Institutions</CardTitle>
        <CardDescription>
          Showing institutions registered in the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="organizations"
              type="natural"
              fill="var(--color-organizations)"
              fillOpacity={0.4}
              stroke="var(--color-organizations)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {months[0]} - {months[11]} {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
