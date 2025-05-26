"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosPhonePortrait, IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 characters long")
    .max(14, "Contact number can be maximum of 14 characters"),
});

type formDataType = z.infer<typeof FormSchema>;

const CreateOrganizationForm = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate: createOrganization, isPending } = useMutation({
    mutationFn: async (data: formDataType) => {
      const response = await axios.post("/api/organization", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Organization created successfully",
        description: "Organization created successfully",
      });
      reset();
      setFormOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  useEffect(() => {
    if (!formOpen) {
      reset();
    }
  }, [formOpen, reset]);

  const submitHandler = (data: formDataType) => {
    createOrganization(data);
  };

  return (
    <div>
      <Button onClick={() => setFormOpen(true)}>Register new Institution</Button>
      <AnimatePresence>
        {formOpen && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative p-6 bg-main-50 text-main-900 rounded-md w-[90%] max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-main-900">
                  Register new Institution
                </h2>
                <button
                  className="text-xl text-gray-600 hover:text-red-500"
                  onClick={() => setFormOpen(false)}
                  aria-label="Close form"
                >
                  <IoMdClose />
                </button>
              </div>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="mt-4">
                  <Label
                    htmlFor="name"
                    className="text-main-600 capitalize mb-1 block"
                  >
                    Institution name
                  </Label>
                  <InputField
                    name="name"
                    type="text"
                    icon={<FaRegUser className="text-sky-400" />}
                    placeholder="Institution name"
                    register={register}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Label
                    htmlFor="email"
                    className="text-main-600 capitalize mb-1 block"
                  >
                    Email
                  </Label>
                  <InputField
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon={<MdOutlineMailOutline className="text-sky-400" />}
                    register={register}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Label
                    htmlFor="contactNumber"
                    className="text-main-600 capitalize mb-1 block"
                  >
                    Contact number
                  </Label>
                  <InputField
                    name="contactNumber"
                    type="number"
                    placeholder="Contact number"
                    icon={<IoIosPhonePortrait className="text-sky-400" />}
                    register={register}
                    className="mt-1"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateOrganizationForm;
