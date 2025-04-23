'use client';

import { getFormattedDate } from "@/lib/utils";
import { Exam } from "@/types";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiNumbersLine } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import { FaQuestion } from "react-icons/fa6";
import { FiUserCheck } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";

const ExamCard = ({ exam }: { exam: Exam }) => {
  const { id } = useParams();

  return (
    <div className="border p-4 rounded-md bg-white border-main-500 shadow-sm shadow-main-950">
      <Link href={`/dashboard/test-series/${id}/${exam?._id}`}>
        <h4 className="text-lg font-semibold mb-4 hover:underline w-max cursor-pointer">
          {exam?.title}
        </h4>
      </Link>
      <div className="flex w-full mb-4 gap-x-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <CgSandClock /> Duration
            </span>
            {exam.duration} minutes
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <HiOutlineLightBulb />
              Hints
            </span>
            {exam.hints}
          </p>
        </div>
      </div>
      <div className="flex w-full mb-4 gap-x-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <RiNumbersLine />
              Total Makrs
            </span>
            {exam.totalMarks}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <RiNumbersLine />
              Passing Marks
            </span>
            {exam.passingMarks}
          </p>
        </div>
      </div>
      <div className="flex w-full mb-4 gap-x-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <MdAccessTime />
              Start Time
            </span>
            {getFormattedDate(exam.startTime)}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <MdAccessTime />
              End Time
            </span>
            {getFormattedDate(exam.endTime)}
          </p>
        </div>
      </div>
      <div className="flex w-full gap-x-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <FaQuestion />
              No. of Questions
            </span>
            {exam.numberOfQuestions}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4 items-center justify-start">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <FiUserCheck />
              Attempts Allowed
            </span>
            {exam.attemptCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
