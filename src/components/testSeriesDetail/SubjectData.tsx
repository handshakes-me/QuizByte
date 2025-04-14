import { Exam, Subject } from "@/types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import AddSubject from "./AddSubject";
import SubjectCard from "./SubjectCard";

const SubjectsData = ({
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
        <h3 className="text-2xl font-semibold">Subjects</h3>
      </div>
      <div className="flex items-center gap-y-4 flex-wrap gap-x-4 mt-4">
        {data?.subjects?.map((sub: Subject) => (
          <SubjectCard key={sub._id} data={sub} />
        ))}
        <AddSubject examGroupId={data?._id} />
      </div>
    </div>
  );
};

export default SubjectsData;
