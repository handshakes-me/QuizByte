"use client";

import { Exam } from "@/types";
import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionCard from "./QuestionCard";

const QuestionsData = ({ examData }: { examData: Exam }) => {

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <span className="flex flex-col items-start gap-y-2">
          <h2 className="text-2xl font-semibold">
            Questions
            <span className="text-lg"> ( {examData?.questions?.length} )</span>
          </h2>

        </span>
        <QuestionForm />
      </div>
      <div className="my-4 flex flex-col gap-y-4">
        {examData?.questions?.length > 0 ? (
          examData?.questions?.map((question, index) => (
            <QuestionCard key={index} question={question} />
          ))
        ) : (
          <p className="text-gray-500">No questions available</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsData;
