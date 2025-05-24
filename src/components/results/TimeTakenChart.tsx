"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

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

const chartConfig = {
  students: {
    label: "No. of Students",
    color: "#30A9D9",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const TimeTakenChart = ({
  attempts,
  exam,
}: {
  attempts: any[]
  exam: {
    duration: number
    totalMarks: number
    title: string
    description: string
  }
}) => {
  if (!attempts || attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Taken Chart</CardTitle>
          <CardDescription>No attempts available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const bucketSize = 10
  const totalBuckets = Math.ceil(exam.duration / bucketSize)

  // initialize buckets
  const bucketCounts: { range: string; students: number }[] = Array.from(
    { length: totalBuckets },
    (_, i) => {
      const start = i * bucketSize
      const end = start + bucketSize
      return {
        range: `${start}-${end} min`,
        students: 0,
      }
    }
  )

  // count students in each bucket
  attempts.forEach((a) => {
    const timeTakenMin = Math.floor((a.timeTaken || 0) / 60)
    const bucketIndex = Math.min(
      Math.floor(timeTakenMin / bucketSize),
      totalBuckets - 1
    )
    bucketCounts[bucketIndex].students += 1
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Distribution (mins)</CardTitle>
        <CardDescription>
          Distribution of student completion time for {exam.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={bucketCounts}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="range"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              label={{ value: "Students", position: "insideBottom", offset: -5 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="students"
              fill="var(--color-students)"
              radius={4}
              layout="vertical"
            >
              <LabelList
                dataKey="range"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="students"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Distribution of completion time <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total Duration: {exam.duration} mins
        </div>
      </CardFooter>
    </Card>
  )
}

export default TimeTakenChart
