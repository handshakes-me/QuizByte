"use client";

import ClientProvider from "@/components/common/ClientProvider";
import React, { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <ClientProvider>{children}</ClientProvider>
    </Suspense>
  );
};

export default layout;
