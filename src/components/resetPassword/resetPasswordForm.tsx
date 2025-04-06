"use client";

import React, { useEffect } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { TbPassword } from "react-icons/tb";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  token: z.string().optional(),
});

type FormData = z.infer<typeof resetPasswordSchema>;

const resetPassword = async (data: FormData) => {
  const response = await axios.post("/api/auth/reset-password", data);

  return response.data;
};

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const {
    handleSubmit,
    setValue,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const {
    mutate: resetPasswordMutate,
    isPending,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      toast({
        title: data?.message || "Password reset successfully",
        description: "Login with your latest password to get started.",
      });
      reset();
      router.push("/login");
    },
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const submitHandler = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    resetPasswordMutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mt-3">
        <Label htmlFor="email" className="text-main-600 capitalize">
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

      {/* password */}
      <div className="mt-3">
        <Label htmlFor="password" className="text-main-600 capitalize">
          password
        </Label>
        <InputField
          type="password"
          placeholder="Enter your password"
          register={register}
          id="password"
          name="password"
          icon={<TbPassword className="text-sky-400" />}
          className="mt-1"
        />
        {errors.password && (
          <p className="text-danger-500 mt-1 text-sm" >{errors.password.message}</p>
        )}
      </div>

      {/* password */}
      <div className="mt-3">
        <Label htmlFor="confirmPassword" className="text-main-600 capitalize">
          confirm password
        </Label>
        <InputField
          type="password"
          placeholder="confirm your password"
          register={register}
          id="confirmPassword"
          name="confirmPassword"
          icon={<TbPassword className="text-sky-400" />}
          className="mt-1"
        />
        {errors.confirmPassword && (
          <p className="text-danger-500 mt-1 text-sm" >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <MyButton
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
