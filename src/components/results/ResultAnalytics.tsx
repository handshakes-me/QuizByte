import React from "react";
import {
  FaUserGraduate,
  FaCheckCircle,
  FaRobot,
  FaStar,
  FaClock,
  FaLightbulb,
  FaPercentage,
} from "react-icons/fa";
import { MarksChart } from "./MarksChart";
import TimeTakenChart from "./TimeTakenChart";
import { ResultChart } from "./ResultChart";

type AnalyticsData = {
  totalAttempts: number;
  completedAttempts: number;
  autoSubmitted: number;
  averageMarks: number;
  averageTimeTaken: number; // in seconds
  averageHintsUsed: number;
  passingPercentage: number;
};

const Card = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 bg-white shadow-sm shadow-main-400 rounded-md p-8">
      <div className="text-sky-400 text-3xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>
    </div>
  );
};

const ResultAnalytics = ({
  data,
  attempts,
  exam,
}: {
  data: AnalyticsData;
  attempts: any;
  exam: {
    duration: number;
    passingMarks: number;
    totalMarks: number;
    title: string;
    description: string;
  };
}) => {
  // Convert average time from seconds to minutes
  const averageTimeMinutes = (data.averageTimeTaken / 60).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Total Attempts"
          value={data.totalAttempts}
          icon={<FaUserGraduate />}
        />
        <Card
          title="Completed Attempts"
          value={data.completedAttempts}
          icon={<FaCheckCircle />}
        />
        {/* <Card title="Auto Submitted" value={data.autoSubmitted} icon={<FaRobot />} /> */}
        <Card
          title="Average Marks"
          value={data.averageMarks}
          icon={<FaStar />}
        />
        <Card
          title="Average Time (min)"
          value={averageTimeMinutes}
          icon={<FaClock />}
        />
        <Card
          title="Average Hints Used"
          value={data.averageHintsUsed}
          icon={<FaLightbulb />}
        />
        <Card
          title="Passing Percentage"
          value={`${data.passingPercentage}%`}
          icon={<FaPercentage />}
        />
      </div>

      <TimeTakenChart attempts={attempts} exam={exam} />

      <MarksChart attempts={attempts} />

      <ResultChart attempts={attempts} exam={exam} />
    </div>
  );
};

export default ResultAnalytics;
