"use client";

import { Exam } from "@/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import QuestionForm from "./QuestionForm";
import QuestionCard from "./QuestionCard";
import { IoIosArrowDown } from "react-icons/io";

const QuestionsData = ({ examData }: { examData: Exam }) => {
  const [showQuestions, setShoqQuestions] = useState<boolean>(false);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between">
        <span className="flex flex-col items-start gap-y-2">
          <h2 className="text-2xl font-semibold">
            Questions
            <span className="text-lg"> ( {examData?.questions?.length} )</span>
          </h2>

          <button
            className="text-sm text-sky-800 flex items-center gap-x-2 font-semibold"
            onClick={() => setShoqQuestions((prev) => !prev)}
          >
            Show Question
            <IoIosArrowDown
              className={`${showQuestions ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </span>
        <QuestionForm />
      </div>
      {showQuestions && (
        <div className="my-4 flex flex-col gap-y-4">
          {examData?.questions?.length > 0 ? (
            examData?.questions?.map((question, index) => (
              <QuestionCard key={index} question={question} />
            ))
          ) : (
            <p className="text-gray-500">No questions available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionsData;
