import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";

const Page = () => {
  return (
    <div className="grid grid-cols-12 min-h-screen w-full">
      <div className="col-span-5 w-full relative z-[1]">
        <Image
          className="w-full min-h-screen object-bottom object-cover"
          src={"/signupImage.avif"}
          width={600}
          alt="login image"
          height={100}
        />
      </div>
      <div className="col-span-7 relative w-full h-screen flex items-center justify-center bg-main-900">
        <SignupForm />
      </div>
    </div>
  );
};

export default Page;
