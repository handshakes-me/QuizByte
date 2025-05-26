import React, { Suspense } from "react";
import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";
import ClientProvider from "@/components/common/ClientProvider";
import { Toaster } from "@/components/ui/toaster";

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen w-full">
      {/* Left Section: Illustration & Welcome Message */}
      <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center bg-gradient-to-br from-blue-600 to-purple-500">
      
        <div className="absolute z-10 p-6 text-center">
          <h1 className="text-white text-4xl font-bold">Welcome Back!</h1>
          <p className="mt-4 text-white text-lg">
            Continue your learning journey with QuizByte.
          </p>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="lg:col-span-7 flex items-center justify-center bg-white">
        <ClientProvider>
          <Suspense fallback={<div className="text-gray-800">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </ClientProvider>
      </div>
    </div>
  );
};

export default Page;
