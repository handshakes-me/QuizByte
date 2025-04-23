"use client";

import ClientProvider from "@/components/common/ClientProvider";
import VerifyEmail from "@/components/verifyEmail/VerifyEmail";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ClientProvider>
        <VerifyEmail />
      </ClientProvider>
    </Suspense>
  );
};

export default Page;
