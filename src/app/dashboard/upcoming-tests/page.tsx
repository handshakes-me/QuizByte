"use client";

import Loader from "@/components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
    <div className="">
      <h2 className="text-2xl font-medium mb-6">Upcoming Tests</h2>
      {data?.data?.length === 0 ? (
        <p className="text-gray-500">No upcoming exams</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.data?.map((exam: any) => (
            <div
              key={exam._id}
              className="border rounded-md shadow-sm bg-white p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-medium mb-4 text-sky-400">
                {exam.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-700 text-sm sm:text-base">
                <p><span className="font-medium">Subject:</span> {exam.subjectId.name}</p>
                <p><span className="font-medium">Code:</span> {exam.subjectId.code}</p>
                <p><span className="font-medium">Start Time:</span> {new Date(exam.startTime).toLocaleString()}</p>
                <p><span className="font-medium">Duration:</span> {exam.duration} minutes</p>
                <p><span className="font-medium">Total Marks:</span> {exam.totalMarks}</p>
                <p><span className="font-medium">Questions:</span> {exam.numberOfQuestions}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
