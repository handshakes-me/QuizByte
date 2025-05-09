"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import UpdateUsernameForm from "@/components/profile/UpdateUsernameForm";
import UpdateEmailForm from "@/components/profile/UpdateEmailForm";
import UpdatePasswordForm from "@/components/profile/UpdatePasswordForm";
import { getFormattedDate } from "@/lib/utils";
import ClientProvider from "@/components/common/ClientProvider";

type FormType = "name" | "email" | "password";

const Page = () => {
  const [formType, setFormType] = useState<FormType | null>(null);
  const { user } = useSelector((state: RootState) => state?.user);

  const renderForm = (type: FormType) => {
    const forms: Record<FormType, React.ReactNode> = {
      name: <UpdateUsernameForm setFormType={setFormType} />,
      email: <UpdateEmailForm setFormType={setFormType} />,
      password: <UpdatePasswordForm setFormType={setFormType} />,
    };

    const titles: Record<FormType, string> = {
      name: "Update Full Name",
      email: "Update Email",
      password: "Update Password",
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-xl font-semibold">{titles[type]}</h2>
          <button
            onClick={() => setFormType(null)}
            className="text-2xl text-gray-600 hover:text-red-500"
          >
            <IoMdClose />
          </button>
        </div>
        <ClientProvider>{forms[type]}</ClientProvider>
      </div>
    );
  };

  return (
    <main className="">
      <div className=" mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-medium text-main-900">Profile Overview</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Full Name</h3>
            <div className="flex items-center justify-start gap-x-8">
              <p className="text-lg font-medium">{user?.name}</p>
              <button
                onClick={() => setFormType("name")}
                className="text-sky-500 hover:text-sky-700 transition"
              >
                <FaRegEdit />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Email</h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">{user?.email}</p>
              {/* <button
                onClick={() => setFormType("email")}
                className="text-sky-500 hover:text-sky-700 transition"
              >
                <FaRegEdit />
              </button> */}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Joined On</h3>
            <p className="text-lg font-medium">
              {getFormattedDate(user?.createdAt, false)}
            </p>
          </div>
        </div>

        {/* <div>
          <Button
            onClick={() => setFormType("password")}
            className="bg-sky-400 text-white hover:bg-sky-500"
          >
            <span className="flex items-center gap-2">
              <FaRegEdit />
              Update Password
            </span>
          </Button>
        </div> */}
      </div>

      {formType && (
        <div
          onClick={() => setFormType(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-2xl animate-fadeIn"
          >
            {renderForm(formType)}
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
