import React from "react";
import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";

const Page = () => {
  return (
    <div className="grid grid-cols-12 max-h-screen overflow-hidden w-full">
      <div className="col-span-7 relative w-full h-screen flex items-center justify-center bg-main-900">
        <LoginForm />
      </div>
      <div className="col-span-5 w-full relative z-[1]">
        <Image 
          className="w-full min-h-screen object-center object-cover"
          src={'/loginImage.avif'}
          width={600}
          alt="login image"
          height={100}
        />
      </div>
    </div>
  );
};

export default Page;
