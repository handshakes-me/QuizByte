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
  { month: "January", organizations: 12, students: 48 },
  { month: "February", organizations: 15, students: 65 },
  { month: "March", organizations: 8, students: 55 },
  { month: "April", organizations: 10, students: 42 },
  { month: "May", organizations: 18, students: 72 },
  { month: "June", organizations: 14, students: 60 },
]

const chartConfig = {
  organizations: {
    label: "Organizations",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function OrgInforGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations & Students Growth</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="organizations" fill="var(--color-organizations)" radius={4} />
            <Bar dataKey="students" fill="var(--color-students)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 8.5% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data for Organizations and Students
        </div>
      </CardFooter>
    </Card>
  )
}
