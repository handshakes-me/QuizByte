"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { USERROLE } from "@/lib/utils";
import MyButton from "../common/Button";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Schema for form validation using zod
const signUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm password must be at least 8 characters long" })
    .max(50, { message: "Confirm password cannot exceed 50 characters" }),
  role: z.string().optional().default("STUDENT"),
  token: z.string().optional().default(""),
});

type FormData = z.infer<typeof signUpSchema>;

const signUp = async (data: FormData) => {
  const response = await axios.post("/api/auth/signup", data);
  return response.data;
};

const SignupForm = () => {
  const [role, setRole] = useState("");
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    mutate: signUpMutate,
    isPending,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast({
        title: data?.message || "User registered successfully",
        description: "A verification mail has been sent to your email.",
      });
      reset();
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
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setRole(USERROLE.ADMIN);
      setValue("role", USERROLE.ADMIN);
      setValue("token", token);
    }
  }, [searchParams, setValue]);

  const submitHandler = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    signUpMutate(data);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            QuizByte
          </Link>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {role === USERROLE.ADMIN ? 'Welcome, New Admin' : 'Create Your Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {role === USERROLE.ADMIN
              ? 'Complete your admin account setup'
              : 'Join us to start your learning journey'}
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              className={cn(
                "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                errors.name ? "border-red-500" : "border-gray-300"
              )}
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </Label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={cn(
                "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                errors.email ? "border-red-500" : "border-gray-300"
              )}
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          {/* Password */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              className={cn(
                "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                errors.password ? "border-red-500" : "border-gray-300"
              )}
              {...register("password")}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </Label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={cn(
                "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              )}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          {/* Admin Notice */}
          {role === USERROLE.ADMIN && (
            <div className="p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
              You're signing up as an <strong>Admin</strong>. Please use your organization email.
            </div>
          )}
          {/* Terms Notice */}
          <div className="text-center text-xs text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
          {/* Submit Button */}
          <div>
            <MyButton
              type="submit"
              className="w-full py-2.5 text-sm font-medium"
              disabled={isPending}
            >
              Create Account
            </MyButton>
          </div>
          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupForm;
