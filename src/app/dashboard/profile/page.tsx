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
            className="text-2xl text-gray-600 hover:text-red-500 transition"
          >
            <IoMdClose />
          </button>
        </div>
        <ClientProvider>{forms[type]}</ClientProvider>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-purple-50 py-8">
      <div className="mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8 max-w-lg">
        <h2 className="text-3xl font-bold text-main-900 text-center">
          Profile Overview
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-gray-500">Full Name</h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-gray-800">{user?.name}</p>
              <button
                onClick={() => setFormType("name")}
                className="text-sky-500 hover:text-sky-700 transition"
              >
                <FaRegEdit className="text-xl" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Email</h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
              {/*
              Uncomment to allow email editing:
              <button
                onClick={() => setFormType("email")}
                className="text-sky-500 hover:text-sky-700 transition"
              >
                <FaRegEdit className="text-xl" />
              </button>
              */}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Joined On</h3>
            <p className="text-lg font-medium text-gray-800">
              {getFormattedDate(user?.createdAt, false)}
            </p>
          </div>
        </div>
      </div>

      {formType && (
        <div
          onClick={() => setFormType(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 w-[90%] max-w-lg shadow-2xl animate-fadeIn"
          >
            {renderForm(formType)}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
};

export default Page;
