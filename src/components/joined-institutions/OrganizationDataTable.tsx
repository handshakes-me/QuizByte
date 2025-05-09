"use client";

import React from "react";

type ExamGroup = {
  _id: string;
  name: string;
  description: string;
  status: string;
  exams: string[];
  subjecorg: string[];
};

type organization = {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  examGroups: ExamGroup[];
  students: number;
};

const OrganizationDataTable = ({ data }: { data: organization[] }) => {
  console.log("data:  ", data);

  return (
    <div>
      {data?.length > 0 && (
        <table className="min-w-full divide-y rounded-md overflow-hidden divide-main-200">
          <thead className="bg-main-100 whitespace-nowrap">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                students
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Test Series
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
            {data.map((org) => (
              <tr key={org?._id}>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.name}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.email}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.contactNumber}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.students}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.examGroups?.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizationDataTable;
