"use client";

import { OrgInforGraph } from "@/components/statistics/orgInfoGraph";
import { TestSeriesChart } from "@/components/statistics/TestSeriesChart";
import React from "react";

const page = () => {
  return (
    <main className="">
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>

        <div className="grid grid-cols-2 gap-x-5">
          <OrgInforGraph />
          <TestSeriesChart />
        </div>
      </div>
    </main>
  );
};

export default page;
