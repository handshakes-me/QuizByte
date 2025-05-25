import ClientProvider from "@/components/common/ClientProvider";
import StatisticsData from "@/components/superAdminStats/StatisticsData";
import React from "react";

const page = () => {
  return (
    <main className="">
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <ClientProvider>
          <StatisticsData />
        </ClientProvider>
      </div>
    </main>
  );
};

export default page;
