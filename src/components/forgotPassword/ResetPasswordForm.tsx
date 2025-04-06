"use client";

import React from "react";
import InputField from "../common/InputField";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdOutlineMailOutline } from "react-icons/md";
import MyButton from "../common/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

const resetPassword = async (data: FormData) => {
  const response = await axios.post("/api/auth/forgot-password", data);

  return response.data;
};

const ForgotPasswordForm = () => {
  const { toast } = useToast();

  const {
    mutate: forgotPasswordMutation,
    isPending,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      toast({
        title: data?.message || "mail sent successfully",
        description: "Check your registered email for further instructions",
      });
      reset();
    //   router.push("/reset-password");
    },
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => forgotPasswordMutation(data))}>
      <div className="mt-3">
        <Label htmlFor="email" className="text-main-600">
          Email
        </Label>
        <InputField
          type="email"
          placeholder="Enter your email"
          register={register}
          id="email"
          name="email"
          icon={<MdOutlineMailOutline className="text-sky-400" />}
          className="mt-1"
        />
        {errors.email && (
          <p className="text-danger-500 mt-1 text-sm" >{errors.email.message}</p>
        )}
      </div>

      <MyButton
        onClick={() => {}}
        type="submit"
        variant="primary"
        className="mt-3 w-full"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
      </MyButton>
    </form>
  );
};

export default ForgotPasswordForm;
