"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineDescription } from "react-icons/md";
import TextAreaField from "../common/TextAreaField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(1, "Test series name is required"),
  description: z.string().min(1, "Test series description is required"),
  organizationId: z.string(),
});

type formDataType = z.infer<typeof formSchema>;

const AddTestSeriesForm = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(formSchema),
  });

  // Pre-populate organizationId from the logged user
  useEffect(() => {
    if (user) {
      setValue("organizationId", user?.organizationId || "");
    }
  }, [user, setValue]);

  const { mutate: createTestSeries, isPending } = useMutation({
    mutationFn: async (data: formDataType) => {
      const response = await axios.post("/api/examGroup", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["testSeries"] });
        toast({
          title: "Test series created successfully",
          description: "Test series created successfully",
        });
      }
      reset();
      setFormOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        title: "Something went wrong",
        description: error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const submitHandler = (data: formDataType) => {
    createTestSeries(data);
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)} className="btn btn-primary">
        Add Test Series
      </Button>
      <AnimatePresence>
        {formOpen && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative p-6 bg-purple-50 text-main-900 rounded-md w-[90%] max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-main-900">
                  Add a new test series
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-xl text-gray-600 hover:text-red-500"
                  aria-label="Close form"
                >
                  <IoMdClose />
                </button>
              </div>
              <form onSubmit={handleSubmit(submitHandler)} className="mt-4 space-y-4">
                {/* Test series name field */}
                <div>
                  <Label htmlFor="name" className="text-main-600 capitalize">
                    Test series name
                  </Label>
                  <InputField
                    name="name"
                    type="text"
                    icon={<FaRegUser className="text-sky-400" />}
                    placeholder="Enter test series name"
                    register={register}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Test series description field */}
                <div>
                  <Label htmlFor="description" className="text-main-600 capitalize">
                    Test series Description
                  </Label>
                  <TextAreaField
                    name="description"
                    type="text"
                    resize={false}
                    icon={<MdOutlineDescription className="text-sky-400" />}
                    placeholder="Enter test series description"
                    register={register}
                    className="mt-1"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
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
    </>
  );
};

export default AddTestSeriesForm;
