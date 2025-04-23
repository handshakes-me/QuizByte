import React from "react";
import EditOrganizationForm from "./EditOrganizationForm";
import ClientProvider from "../common/ClientProvider";

export type Organization = {
  email: string;
  name: string;
  students: any[];
  contactNumber: string;
  inviteLink: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  examGroups: any[];
};

const OrganizationDataTable = ({ data }: { data: Organization[] }) => {
  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="text-main-900 min-h-screen grid place-items-center">
          <h2 className="text-2xl font-semibold">No Organizations Found</h2>
        </div>
      ) : (
        <table className="min-w-full divide-y rounded-md overflow-hidden divide-main-200">
          <thead className="bg-main-100 whitespace-nowrap">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                contact
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                students
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-main-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-main-200 whitespace-nowrap">
            {data.map((org, index) => (
              <tr key={index}>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.name}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  <a href={`mailto:${org?.email}`}>{org?.email}</a>
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  <a href={`tel:${org?.contactNumber}`}>{org?.contactNumber}</a>
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  {org?.students?.length}
                </td>
                <td className="px-4 py-4 text-sm text-main-900 font-medium">
                  <ClientProvider>
                    <EditOrganizationForm organization={org} />
                  </ClientProvider>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizationDataTable;
