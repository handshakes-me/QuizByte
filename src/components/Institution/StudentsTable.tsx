import { getFormattedDate } from "@/lib/utils";
import React from "react";

type Student = {
  email: string;
  name: string;
  _id: string;
  prn: string;
  joined: string;
};

const StudentsTable = ({ students }: { students: Student[] }) => {
  return (
    <div className="mt-4">
      {!(students.length > 0) ? (
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <p className="text-main-500 text-center text-lg font-semibold">
            No students found
          </p>
        </div>
      ) : (
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
                prn
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
            {students.map((stud, index) => (
              <tr key={index}>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {stud?.name}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  <a href={`mailto:${stud?.email}`}>{stud?.email}</a>
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {stud?.prn}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {getFormattedDate(stud?.joined, false)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentsTable;
