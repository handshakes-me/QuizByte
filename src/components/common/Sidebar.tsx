"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RiProfileLine } from "react-icons/ri";
import { GrOrganization } from "react-icons/gr";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `flex gap-x-3 items-center hover:text-main-900 transition px-4 py-2 rounded-md ${
      pathname === path
        ? "text-main-900 shadow-sm shadow-main-950 bg-sky-400 hover:text-main-900"
        : ""
    }`;

  return (
    <div className="min-h-screen shadow-md bg-main-50 text-main-9000 w-[240px] border-r border-main-300">
      <div className="p-4">
        <Link
          href="/"
          className="w-full bg-main-50 rounded-md font-bold py-2 flex items-center justify-center"
        >
          <Image src="/logo.png" alt="logo" width={140} height={34} />
        </Link>
      </div>
      <div className="w-full flex flex-col gap-y-2 px-8 py-2">
        <Link
          href="/dashboard/profile"
          className={linkClasses("/dashboard/profile")}
        >
          <RiProfileLine /> Profile
        </Link>
        <Link
          href="/dashboard/organizations"
          className={linkClasses("/dashboard/organizations")}
        >
          <GrOrganization /> Organizations
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
