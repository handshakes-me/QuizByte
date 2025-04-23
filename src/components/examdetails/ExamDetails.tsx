import { getFormattedDate } from "@/lib/utils";
import { Exam } from "@/types";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { FaQuestion } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";

const ExamDetails = ({ examData: exam }: { examData: Exam }) => {
  return (
    <div className="grid grid-cols-3 gap-4 py-8 border-y border-main-200">
      {/* Duration */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <CgSandClock /> Duration
          </span>
          {exam.duration} minutes
        </p>
      </div>

      {/* Hints */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <HiOutlineLightBulb />
            Hints
          </span>
          {exam.hints}
        </p>
      </div>

      {/* Total Marks */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <RiNumbersLine />
            Total Marks
          </span>
          {exam.totalMarks}
        </p>
      </div>

      {/* Passing Marks */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <RiNumbersLine />
            Passing Marks
          </span>
          {exam.passingMarks}
        </p>
      </div>

      {/* Marks Per question */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <FaQuestion />
            Marks per question
          </span>
          {exam?.marksPerQuestion}
        </p>
      </div>

      {/* Start Time */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <MdAccessTime />
            Start Time
          </span>
          {getFormattedDate(exam.startTime)}
        </p>
      </div>

      {/* End Time */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <MdAccessTime />
            End Time
          </span>
          {getFormattedDate(exam.endTime)}
        </p>
      </div>

      {/* No. of Questions */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <FaQuestion />
            No. of Questions
          </span>
          {exam.numberOfQuestions}
        </p>
      </div>

      {/* Attempts Allowed */}
      <div className="w-full">
        <p className="text-base flex gap-x-4 items-center justify-start">
          <span className="font-semibold flex items-center gap-x-1 text-base">
            <FiUserCheck />
            Attempts Allowed
          </span>
          {exam.attemptCount}
        </p>
      </div>
    </div>
  );
};

export default ExamDetails;
