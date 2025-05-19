"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdArrowForward } from "react-icons/io";
import { Button } from "../ui/button";

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
          {/* Header */}
          <div className="mb-4 border-b border-main-300 pb-2">
            <h3 className="text-main-900 text-xl font-semibold truncate">
              {org.name}
            </h3>
          </div>

          {/* Content */}
          <div className="text-main-700 text-sm space-y-2 flex-grow">
            <p>
              <span className="font-medium">Email:</span> {org.email}
            </p>
            <p>
              <span className="font-medium">Contact:</span> {org.contactNumber}
            </p>
            <p>
              <span className="font-medium">Students:</span> {org.students}
            </p>
            <p>
              <span className="font-medium">Test Series:</span>{" "}
              {org.examGroups.length}
            </p>
          </div>

          {/* Button */}
          <div className="mt-6">
            <Button
              onClick={() =>
                router.push(`/dashboard/joined-institutions/${org._id}`)
              }
              className="w-full flex items-center justify-center gap-2 bg-main-500 hover:bg-main-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Explore Active Test Series <IoMdArrowForward />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationDataTable;
