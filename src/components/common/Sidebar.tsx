"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  ADMINPAGES,
  STUDENTPAGES,
  SUPERADMINPAGES,
  USERROLE,
} from "@/lib/utils";
import ClientProvider from "./ClientProvider";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);

  const linkClasses = (path: string) =>
    `flex gap-x-3 items-center px-4 py-3 rounded-lg text-red transition-all duration-200 ease-in-out relative overflow-hidden ${
      pathname === path
        ? "text-white bg-gradient-to-r from-indigo-700 to-indigo-700 shadow-lg shadow-indigo-500/30 scale-[1.02] font-medium"
        : "hover:bg-white/50 hover:text-main-900 hover:scale-[1.02]"
    }`;

  return (
    <nav className="h-screen text-main-900  bg-gradient-to-b bg-blue-200 w-[240px] border-r border-gray-200 shadow-lg shadow-gray-200/50 transition-all duration-300 ease-in-out">
      <div className="flex  flex-col h-full justify-between gap-8">
        {/* QuizByte Logo/Title */}
        <div className="px-14 py-4">
          <Link href="/" className="text-3xl font-bold text-indigo-700">
            QuizByte
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col mt-24 flex-grow gap-y-2 px-8 py-2">
          {user?.role === USERROLE.SUPERADMIN &&
            SUPERADMINPAGES.map((page) => (
              <Link
                href={page.href}
                className={linkClasses(page.href)}
                key={page.name}
              >
                <page.icon /> {page.name}
              </Link>
            ))}
          {user?.role === USERROLE.ADMIN &&
            ADMINPAGES.map((page) => (
              <Link
                href={page.href}
                className={linkClasses(page.href)}
                key={page.name}
              >
                <page.icon /> {page.name}
              </Link>
            ))}
          {user?.role === USERROLE.STUDENT &&
            STUDENTPAGES.map((page) => (
              <Link
                href={page.href}
                className={linkClasses(page.href)}
                key={page.name}
              >
                <page.icon /> {page.name}
              </Link>
            ))}
        </div>

        {/* Logout Button */}
        <div className="px-8 pb-8">
          <ClientProvider>
            <LogoutButton className="w-full" />
          </ClientProvider>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
