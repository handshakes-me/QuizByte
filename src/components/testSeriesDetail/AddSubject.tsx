import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { z } from "zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import TextAreaField from "../common/TextAreaField";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IoMdBook } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import { PiQrCode } from "react-icons/pi";

const formSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  description: z.string().min(1, "Subject description is required"),
  code: z.string().min(1, "Subject code is required"),
  examGroupId: z.string().optional(),
});

type FormDataType = z.infer<typeof formSchema>;

const AddSubject = ({ examGroupId }: { examGroupId: string }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: addSubject, isPending } = useMutation({
    mutationFn: async (formData: FormDataType) => {
      const response = await axios.post(
        `/api/subject`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Subject added successfully",
          description: "Subject added successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["examGroup"] });
      }
      reset();
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examGroupId: examGroupId,
    },
  });

  const submitHandler = (data: FormDataType) => {
    // console.log(data);
    addSubject(data);
  };

  useEffect(() => {
    if (formOpen) {
      setValue("name", "");
      setValue("description", "");
      setValue("code", "");
    }
  }, [formOpen])

  return (
    <div>
      <button
        className="h-full bg-sky-400 text-white p-2 text-xl rounded-md font-semibold shadow-sm shadow-main-950"
        onClick={() => setFormOpen(true)}
      >
        <IoMdAdd />
      </button>
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
                Add New subject
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject name
                </Label>
                <InputField
                  name="name"
                  type="text"
                  icon={<IoMdBook className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject name"
                  register={register}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs" >{errors.name.message}</span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject code
                </Label>
                <InputField
                  name="code"
                  type="text"
                  icon={<PiQrCode className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject code"
                  register={register}
                />
                {errors.code && (
                  <span className="text-red-500 text-xs" >{errors.code.message}</span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject Description
                </Label>
                <TextAreaField
                  name="description"
                  type="text"
                  resize={false}
                  icon={<MdOutlineDescription className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject description"
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
    </div>
  );
};

export default AddSubject;
