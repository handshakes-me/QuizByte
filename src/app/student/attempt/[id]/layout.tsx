'use client'

import ClientProvider from "@/components/common/ClientProvider";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ClientProvider>{children}</ClientProvider>;
};

export default Layout;
