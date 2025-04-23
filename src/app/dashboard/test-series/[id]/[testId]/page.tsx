"use client";

import Loader from "@/components/common/Loader";
import EditExamDetailsForm from "@/components/examdetails/EditExamDetailsForm";
import ExamDetails from "@/components/examdetails/ExamDetails";
import QuestionsData from "@/components/examdetails/QuestionsData";
import { EXAMSTATUS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";

const Page = () => {
  const { testId } = useParams();

  const { data: examData, isPending } = useQuery({
    queryKey: ["examData"],
    queryFn: async () => {
      const response = await axios.get(`/api/exam/${testId}`);
      return response?.data?.data;
    },
    enabled: !!testId,
  });

  // console.log("examData : ", examData);

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main>
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        {/* back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center mb-4 text-xs font-semibold gap-x-1 hover:gap-x-2 transition-all duration-100 hover:text-sky-400"
        >
          <MdArrowBack /> Back
        </button>

        {/* page header */}
        <div className="mb-8 flex gap-x-4 justify-between items-center">
          <span className="">
            <span className="flex items-center gap-x-4">
              <h2 className="text-2xl font-semibold">{examData?.title}</h2>
              <p
                className={`px-4 rounded-full bg-white font-semibold text-xs border border-main-200 py-1 capitalize ${!(examData?.status === EXAMSTATUS.FINISHED) ? "text-green-500" : "text-red-500"}`}
              >
                {examData?.status?.toLowerCase()}
              </p>
            </span>
            <p className="mt-2 font-normal text-base text-main-500">
              {examData?.description}
            </p>
            <p className="mt-2 text-base font-bold text-main-500">
              Subject Id - {examData?.subjectId?.code}
            </p>
          </span>
          <EditExamDetailsForm examData={examData} />
        </div>

        {/* Exam details */}
        <ExamDetails examData={examData} />

        {/* question management */}
        <QuestionsData examData={examData} />
      </div>
    </main>
  );
};

export default Page;
