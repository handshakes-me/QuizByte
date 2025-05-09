"use client";

import Loader from "@/components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const OngoingExamsPage = () => {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["ongoing-exams"],
    queryFn: async () => {
      const res = await fetch("/api/student/ongoingexams");
      if (!res.ok) throw new Error("Failed to fetch ongoing exams");
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
      <h2 className="text-2xl font-semibold mb-6 text-sky-400">
        Ongoing Tests
      </h2>

      {data?.data?.length === 0 ? (
        <div className=" h-screen flex items-center justify-center">
          <p className="text-gray-500">No ongoing exams available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((exam: any) => (
            <div
              key={exam._id}
              className="border rounded-xl shadow hover:shadow-md transition bg-white p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-sky-500 mb-2">
                  {exam.title}
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Subject:</span>{" "}
                    {exam.subjectId.name}
                  </p>
                  <p>
                    <span className="font-medium">Code:</span>{" "}
                    {exam.subjectId.code}
                  </p>
                  <p>
                    <span className="font-medium">Started At:</span>{" "}
                    {new Date(exam.startTime).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {exam.duration} minutes
                  </p>
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

              <button
                onClick={() => router.push(`/student/attempt/${exam._id}`)}
                className="mt-6 bg-sky-400 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-sky-600 transition"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingExamsPage;
