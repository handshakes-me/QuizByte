"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IoMdArrowForward } from "react-icons/io";

type ExamGroup = {
  _id: string;
  name: string;
  description: string;
  status: string;
  exams: string[];
  subjecorg: string[];
};

type Organization = {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  examGroups: ExamGroup[];
  students: number;
};

const OrganizationDataTable = ({ data }: { data: Organization[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((org) => (
        <div
          key={org._id}
          className="bg-white border border-main-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold text-main-900 mb-2">
              {org.name}
            </h3>
            <div className="text-sm text-main-700 space-y-1">
              <p><span className="font-medium">Email:</span> {org.email}</p>
              <p><span className="font-medium">Contact:</span> {org.contactNumber}</p>
              <p><span className="font-medium">Students:</span> {org.students}</p>
              <p><span className="font-medium">Test Series:</span> {org.examGroups.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push(`/dashboard/joined-institutions/${org._id}`)}
              className="flex items-center gap-1 text-sm bg-sky-400 hover:bg-main-400 text-white px-4 py-2 rounded-md transition-all"
            >
              Explore <IoMdArrowForward />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationDataTable;
