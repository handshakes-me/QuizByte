import CreateOrganizationForm from "@/components/organizations/CreateOrganizationForm";
import OrganizationDataTable from "@/components/organizations/OrganizationDataTable";
import { getOrganizations } from "@/lib/organization";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const OrganizationPage = async () => {
  const response = await getOrganizations();
  const organizations = await JSON.parse(JSON.stringify(response));
  if (!organizations) {
    redirect("/unauthorized");
  }

  if (!organizations) {
    return (
      <div className="text-main-900 min-h-screen grid place-items-center">
        <div className="text-2xl font-semibold">No organizations found</div>
      </div>
    );
  }

  return (
    <main>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Organizations</h2>
          <CreateOrganizationForm />
        </div>
        <div className="overflow-x-auto my-8">
          <OrganizationDataTable data={organizations} />
        </div>
      </section>
    </main>
  );
};

export default OrganizationPage;
