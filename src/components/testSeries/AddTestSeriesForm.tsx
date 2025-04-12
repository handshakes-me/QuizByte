"use client";

import React, { use, useEffect, useState } from "react";
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
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("organizationId", user?.organizationId || "");
    }
  }, [user]);

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
      setFormOpen(false);
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const submitHandler = async (data: formDataType) => {
    createTestSeries(data);
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)} className="btn btn-primary">
        Add Test Series
      </Button>
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-main-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Add a new test series
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Test series name
                </Label>
                <InputField
                  name="name"
                  type="text"
                  icon={<FaRegUser className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Test series"
                  register={register}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Test series Description
                </Label>
                <TextAreaField
                  name="description"
                  type="text"
                  resize={false}
                  icon={<MdOutlineDescription className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Test series"
                  register={register}
                  rows={4}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <span className="flex gap-x-4 justify-end mt-6">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </span>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTestSeriesForm;
