"use client";

import ClientProvider from "@/components/common/ClientProvider";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <ClientProvider>{children}</ClientProvider>;
};

export default layout;
