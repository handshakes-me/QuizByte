'use client';

import React from "react";
import { OrgInforGraph } from "../statistics/orgInfoGraph";
import { TestSeriesChart } from "../statistics/TestSeriesChart";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchSueprAdminStats = async () => {
    console.log("making request to fetch super admin stats");
  const response = await axios.get("/api/admin/stats");
  return response.data;
};

const StatisticsData = () => {
    
  const { data, isPending } = useQuery({
    queryKey: ["superAdminStats"],
    queryFn: fetchSueprAdminStats,
  });

  if (isPending) return <div>Loading...</div>;

  console.log("data : ", data);

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5">
        <OrgInforGraph />
        <TestSeriesChart />
      </div>
    </div>
  );
};

export default StatisticsData;
