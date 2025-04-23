import React from "react";
import { Exam, Subject } from "@/types";
import ExamCard from "./ExamCard";
import { Button } from "../ui/button";
import CreateTest from "./CreateTest";
import ClientProvider from "../common/ClientProvider";

const ExamData = ({
  data,
}: {
  data: {
    subjects: Subject[];
    name: string;
    description: string;
    exams: Exam[];
    _id: string;
  };
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Tests</h3>
        <CreateTest examGroupId={data?._id} subjects={data?.subjects} />
      </div>
      <div>
        {data?.exams.length === 0 ? (
          <div className="text-main-900 w-full text-base min-h-[200px] flex items-center justify-center">
            <p className="text-center">No tests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-4 flex-wrap gap-x-4 mt-4">
            {data?.exams?.map((exam: Exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamData;
