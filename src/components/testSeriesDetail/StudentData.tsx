'use client'

import { Student } from "@/types";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { IoIosClose } from "react-icons/io";
import { getFormattedDate } from "@/lib/utils";

const StudentData = ({ data }: { data: Student[] }) => {
  const [sort, setSort] = React.useState<"asc" | "dsc">("asc");
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Students</h3>

      {data.length === 0 ? (
        <div className="text-center text-main-700 min-h-[200px] flex items-center justify-center">
          No students found
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-x-4">
            <Select
              defaultValue="asc"
              onValueChange={(value: "asc" | "dsc") => setSort(value)}
            >
              <SelectTrigger className="w-[120px] border border-main-500 select-none bg-white">
                <SelectValue placeholder="sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="dsc">Descending</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-[280px] rounded-md border flex items-center gap-x-2 border-main-500 bg-white">
              <Input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none focus-visible:ring-0"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="p-1 mr-1">
                  <IoIosClose />
                </button>
              )}
            </div>
          </div>

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
                  joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
              {(sort === "asc"
                ? data.sort((a: Student, b: Student) =>
                    a.name.localeCompare(b.name)
                  )
                : data.sort((a: Student, b: Student) =>
                    b.name.localeCompare(a.name)
                  )
              )
                .filter((student: Student) =>
                  student.name
                    ?.toLowerCase()
                    ?.includes(searchTerm.toLowerCase())
                )
                .map((student: Student) => (
                  <tr key={student._id}>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {student?.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium line-clamp-1">
                      <a href={`mailto:${student.email}`}>{student.email}</a>
                    </td>
                    <td>{student.prn}</td>
                    <td>{getFormattedDate(student.joined, false)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StudentData;
