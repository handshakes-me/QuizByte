"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../common/InputField";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/slices/userSlice";

const UsernameFormSchema = z.object({
  name: z
    .string()
    .min(6, "name must be at least 8 characters")
    .refine((val) => val.includes(" "), {
      message: "name must contain at least one space",
    }),
});

type FormData = z.infer<typeof UsernameFormSchema>;

const UpdateUsernameForm = ({
  setFormType,
}: {
  setFormType: React.Dispatch<
    React.SetStateAction<"name" | "password" | "email" | null>
  >;
}) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const {
    mutate: updateUsername,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/api/auth/update-username", data);
      return response;
    },
    onSuccess: (data) => {
      if (data.data.success) {
        toast({
          title: "Username updated successfully",
          description: "Your username has been updated successfully",
        });
        dispatch(setUser(data?.data?.data));
        setFormType(null);
      }
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      setFormType(null);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameFormSchema),
  });

  const submitHandler = async (data: FormData) => {
    // console.log(data);
    await updateUsername(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mt-3">
        <Label htmlFor="name" className="text-main-600 mb-2">
          Full Name
        </Label>
        <InputField
          icon={<MdDriveFileRenameOutline className="text-sky-400" />}
          placeholder="Enter Full Name"
          type="text"
          id="name"
          className="mt-1"
          register={register}
          name="name"
        />

        {errors.name && (
          <p className="text-danger-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <Button variant="default" className="mt-3 w-full" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default UpdateUsernameForm;
