"use client";

import React from "react";
import { OrgInforGraph } from "../statistics/orgInfoGraph";
import { TestSeriesChart } from "../statistics/TestSeriesChart";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LuSchool } from "react-icons/lu";
import { PiStudentDuotone } from "react-icons/pi";
import { PiExam } from "react-icons/pi";
import { PiExamDuotone } from "react-icons/pi";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { OrganizationChart } from "./OrganizationChart";
import StudetnsChart from "./StudetnsChart";
import ExamChart from "./ExamChart";

const fetchSueprAdminStats = async () => {
  const response = await axios.get("/api/admin/stats");
  return response.data;
};

const StatisticsData = () => {
  const { data, isPending } = useQuery({
    queryKey: ["superAdminStats"],
    queryFn: fetchSueprAdminStats,
  });

  if (isPending) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white px-8 py-4 flex flex-col aspect-video animate-pulse items-start justify-center gap-x-4 rounded-md shadow-md">
          </div>
        ))
      }
    </div>
  );

  const quickStats = data?.quickStats || {};
  const monthlyStats = data?.monthlyStats || 0;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="grid grid-cols-2  gap-4">
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <LuSchool className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Total Institutions</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.totalOrganizations}
              </p>
            </span>
          </div>
          
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <PiStudentDuotone className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Total Students</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.totalStudents}
              </p>
            </span>
          </div>
          
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <PiExam className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Total Tests</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.totalExams}
              </p>
            </span>
          </div>
          
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <PiExamDuotone className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Total Attempted Tests</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.totalExams}
              </p>
            </span>
          </div>
          
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <MdOutlineCheckCircle className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Completed Tests</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.completedExams}
              </p>
            </span>
          </div>
          
          <div className="bg-white px-8 py-4 flex flex-col items-start justify-center gap-x-4 rounded-md shadow-md">
            <FaRegClock className="text-4xl text-sky-400 mb-2" />
            <span>
              <h3 className="text-sm font-medium text-main-600">Scheduled Tests</h3>
              <p className="text-2xl font-semibold">
                {quickStats?.upcomingExams}
              </p>
            </span>
          </div>
        </div>

        <OrganizationChart data={monthlyStats?.organizations} />

        <StudetnsChart data={monthlyStats?.students?.slice(monthlyStats?.students?.length - 6, -1)} />

        <ExamChart data={monthlyStats?.exams} />

      </div>
    </div>
  );
};

export default StatisticsData;
