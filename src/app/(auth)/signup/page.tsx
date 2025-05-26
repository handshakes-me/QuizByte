import React, { Suspense } from "react";
import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";
import ClientProvider from "@/components/common/ClientProvider";

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen w-full">
      {/* Left Section: Illustration & Welcome Message */}
      <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center bg-gray-900">
      
        <div className="absolute z-10 p-6 text-center">
          <h1 className="text-white text-4xl font-bold">Welcome to QuizByte</h1>
          <p className="mt-4 text-white text-lg">
            Embark on a journey of knowledge and discovery.
          </p>
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className="lg:col-span-7 flex items-center justify-center bg-white">
        <ClientProvider>
          <Suspense fallback={<div className="text-gray-800">Loading...</div>}>
            <SignupForm />
          </Suspense>
        </ClientProvider>
      </div>
    </div>
  );
};

export default Page;
