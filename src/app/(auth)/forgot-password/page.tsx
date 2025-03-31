import ForgotPasswordForm from "@/components/forgotPassword/ResetPasswordForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-main-950 flex items-center justify-center">
      <div className="w-[580px] bg-main-50 min-h-[100px] p-10 rounded-lg">
        <Link href="/">
          <Image
            width={200}
            height={50}
            alt="logo"
            className="mx-auto"
            src={"/logo.png"}
          />
        </Link>

        <p className="my-6 mx-auto text-center w-[80%] text-lg space-y-1">
          Enter your email address and we'll send you a link to reset your
          password
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default page;
