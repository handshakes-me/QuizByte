"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

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

type Attempt = { obtainedMarks: number }
type Exam = { passingMarks: number; title: string }

const chartConfig = {
  students: { label: "Students" },
  pass:   { label: "Pass",  color: "hsl(var(--chart-1))" },
  fail:   { label: "Fail",  color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export function ResultChart({
  attempts,
  exam,
}: {
  attempts: Attempt[]
  exam: Exam
}) {
  // ── Calculate pass / fail counts ────────────────────────────────
  const pass = attempts.filter(a => a.obtainedMarks >= exam.passingMarks).length
  const fail = attempts.length - pass

  // Avoid division-by-zero
  const chartData =
    attempts.length === 0
      ? [{ label: "No Data", students: 1, fill: "var(--muted)" }]
      : [
          { label: "Pass", students: pass, fill: "#30A9D9" },
          { label: "Fail", students: fail, fill: "#e71d36" },
        ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{exam?.title} – Pass vs Fail</CardTitle>
        <CardDescription>
          Passing marks: {exam?.passingMarks}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="students"
              nameKey="label"
              innerRadius={60}
              strokeWidth={4}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Exam overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {pass} / {attempts?.length} students passed
        </div>
      </CardFooter>
    </Card>
  )
}
