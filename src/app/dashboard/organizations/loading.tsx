import Loader from "@/components/common/Loader";
import CreateOrganizationForm from "@/components/organizations/CreateOrganizationForm";
import React from "react";

const loading = () => {
  return (
    <main>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Organizations</h2>
          <CreateOrganizationForm />
        </div>
        <div className="w-full min-h-[640px] flex items-center justify-center">
          <Loader />
        </div>
      </section>
    </main>
  );
};

export default loading;
