"use client";

import VerifyEmail from "@/components/verifyEmail/VerifyEmail";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
};

export default Page;
