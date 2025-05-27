import ClientProvider from "@/components/common/ClientProvider";
import InviteSection from "@/components/Institution/InviteSection";
import StudentsTable from "@/components/Institution/StudentsTable";
import { getOrganizationData } from "@/lib/organization";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const Page = async () => {
  const response = await getOrganizationData();
  if (!response) {
    redirect("/dashboard");
  }

  const organization = {
    name: response?.name,
    email: response?.email,
    contactNumber: response?.contactNumber,
    createdAt: response?.createdAt,
    students: response?.students,
    examGroups: response?.examGroups,
    inviteLink: response?.inviteLink,
    _id: response?._id.toString(),
  };

  return (
    <section>
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-x-4">
        <div className="bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 p-6 rounded-2xl flex justify-center">
          <p className="flex gap-x-2 items-end">
            <span className="text-3xl font-bold text-sky-400">
              {organization?.students?.length || 0}
            </span>
            Students
          </p>
        </div>

        <div className="bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 p-6 rounded-2xl flex justify-center">
          <p className="flex gap-x-2 items-end">
            <span className="text-3xl font-bold text-sky-400">
              {response?.examGroups?.length || 0}
            </span>
            Test Series
          </p>
        </div>

        <div className="bg-gradient-to-r from-sky-400 to-purple-600 col-span-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white p-6 rounded-2xl flex justify-center">
          <p className="flex gap-x-2 items-end">
            Joined{" "}
            <span className="text-2xl font-bold">
              {new Date(response?.createdAt || new Date()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </p>
        </div>
      </div>

      {/* Institution info */}
      <div className="flex justify-start my-8 px-4 gap-x-12">
        <div className="py-2">
          <p className="text-sm font-normal text-main-600">Institution Name</p>
          <h3 className="text-xl font-semibold first-letter:uppercase  text-main-900">
            {organization?.name}
          </h3>
        </div>
        <div className="py-2">
          <p className="text-sm font-normal text-main-600">Email</p>
          <h3 className="text-xl font-semibold text-main-900">
            {organization?.email}
          </h3>
        </div>
        <div className="py-2">
          <p className="text-sm font-normal text-main-600">Contact</p>
          <h3 className="text-xl font-semibold text-main-900">
            {organization?.contactNumber}
          </h3>
        </div>
      </div>

      {/* Invite Section */}
      <ClientProvider>
        <InviteSection
          inviteLink={organization?.inviteLink}
          orgId={organization?._id}
        />
      </ClientProvider>

      <div className="my-8">
        <h3 className="text-2xl font-semibold mb-4">Students</h3>
        <StudentsTable students={organization?.students} />
      </div>
    </section>
  );
};

export default Page;
