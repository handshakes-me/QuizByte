"use client";

import { RootState } from "@/app/store";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen p-6 bg-gray-230"
    >
      <div className="mb-4">
        <h3 className="text-2xl font-medium text-gray-800">Results</h3>
      </div>
      {data?.data?.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h3 className="text-2xl font-medium text-gray-600">No results found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Exam Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Exams
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((examGroup: any) => (
                <tr key={examGroup._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                    {examGroup.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                    {examGroup.description}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                    {examGroup.subjects.length}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                    {examGroup.students.length}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                    {examGroup.exams.length}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 font-medium">
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
    </motion.div>
  );
};

export default Page;
