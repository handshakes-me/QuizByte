"use client";

import Loader from "@/components/common/Loader";
import ExamDetails from "@/components/examdetails/ExamDetails";
import ResultAnalytics from "@/components/results/ResultAnalytics";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";

const Page = () => {
  const [currentTab, setCurrentTab] = useState("results"); // Default tab is "results"
  const router = useRouter();
  const params = useParams<{ examId: string }>();
  const examId = params.examId;

  const { data, isPending } = useQuery({
    queryKey: ["examAttempts", examId],
    queryFn: async () => {
      const response = await axios.get(`/api/result/${examId}`);
      return response.data;
    },
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <Loader />
      </div>
    );
  }

  // Destructure data from the returned result
  const analytics = data?.data?.analytics;
  const examAttempts = data?.data?.examAttempts || [];
  const examInfo = data?.data?.exam;

  const exportToCSV = () => {
    if (!examAttempts.length) return;

    const headers = [
      "S.No",
      "Name",
      "Email",
      "PRN",
      "Status",
      "Obtained Marks",
      "Total Marks",
      "Hints Used",
      "Time Taken (sec)",
    ];

    const rows = examAttempts.map((attempt: any, index: number) => [
      index + 1,
      attempt.studentId?.name || "N/A",
      attempt.studentId?.email,
      attempt.prn,
      attempt.status,
      attempt.obtainedMarks,
      examInfo?.totalMarks,
      attempt.hintsUsed,
      attempt.timeTaken?.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${examInfo?.title || "exam"}_results.csv`);
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-lg font-medium gap-x-2 hover:text-sky-400 transition"
        >
          <IoMdArrowBack className="text-xl" />
          <span className="capitalize">{examInfo?.title} results</span>
        </button>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentTab(currentTab === "results" ? "analytics" : "results")
            }
          >
            {currentTab === "results" ? "View Analytics" : "View Results"}
          </Button>
          <Button onClick={exportToCSV}>Export as CSV</Button>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === "analytics" ? (
        <ResultAnalytics data={analytics} attempts={examAttempts} exam={examInfo} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-blue-100 border-b border-gray-300">
              <tr>
                {[
                  "#",
                  "Name",
                  "Email",
                  "PRN",
                  "Status",
                  "Marks",
                  "Hints Used",
                  "Time Taken (minutes)",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examAttempts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No attempts found.
                  </td>
                </tr>
              ) : (
                examAttempts.map((attempt: any, index: number) => (
                  <tr
                    key={attempt._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 text-center text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">
                      {attempt.studentId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {attempt.studentId?.email}
                    </td>
                    <td className="px-4 py-2 text-sm">{attempt.prn}</td>
                    <td className="px-4 py-2 text-sm capitalize">
                      {attempt.status}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {attempt.obtainedMarks} / {examInfo?.totalMarks}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {attempt.hintsUsed}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {(attempt.timeTaken / 60)?.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Page;
