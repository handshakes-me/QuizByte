"use client";

import Loader from "@/components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaClipboardList, FaCalendarAlt, FaClock } from "react-icons/fa";

const Page = () => {
  const { data, isPending } = useQuery({
    queryKey: ["upcoming-exams"],
    queryFn: async () => {
      const res = await fetch("/api/student/upcomingexams");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-medium mb-6">Upcoming Tests</h2>
      {data?.data?.length === 0 ? (
        <div className="text-gray-500 min-h-[400px] texe-center flex items-center justify-center">
          <p>No upcoming Tests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((exam: any) => (
            <div
              key={exam._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-main-400 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-sky-100 px-6 py-3 border-b border-sky-300">
                <h3 className="text-sky-700 text-xl font-medium truncate capitalize">
                  {exam.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 text-gray-700 text-sm sm:text-base">
                  <FaClipboardList className="text-sky-500" />
                  <p className="font-medium">
                    {exam.subjectId.name} ({exam.subjectId.code})
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-gray-700 text-sm sm:text-base">
                  <FaCalendarAlt className="text-sky-500" />
                  <p>
                    Start Time:{" "}
                    <time dateTime={exam.startTime}>
                      {new Date(exam.startTime).toLocaleString()}
                    </time>
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-gray-700 text-sm sm:text-base">
                  <FaClock className="text-sky-500" />
                  <p>
                    Duration:{" "}
                    <span className="font-semibold">{exam.duration} mins</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm sm:text-base">
                  <p>
                    <span className="font-medium">Total Marks:</span>{" "}
                    {exam.totalMarks}
                  </p>
                  <p>
                    <span className="font-medium">Questions:</span>{" "}
                    {exam.numberOfQuestions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
