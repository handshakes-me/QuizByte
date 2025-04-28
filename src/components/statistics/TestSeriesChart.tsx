'use client'

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", testSeries: 10 },
  { month: "February", testSeries: 18 },
  { month: "March", testSeries: 12 },
  { month: "April", testSeries: 7 },
  { month: "May", testSeries: 15 },
  { month: "June", testSeries: 14 },
]

const chartConfig = {
  testSeries: {
    label: "Test Series",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TestSeriesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Series Created</CardTitle>
        <CardDescription>Monthly overview – January to June</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="testSeries" fill="var(--color-testSeries)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing test series created over the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
