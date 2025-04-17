import AddTestForm from "@/components/tests/AddTestForm";
import TestSeriesDataTable from "@/components/testSeries/TestSeriesDataTable";
import React from "react";

const Page = () => {
  return (
    <main>
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        {/* page header */}
        <div className="mb-4 flex gap-x-4 justify-between items-center">
          <span className="">
            <h2 className="text-2xl font-semibold">Test Management</h2>
            <p className="mt-2 font-normal text-base text-main-500">
              Manage your test series and tests here
            </p>
          </span>
          <AddTestForm />
        </div>

        <div>
          <TestSeriesDataTable actions={false} status={false} />
        </div>
      </div>
    </main>
  );
};

export default Page;
