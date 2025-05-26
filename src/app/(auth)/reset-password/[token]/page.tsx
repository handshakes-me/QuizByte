import Image from "next/image";
import React from "react";
import ResetPasswordForm from "@/components/resetPassword/resetPasswordForm";
import Link from "next/link";
import ClientProvider from "@/components/common/ClientProvider";

const Page = () => {
  return (
    <div className="min-h-screen bg-main-950 flex items-center justify-center">
      <div className="w-[580px] bg-purple-50 min-h-[100px] p-10 rounded-lg">
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
          Reset your password by entering your new password below
        </p>

        <ClientProvider>
          <ResetPasswordForm />
        </ClientProvider>
      </div>
    </div>
  );
};

export default Page;
