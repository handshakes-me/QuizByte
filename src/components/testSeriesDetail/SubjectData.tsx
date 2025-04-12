import { Exam, Subject } from "@/types";
import React, { useState } from "react";
import ExamCard from "./ExamCard";

const SubjectsData = ({
  data,
}: {
  data: {
    subjects: Subject[];
    name: string;
    description: string;
    exams: Exam[];
  };
}) => {
  const [currentSubject, setCurrentSubject] = useState<string>(
    data?.subjects[0]?._id
  );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold">Subjects</h3>
      <div className="flex items-center gap-y-4 flex-wrap gap-x-4 mt-4">
        {data.subjects.length > 0 ? (
          data?.subjects?.map((sub: Subject) => (
            <button
              onClick={() => setCurrentSubject(sub?._id)}
              key={sub?._id}
              className={`py-2 px-6 text-sm shadow-sm shadow-main-950 rounded-md font-semibold ${currentSubject === sub?._id ? "bg-sky-400 text-white" : "bg-white"}`}
            >
              {sub?.name}
            </button>
          ))
        ) : (
          <div className="min-h-[200px] w-full flex items-center justify-center">
            No subjects found
          </div>
        )}
      </div>
      {data.subjects.length > 0 && (
        <div className="my-4 ">
          {data.exams.filter((exam: Exam) => exam.subjectId === currentSubject)
            .length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6">
              {data.exams
                .filter((exam: Exam) => exam.subjectId === currentSubject)
                .map((exam) => (
                  <ExamCard exam={exam} key={exam?._id} />
                ))}
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center">
              No exams found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectsData;
