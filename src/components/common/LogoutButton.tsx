"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

const LogoutButton = ({ className }: { className?: string }) => {
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
        window.location.href = "/";
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
      <button className={`${className} px-4 py-2`} onClick={openLogoutModal}>
        <span className="flex items-center text-base gap-x-3">
          <CgLogOut className="text-xl" />
          Logout
        </span>
      </button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="inset-0 fixed bg-black/40 z-[999] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-max rounded-2xl shadow-xl bg-white flex flex-col gap-y-4 items-center p-10 text-main-900"
            >
              <h4 className="font-semibold text-2xl">Are you sure?</h4>
              <p className="text-center text-sm font-light">
                You'll be logged out from the account!
              </p>
              <div className="space-x-4">
                <Button onClick={() => setModalOpen(false)} variant="secondary">
                  Cancel
                </Button>
                <Button onClick={logout} variant="default">
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoutButton;
