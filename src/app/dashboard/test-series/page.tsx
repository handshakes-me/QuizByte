import ClientProvider from "@/components/common/ClientProvider";
import AddTestSeriesForm from "@/components/testSeries/AddTestSeriesForm";
import TestSeriesDataTable from "@/components/testSeries/TestSeriesDataTable";
import React from "react";

const Page = () => {
  return (
    <main>
      <div className="w-full bg-purple-50 text-main-900 rounded-md">
        <ClientProvider>
          {/* page header */}
          <div className="mb-4 flex gap-x-4 justify-between items-center">
            <span className="">
              <h2 className="text-2xl font-semibold">Test Series Management</h2>
              <p className="mt-2 font-normal text-base text-main-500">
                Manage all test series here,
              </p>
            </span>
            <AddTestSeriesForm />
          </div>

          <div>
            <TestSeriesDataTable />
          </div>
        </ClientProvider>
      </div>
    </main>
  );
};

export default Page;
