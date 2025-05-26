"use client";

import MyButton from "@/components/common/Button";
import { useToast } from "@/hooks/use-toast";
import { BASEURL } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const VerifyEmail = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  async function verifyEmail() {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/verify-email`,
        { token },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        router.push("/login");
        toast({
          title: response?.data?.message || "Email verified successfully",
          description: "Login to continue",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again after sometime",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

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

        <p className="mt-6 mx-auto text-center w-[80%] text-xl space-y-1">
          Welcome to
          <span className="text-blue-600 font-semibold"> QuizByte,</span>
        </p>
        <p className="mt-6 mx-auto text-center w-[80%] text-lg space-y-1">
          Click the verify button below to complete your registration process.
        </p>

        <MyButton
          onClick={verifyEmail}
          variant="primary"
          className="w-full mt-8"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </MyButton>
      </div>
    </div>
  );
};

export default VerifyEmail;