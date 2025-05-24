"use client";

import Loader from "@/components/common/Loader";
import ExamDetails from "@/components/examdetails/ExamDetails";
import ResultAnalytics from "@/components/results/ResultAnalytics";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [currentTab, setCurrentTab] = useState("results"); // Default tab is "results"
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  console.log("data : ", data?.data);

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
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium">{examInfo?.title}'s results</h1>
        <div className="space-x-2">
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
      {currentTab === "analytics" ? (
        <ResultAnalytics data={analytics} attempts={examAttempts} exam={examInfo} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-main-400 rounded-md">
            <thead className="bg-white border-b border-main-400">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">PRN</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Marks</th>
                <th className="px-4 py-2">Hints Used</th>
                <th className="px-4 py-2">Time Taken (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {examAttempts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No attempts found.
                  </td>
                </tr>
              ) : (
                examAttempts.map((attempt: any, index: number) => (
                  <tr key={attempt._id} className="bg-main-50">
                    <td className="px-4 py-2  text-center">{index + 1}</td>
                    <td className="px-4 py-2">
                      {attempt.studentId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">{attempt.studentId?.email}</td>
                    <td className="px-4 py-2">{attempt.prn}</td>
                    <td className="px-4 py-2 capitalize">{attempt.status}</td>
                    <td className="px-4 py-2 text-center">
                      {attempt.obtainedMarks} / {examInfo?.totalMarks}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {attempt.hintsUsed}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {(attempt.timeTaken / 60)?.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
