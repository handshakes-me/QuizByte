"use client";

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
import { motion } from "framer-motion";

type AnalyticsData = {
  totalAttempts: number;
  completedAttempts: number;
  autoSubmitted: number;
  averageMarks: number;
  averageTimeTaken: number; // in seconds
  averageHintsUsed: number;
  passingPercentage: number;
};

type ResultAnalyticsProps = {
  data: AnalyticsData;
  attempts: any;
  exam: {
    duration: number;
    passingMarks: number;
    totalMarks: number;
    title: string;
    description: string;
  };
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start gap-2 bg-white px-6 py-8 shadow-lg hover:shadow-2xl rounded-lg"
    >
      <div className="text-indigo-500 text-4xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
      </div>
    </motion.div>
  );
};

const ResultAnalytics = ({
  data,
  attempts,
  exam,
}: ResultAnalyticsProps) => {
  // Convert average time from seconds to minutes
  const averageTimeMinutes = (data?.averageTimeTaken / 60).toFixed(2);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Total Attempts"
          value={data?.totalAttempts}
          icon={<FaUserGraduate />}
        />
        <Card
          title="Completed Attempts"
          value={data?.completedAttempts}
          icon={<FaCheckCircle />}
        />
        {/* Optionally enable auto submitted card if needed */}
        {/* <Card title="Auto Submitted" value={data.autoSubmitted} icon={<FaRobot />} /> */}
        <Card
          title="Average Marks"
          value={data?.averageMarks}
          icon={<FaStar />}
        />
        <Card
          title="Average Time (min)"
          value={averageTimeMinutes}
          icon={<FaClock />}
        />
        <Card
          title="Average Hints Used"
          value={data?.averageHintsUsed}
          icon={<FaLightbulb />}
        />
        <Card
          title="Passing Percentage"
          value={`${data?.passingPercentage}%`}
          icon={<FaPercentage />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <TimeTakenChart attempts={attempts} exam={exam} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <MarksChart attempts={attempts} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ResultChart attempts={attempts} exam={exam} />
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
