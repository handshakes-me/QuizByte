"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { FaRegEdit, FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineDescription } from "react-icons/md";
import TextAreaField from "../common/TextAreaField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { EXAMGROUPSTATUS } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Test series name is required"),
  description: z.string().min(1, "Test series description is required"),
});

type formDataType = z.infer<typeof formSchema>;

const EditTestSeriesForm = ({
  data,
}: {
  data: {
    name: string;
    description: string;
    _id: string;
    status: string;
  };
}) => {
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
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description);
    }
  }, [data]);

  const { mutate: updateTestSeries, isPending } = useMutation({
    mutationFn: async (formData: formDataType) => {
      const response = await axios.patch(
        `/api/examGroup/${data?._id}`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Test series updated successfully",
          description: "Test series updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["examGroup"] });
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

  const { mutate: updateStatus, isPending: isUpdateStatusPending } =
    useMutation({
      mutationFn: async (status: string) => {
        const response = await axios.post(
          `/api/examGroup/${data?._id}/status`,
          {
            status,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        if (data.success) {
          toast({
            title: "Status updated successfully",
            description: "Status updated successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["examGroup"] });
        }
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
    updateTestSeries(data);
  };

  const handleStatusChange = (value: string) => {
    updateStatus(value);
  };

  return (
    <>
      <div className="flex gap-x-4">
        <Select onValueChange={handleStatusChange} defaultValue={data?.status}>
          <SelectTrigger className="w-[140px] border border-main-900 bg-white">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={EXAMGROUPSTATUS.INACTIVE}>Inactive</SelectItem>
              <SelectItem value={EXAMGROUPSTATUS.ACTIVE}>Active</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={() => setFormOpen(true)}>
          <FaRegEdit />
        </Button>
      </div>
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-purple-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Edit test series details
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
                  <span className="text-red-500 text-xs" >{errors.name.message}</span>
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
                  <span className="text-red-500 text-xs" >
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

export default EditTestSeriesForm;
