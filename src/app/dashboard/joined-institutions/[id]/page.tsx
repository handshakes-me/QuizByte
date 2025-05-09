"use client";

import Loader from "@/components/common/Loader";
import RegisterForTestSeriesForm from "@/components/registerForTestSeries/RegisterForTestSeriesForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id: organizationId } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["joined-organizations"],
    queryFn: async () => {
      const response = await axios.post(
        "/api/student/organization/fetchExamGroups",
        {
          organizationId,
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      return response.data;
    },
  });

  // console.log("data : ", data?.data);

  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <h4 className="text-2xl font-semibold mb-4">Test series</h4>

      <div>
        {data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.data?.map((examGroup: any) => (
              <div
                key={examGroup._id}
                className="mb-4 border flex justify-between items-center border-gray-300 p-4 rounded-lg shadow-sm shadow-main-900"
              >
                <div>
                  <h1 className="text-xl font-medium">{examGroup.name}</h1>
                  <p className="text-gray-500">{examGroup.description}</p>
                </div>
                <RegisterForTestSeriesForm data={examGroup} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-xl font-medium">No test series found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
