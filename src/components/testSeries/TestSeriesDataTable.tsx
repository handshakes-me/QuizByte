"use client";

import { RootState } from "@/app/store";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import { FaUserGraduate, FaBookOpen, FaClipboardList, FaInfoCircle } from "react-icons/fa";
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
import { setTestSeries } from "@/slices/testSeriesSlice";
import { Button } from "../ui/button";

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

const TestSeriesDataTable = ({
  actions = true,
  status = true,
}: {
  actions?: boolean;
  status?: boolean;
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [sort, setSort] = React.useState<"asc" | "dsc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();

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

  // console.log("test series : ", testSeries);

  useEffect(() => {
    if (testSeries && isSuccess) {
      dispatch(setTestSeries(testSeries));
    }
  }, [testSeries, isSuccess, dispatch]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {(sort === "asc"
            ? [...testSeries].sort((a, b) => a.name.localeCompare(b.name))
            : [...testSeries].sort((a, b) => b.name.localeCompare(a.name))
          )
            .filter((ts) =>
              ts.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
            )
            .map((ts) => (
              <div
                key={ts._id}
                className="bg-white border border-main-400 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-main-900 mb-2 line-clamp-1">
                    {ts.name}
                  </h3>
                  <p className="text-sm text-main-700 mb-4 line-clamp-2 border-b border-main-200 pb-3">
                    {ts.description}
                  </p>
                  <div className="text-sm text-main-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUserGraduate className="text-main-400" />
                      <span>
                        <span className="font-medium">Students:</span>{" "}
                        {ts.students?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-main-400" />
                      <span>
                        <span className="font-medium">Subjects:</span>{" "}
                        {ts.subjects?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="text-main-400" />
                      <span>
                        <span className="font-medium">Tests:</span>{" "}
                        {ts.exams?.length ?? 0}
                      </span>
                    </div>
                    {status && (
                      <div className="flex items-center gap-2">
                        <FaInfoCircle
                          className={`${
                            ts.status === EXAMGROUPSTATUS.INACTIVE
                              ? "text-danger-500"
                              : "text-green-500"
                          }`}
                        />
                        <span>
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`${
                              ts.status === EXAMGROUPSTATUS.INACTIVE
                                ? "text-danger-500"
                                : "text-green-500"
                            } font-semibold`}
                          >
                            {ts.status}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {actions && (
                  <div className="mt-5 flex justify-end">
                    <Button
                      className="w-full"
                     onClick={() =>
                        router.push(`/dashboard/test-series/${ts?._id}`)
                      }
                    >
                      Explore <IoMdArrowForward className="text-lg" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          No Test Series found
        </div>
      )}
    </div>
  );
};

export default TestSeriesDataTable;
