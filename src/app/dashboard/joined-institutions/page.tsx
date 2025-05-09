"use client";

import Loader from "@/components/common/Loader";
import OrganizationDataTable from "@/components/joined-institutions/OrganizationDataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const Page = () => {
  const { data, isPending } = useQuery({
    queryKey: ["joined-organizations"],
    queryFn: async () => {
      const response = await axios.get("/api/student/organization");
      return response.data;
    },
  });

  console.log("data : ", data?.data);

  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isPending && data?.data?.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h1 className="text-2xl font-bold">No organizations found</h1>
      </div>
    );
  }

  return (
    <div className="text-black">
      <h4 className="text-2xl font-semibold mb-4">Institutions</h4>
      <OrganizationDataTable data={data?.data} />
    </div>
  );
};

export default Page;
