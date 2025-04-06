"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { FaRegEdit, FaRegUser } from "react-icons/fa";
import { IoIosPhonePortrait, IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 charectors long")
    .max(14, "Contact number can be maximum of 14 charecters"),
});

type formDataType = z.infer<typeof FormSchema>;

const EditOrganizationForm = ({
  organization,
}: {
  organization: {
    name: string;
    contactNumber: string;
    _id: string;
  };
}) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (formOpen) {
      setValue("name", organization.name);
      setValue("contactNumber", organization.contactNumber);
    }
  }, [organization, setValue, formOpen]);

  const { mutate: editOrganization, isPending } = useMutation({
    mutationFn: async (data: formDataType) => {
      const response = await axios.patch(
        `/api/organization/${organization?._id}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Organization edited successfully",
        description: "Organization edited successfully",
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
      console.log(error);
    },
  });

  const submitHandler = (data: formDataType) => {
    editOrganization(data);
  };

  return (
    <div>
      <button onClick={() => setFormOpen(true)}>
        <FaRegEdit />
      </button>
      {formOpen && (
        <section
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-main-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Edit Organization
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Organization name
                </Label>
                <InputField
                  name="name"
                  type="text"
                  icon={<FaRegUser className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Organization name"
                  register={register}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="mt-3">
                <Label
                  htmlFor="contactNumber"
                  className="text-main-600 capitalize"
                >
                  Contact number
                </Label>
                <InputField
                  name="contactNumber"
                  type="number"
                  icon={<IoIosPhonePortrait className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Contact number"
                  register={register}
                />
                {errors.contactNumber && (
                  <span className="text-red-500">
                    {errors.contactNumber.message}
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
        </section>
      )}
    </div>
  );
};

export default EditOrganizationForm;
