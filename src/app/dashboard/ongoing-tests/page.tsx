"use client";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaClock,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const OngoingExamsPage = () => {
  const router = useRouter();
  const [modalData, setModalData] = React.useState<any>(null);

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
    <div className="p-4">
      <h2 className="text-2xl font-medium mb-6">Ongoing Tests</h2>

      {data?.data?.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No ongoing exams available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((exam: any) => (
            <motion.div
              key={exam._id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full mx-auto overflow-hidden border border-gray-200"
            >
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-4 border-b border-gray-200">
                <h3 className="text-gray-900 text-xl font-bold tracking-wide truncate">
                  {exam.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <FaClipboardList className="text-sky-500" />
                  <p className="font-medium">
                    {exam.subjectId.name} ({exam.subjectId.code})
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 text-sm">
                  <FaCalendarAlt className="text-sky-500" />
                  <p>
                    Starts:{" "}
                    <time dateTime={exam.startTime}>
                      {new Date(exam.startTime).toLocaleString()}
                    </time>
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 text-sm">
                  <FaClock className="text-sky-500" />
                  <p>
                    Duration:{" "}
                    <span className="font-semibold">{exam.duration} mins</span>
                  </p>
                </div>

                <div className="flex justify-between text-gray-700 font-medium">
                  <div>
                    <p>Total Marks</p>
                    <p className="text-lg">{exam.totalMarks}</p>
                  </div>
                </div>

                {/* Attempts Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {exam.remainingAttempts > 0 ? (
                      <FaCheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <FaTimesCircle className="text-red-500 w-5 h-5" />
                    )}
                    <p className="text-sm font-semibold text-gray-800">
                      Attempts Left:{" "}
                      <span
                        className={
                          exam.remainingAttempts > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {exam.remainingAttempts}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Used: {exam.attemptsMade ?? 0}
                  </p>
                </div>

                {/* Button */}
                <Button
                  onClick={() =>
                    setModalData({
                      examId: exam._id,
                    })
                  }
                  disabled={exam.remainingAttempts === 0}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                    exam.remainingAttempts === 0 ? "cursor-not-allowed" : ""
                  }`}
                >
                  {exam.remainingAttempts === 0
                    ? "No Attempts Left"
                    : "Start Test"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modalData && (
        <div onClick={() => setModalData(null)} className="">
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Start Test</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to start the test?
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    try {
                      const elem = document.documentElement;

                      if (elem.requestFullscreen)
                        await elem.requestFullscreen();
                      else if ((elem as any).webkitRequestFullscreen)
                        (elem as any).webkitRequestFullscreen();
                      else if ((elem as any).msRequestFullscreen)
                        (elem as any).msRequestFullscreen();

                      setModalData(null);
                      router.push(`/student/attempt/${modalData?.examId}`);
                    } catch (err) {
                      console.error("Fullscreen request failed:", err);
                      alert("Failed to enter fullscreen mode. Please try again.");
                    }
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingExamsPage;
