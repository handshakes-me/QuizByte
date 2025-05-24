"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
    label: "Students",
    color: "#30A9D9",
  },
} satisfies ChartConfig

// ✅ Helper: Generate dynamic buckets like "0-4", "5-9", ...
function generateBuckets(maxMarks: number, bucketSize: number) {
  const buckets: Record<string, number> = {}
  for (let i = 0; i <= maxMarks; i += bucketSize) {
    const start = i
    const end = Math.min(i + bucketSize - 1, maxMarks)
    buckets[`${start}-${end}`] = 0
  }
  return buckets
}

export function MarksChart({ attempts }: { attempts: any[] }) {
  if (!attempts || attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marks Distribution</CardTitle>
          <CardDescription>No attempts found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalMarks = attempts[0]?.totalMarks || 40
  const bucketSize = 5

  const buckets = generateBuckets(totalMarks, bucketSize)

  // Fill buckets based on obtainedMarks
  attempts.forEach(({ obtainedMarks }) => {
    const bucketIndex = Math.floor(obtainedMarks / bucketSize) * bucketSize
    const bucketStart = bucketIndex
    const bucketEnd = Math.min(bucketStart + bucketSize - 1, totalMarks)
    const label = `${bucketStart}-${bucketEnd}`
    if (buckets[label] !== undefined) {
      buckets[label]++
    }
  })

  const chartData = Object.entries(buckets).map(([range, students]) => ({
    range,
    students,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marks Distribution</CardTitle>
        <CardDescription>Based on max marks: {totalMarks}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="students" fill="var(--color-students)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Overall Score Insights <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Grouped by score range (bucket size: {bucketSize})
        </div>
      </CardFooter>
    </Card>
  )
}
