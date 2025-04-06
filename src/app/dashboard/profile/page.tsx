"use client";

import { RootState } from "@/app/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatRelative, subDays } from "date-fns";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/common/LogoutButton";
import UpdateUsernameForm from "@/components/profile/UpdateUsernameForm";
import UpdateEmailForm from "@/components/profile/UpdateEmailForm";
import UpdatePasswordForm from "@/components/profile/UpdatePasswordForm";
import { IoMdClose } from "react-icons/io";

const page = () => {
  const [formType, setFormType] = useState<
    "name" | "email" | "password" | null
  >(null);
  const { user } = useSelector((state: RootState) => state?.user);

  const renderForm = (type: String) => {
    switch (type) {
      case "name":
        return (
          <>
            <span className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold mb-2">Update Full Name</h2>
              <button className="text-xl" onClick={() => setFormType(null)}>
                <IoMdClose />
              </button>
            </span>
            <UpdateUsernameForm setFormType={setFormType} />
          </>
        );
      case "email":
        return (
          <>
            <span className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold mb-2">Update Email</h2>
              <button className="text-xl" onClick={() => setFormType(null)}>
                <IoMdClose />
              </button>
            </span>
            <UpdateEmailForm setFormType={setFormType} />
          </>
        );
      case "password":
        return (
          <>
            <span className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold mb-2">Update Password</h2>
              <button className="text-xl" onClick={() => setFormType(null)}>
                <IoMdClose />
              </button>
            </span>
            <UpdatePasswordForm setFormType={setFormType} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main className="">
      <section className="">
        <div className="w-full bg-main-50 text-main-900 rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>

          <div className="my-6">
            <h3 className="text-main-900/60 text-sm">Full Name</h3>
            <span className="flex gap-x-4 items-center">
              <h4 className="text-lg">{user?.name}</h4>
              <button
                onClick={() => setFormType("name")}
                className="text-sky-400"
              >
                <FaRegEdit />
              </button>
            </span>
          </div>

          <div className="my-6">
            <h3 className="text-main-900/60  text-sm">Email</h3>
            <span className="flex gap-x-4 items-center">
              <h4 className="text-lg">{user?.email}</h4>
              <button
                onClick={() => setFormType("email")}
                className="text-sky-400"
              >
                <FaRegEdit />
              </button>
            </span>
          </div>

          <div className="my-6">
            <h3 className="text-main-900/60 text-sm">Joined</h3>
            <span className="flex gap-x-6 items-center">
              <h4 className="text-lg">
                {formatRelative(subDays(new Date(), 3), new Date())}
              </h4>
            </span>
          </div>

          <div className="my-6 flex gap-x-4">
            <Button onClick={() => setFormType("password")}>
              <span className="flex gap-x-2 items-center">
                <FaRegEdit />
                Update Password
              </span>
            </Button>

            <LogoutButton />
          </div>
        </div>

        {formType && (
          <div
            onClick={() => setFormType(null)}
            className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative p-6 bg-main-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
            >
              {renderForm(formType)}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default page;
