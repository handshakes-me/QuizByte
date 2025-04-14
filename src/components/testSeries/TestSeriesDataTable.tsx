"use client";

import { RootState } from "@/app/store";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { IoIosClose } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { EXAMGROUPSTATUS } from "@/lib/utils";

type subject = {
  name: string;
  description: string;
  code: string;
  _id: string;
};

type TestSeries = {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  students?: any[];
  subjects: subject[];
  status: string;
  exams: any[];
};

const TestSeriesDataTable = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [sort, setSort] = React.useState<"asc" | "dsc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const {
    data: testSeries,
    isPending,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["testSeries"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/examGroup?organizationId=${user?.organizationId}`
      );

      return response.data.data;
    },
    enabled: !!user?.organizationId, // only run if org ID exists
  });

  console.log("test series : ", testSeries);

  if (isPending) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="my-8">
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

      {testSeries && testSeries.length > 0 ? (
        <table className="min-w-full divide-y rounded-md overflow-hidden divide-main-200">
          <thead className="bg-main-100 whitespace-nowrap">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                students
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                subjects
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Exams
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
            {(sort === "asc"
              ? testSeries.sort((a: TestSeries, b: TestSeries) =>
                  a.name.localeCompare(b.name)
                )
              : testSeries.sort((a: TestSeries, b: TestSeries) =>
                  b.name.localeCompare(a.name)
                )
            )
              .filter((ts: TestSeries) =>
                ts.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
              )
              .map((ts: TestSeries) => (
                <tr key={ts._id}>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    {ts?.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium line-clamp-1">
                    {ts.description}
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    {ts?.students?.length ?? 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    {ts?.subjects?.length ?? 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    {ts?.exams?.length ?? 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    <p
                      className={`${ts.status === EXAMGROUPSTATUS.INACTIVE ? "text-danger-500" : "text-green-500"}`}
                    >
                      {ts?.status}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-main-900 font-medium">
                    <button
                      className="text-white bg-main-300 p-1 rounded-full"
                      onClick={() =>
                        router.push(`/dashboard/test-series/${ts?._id}`)
                      }
                    >
                      <IoMdArrowForward />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          No Test Series found
        </div>
      )}
    </div>
  );
};

export default TestSeriesDataTable;
