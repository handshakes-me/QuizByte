"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Extended color palette for 12 months
const fillColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "#9966FF",
  "#4BC0C0",
  "#FF9F40",
  "#FF6384",
  "#B8E986",
  "#30A9D9",
];

// Utility to get last 12 months dynamically
const getLast12Months = (): string[] => {
  const now = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(allMonths[date.getMonth()]);
  }
  return months;
};

const ExamChart = ({ data }: { data: number[] }) => {

  if (data.length !== 12) {
    return (
      <div className="p-4 text-red-500 font-medium">
        Error: Expected data of length 12 (one for each of the last 12 months).
      </div>
    );
  }

  const dynamicMonths = getLast12Months();

  const chartData = data.map((exams, index) => ({
    month: dynamicMonths[index],
    exams,
    fill: fillColors[index % fillColors.length],
  }));

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = { exams: { label: "Exams" } };
    chartData.forEach((item, index) => {
      const key = item.month.toLowerCase().slice(0, 3);
      config[key] = {
        label: item.month,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  const totalExams = React.useMemo(
    () => data.reduce((sum, val) => sum + val, 0),
    [data]
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Exams Created</CardTitle>
        <CardDescription>
          Last 12 Months (Ending {dynamicMonths[11]})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="exams"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExams}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Exams
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <p>{totalExams} exams created in the last 12 months</p>
        <div className="leading-none text-muted-foreground">
          Total exams created in the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExamChart;
