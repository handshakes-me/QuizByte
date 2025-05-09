"use client";

import Badge from "@/components/common/Badge";
import Loader from "@/components/common/Loader";
import JoinOrganizationForm from "@/components/joinOrganization/JoinOrganizationForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { LiaBookSolid } from "react-icons/lia";
import { PiExam, PiStudent } from "react-icons/pi";

const page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, isPending } = useQuery({
    queryKey: ["institution"],
    queryFn: async () => {
      const response = await axios.get(`/api/student/organization/${token}`);
      return response.data.data;
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!isPending && !data) {
    return (
      <div className="w-full h-screen flex justify-center flex-col gap-y-4 items-center">
        <h1 className="text-2xl font-semibold">Invalid Invite Link</h1>
        <Button>
          <Link href={"/dashboard/profile"}>Back To Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-x-14">
        <div className="flex flex-col gap-y-2">
          <h4 className="text-sm font-semibold">Institution Name</h4>
          <h2 className="text-xl font-semibold">{data.name}</h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <h4 className="text-sm font-semibold">Institution Email</h4>
          <p className="text-xl font-semibold">{data.email}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h4 className="text-sm font-semibold">Institution Contact</h4>
          <p className="text-xl font-semibold">{data.contactNumber}</p>
        </div>
      </div>

      <div className="flex gap-x-2 my-8">
        <Badge
          text={data?.students?.length?.toString() || "0"}
          icon={<PiStudent />}
        />
        <Badge
          text={data?.examGroups?.length?.toString() || "0"}
          icon={<PiExam />}
        />
      </div>

      <div>
        <JoinOrganizationForm
          organizationId={data?._id}
          token={data?.inviteLink}
        />
      </div>
    </div>
  );
};

export default page;
