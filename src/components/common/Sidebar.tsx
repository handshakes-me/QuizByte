"use client";

import React from "react";
import Image from "next/image";
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
    `flex gap-x-3 items-center hover:text-main-900 transition px-4 py-2 rounded-md ${
      pathname === path
        ? "text-white shadow-sm shadow-main-950 bg-sky-400 hover:text-white"
        : ""
    }`;

  return (
    <section className="h-screen shadow-md bg-main-50 text-main-9000 w-[240px] border-r border-main-300 flex flex-col justify-between">
      <div className="">
        <div className="p-4">
          <Link
            href="/"
            className="w-full bg-main-50 rounded-md font-bold py-2 flex items-center justify-center"
          >
            <Image src="/logo.png" alt="logo" width={140} height={34} />
          </Link>
        </div>
        <div className="w-full flex flex-col gap-y-2 px-8 py-2">
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
      </div>
      <div className="my-8 px-8 ">
        <ClientProvider>
          <LogoutButton className="w-full" />
        </ClientProvider>
      </div>
    </section>
  );
};

export default Sidebar;
