import AddTestSeriesForm from "@/components/testSeries/AddTestSeriesForm";
import TestSeriesDataTable from "@/components/testSeries/TestSeriesDataTable";
import React from "react";

const Page = () => {
  return (
    <main>
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        {/* page header */}
        <div className="mb-4 flex gap-x-4 justify-between items-center">
          <span className="">
            <h2 className="text-2xl font-semibold">Test Series Management</h2>
            {/* <p className="mt-2 font-normal text-base text-main-500">
              Create new test series, assign subjects, schedule exams, and track
              performance — all in one unified view.
            </p> */}
          </span>
          <AddTestSeriesForm />
        </div>

        <div>
          <TestSeriesDataTable />
        </div>
      </div>
    </main>
  );
};

export default Page;
