import { getFormattedDate } from "@/lib/utils";
import { Exam } from "@/types";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiNumbersLine } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import { BsQuestion } from "react-icons/bs";
import { FiUserCheck } from "react-icons/fi";

const ExamCard = ({ exam }: { exam: Exam }) => {
  console.log("exam : ", exam);

  return (
    <div className="border p-4 rounded-md bg-white border-main-500 shadow-sm shadow-main-950">
      <h4 className="text-lg font-semibold mb-4">{exam?.title}</h4>
      <div className="flex w-full mb-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <CgSandClock /> Duration
            </span>
            {exam.duration} minutes
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <HiOutlineLightBulb />
              Hints
            </span>
            {exam.hints}
          </p>
        </div>
      </div>
      <div className="flex w-full mb-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <RiNumbersLine />
              Total Makrs
            </span>
            {exam.totalMarks}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <RiNumbersLine />
              Passing Marks
            </span>
            {exam.passingMarks}
          </p>
        </div>
      </div>
      <div className="flex w-full mb-4">
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <MdAccessTime />
              Start Time
            </span>
            {getFormattedDate(exam.startTime)}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <MdAccessTime />
              End Time
            </span>
            {getFormattedDate(exam.endTime)}
          </p>
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <BsQuestion />
              No. of Questions
            </span>
            {exam.numberOfQuestions}
          </p>
        </div>
        <div className="w-full">
          <p className="text-base flex gap-x-4">
            <span className="font-semibold flex items-center gap-x-1 text-sm">
              <FiUserCheck />
              Attempt Count
            </span>
            {exam.attemptCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
