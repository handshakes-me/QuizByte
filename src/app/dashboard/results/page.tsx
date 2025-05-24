"use client";

import { RootState } from "@/app/store";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const fetchResults = async (id: string) => {
  const response = await axios.get("/api/examGroup?organizationId=" + id);
  return response.data;
};

const Page = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { data, isPending } = useQuery({
    queryKey: ["results", user?.organizationId],
    queryFn: () => fetchResults(user?.organizationId!),
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  console.log("data : ", data);

  return (
    <div className="w-full h-screen">
      <div className="mb-4">
        <h3 className="text-2xl font-medium">Results</h3>
      </div>
      <div>
        {data?.data?.length === 0 ? (
          <div className="w-full h-screen flex justify-center items-center">
            <h3 className="text-2xl font-medium">No results found</h3>
          </div>
        ) : (
          <div>
            <table className="min-w-full divide-y rounded-md overflow-hidden divide-main-200">
              <thead className="bg-main-100 whitespace-nowrap">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Exam Group
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Exams
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
                {data?.data?.map((examGroup: any) => (
                  <tr key={examGroup._id}>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {examGroup.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {examGroup.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {examGroup.subjects.length}
                    </td>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {examGroup.students.length}
                    </td>
                    <td className="px-4 py-4 text-sm text-main-900 font-medium">
                      {examGroup.exams.length}
                    </td>
                    <td className="py-4 pl-4 text-sm text-main-900 font-medium">
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/results/${examGroup._id}`)
                        }
                        className="h-8"
                      >
                        View Results
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
