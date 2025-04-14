"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const ExamGroupTable = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: examGroups, isPending } = useQuery({
    queryKey: ["examGroup", user?.organizationId],
    queryFn: async () => {
      if (user?.organizationId === undefined) return {};

      const response = await axios.get(
        `/api/examGroup?organizationId=${user?.organizationId}`
      );
      return response.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  console.log("data: ", examGroups);

  return <div>ExamGroupTable</div>;
};

export default ExamGroupTable;
