"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";

const LogoutButton = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const logout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");

      if (response.data.success) {
        toast({
          title: "Logout successful.",
        });
        setModalOpen(false);
        router.push("/");
      } else {
        toast({
          title: "Logout failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const openLogoutModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Button variant={"destructive"} onClick={openLogoutModal}>
        <span className="flex gap-x-1 items-center">
          <CgLogOut />
          Logout
        </span>
      </Button>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="inset-0 fixed bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-md shadow-sm shadow-main-950 bg-white flex flex-col gap-y-3 items-center p-8 text-main-900"
          >
            <h4 className="font-semibold text-2xl">Are you sure?</h4>
            <p className="text-center text-sm font-light">
              You&apos;ll be logged out from the account!
            </p>
            <span className="space-x-4">
              <Button onClick={() => setModalOpen(false)} variant="secondary">
                cancel
              </Button>
              <Button onClick={logout} variant="default">
                Logout
              </Button>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
