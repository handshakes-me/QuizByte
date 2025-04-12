"use client";

import { useToast } from "@/hooks/use-toast";
import { BASEURL } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LuRefreshCcw } from "react-icons/lu";

const InviteSection = ({
  inviteLink,
  orgId,
}: {
  inviteLink?: string;
  orgId?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const data = axios.patch(`/api/organization/${orgId}/invitationLink`);
      return data;
    },
    onSuccess: (data) => {
      console.log("data : ", data);
      toast({
        title: "New link generated",
        description: "Share this link with your students",
      });
      router.refresh();
      setModalOpen(false);
    },
    onError: (error) => {
      console.log("error : ", error);
      toast({
        title: "Error while generating new link",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(
        BASEURL + "/joinInstitution?token=" + inviteLink
      );
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with your students",
      });
    } catch (e) {
      console.log("Error while copying link : ", e);
      toast({
        title: "Error while copying link",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const generateNewInvitationLink = () => {
    console.log("generating new token");
    mutate();
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Student Invitation Link</h3>
      <div className="bg-white rounded-md p-3 flex justify-between items-center">
        <p className="text-gray-500 line-clamp-1">
          {BASEURL + "/joinInstitution?token=" + inviteLink}
        </p>
        <button
          className="p-2 rounded-full hover:bg-main-100 transition-all duration-300"
          onClick={copyLink}
        >
          {copied ? (
            <IoCheckmarkDoneSharp className="text-green-500" />
          ) : (
            <FaRegCopy />
          )}
        </button>
      </div>
      <div>
        <Button onClick={() => setModalOpen(true)} className="mt-4 flex gap-x-2 items-center">
          <LuRefreshCcw />
          Generate new invitation link
        </Button>
      </div>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="inset-0 fixed bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-md shadow-sm shadow-main-950 bg-white flex flex-col gap-y-3 items-center p-8 text-main-900"
          >
            <h4 className="font-semibold text-2xl">Generate a new link</h4>
            <p className="text-center text-sm font-light">
              Generating a new link will invalidate the previous one.
            </p>
            <span className="space-x-4">
              <Button onClick={() => setModalOpen(false)} variant="secondary">
                cancel
              </Button>
              <Button
                onClick={generateNewInvitationLink}
                variant="default"
                disabled={isPending}
              >
                Generate
              </Button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteSection;
