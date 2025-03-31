"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import InputField from "../common/InputField";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { USERROLE } from "@/lib/utils";
import MyButton from "../common/Button";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
});

type FormData = z.infer<typeof signUpSchema>;

const signUp = async (data: FormData) => {
  const response = await axios.post("/api/auth/signup", data);
  return response.data;
};

const SignupForm = () => {
  const [role, setRole] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const {
    mutate: signUpMutate,
    isPending,
    isSuccess,
    isError,
    error,
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
    handleSubmit,
    setValue,
    getValues,
    register,
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
    }
  }, []);

  const submitHandler = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    signUpMutate(data);
  };

  return (
    <main className="relative p-10 bg-main-50 rounded-xl w-[580px] border border-main-600 shadow-md shadow-main-950">
      {/* form header */}
      <div>
        <Link href={'/'}>
          <Image
            src={"/logo.png"} 
            className="w-[170px]"
            alt="logo"
            width={200}
            height={50}
          />
        </Link>
        <div className="my-6 text-lg space-y-1">
          {role === USERROLE.ADMIN && (
            <p>
              Welcome You have been appointed as an{" "}
              <span className="text-blue-500 font-semibold">Admin</span>.
            </p>
          )}
          <p>
            <span className="text-blue-500 font-semibold">Sign up</span> to get
            started with the application
          </p>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(submitHandler)}>
        {/* name */}
        <div>
          <Label htmlFor="name" className="text-main-600">
            Full Name
          </Label>
          <InputField
            name="name"
            type="text"
            placeholder="Enter your name"
            id="name"
            icon={<FaRegUser className="text-blue-700" />}
            className="mt-1"
            register={register}
          />
          {errors.name && (
            <p className="text-danger-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* email */}
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
            icon={<MdOutlineMailOutline className="text-blue-700" />}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-danger-500 mt-1">{errors.email.message}</p>
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
            icon={<TbPassword className="text-blue-700" />}
            className="mt-1"
          />
          {errors.password && (
            <p className="text-danger-500 mt-1">{errors.password.message}</p>
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
            icon={<TbPassword className="text-blue-700" />}
            className="mt-1"
          />
          {errors.confirmPassword && (
            <p className="text-danger-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <p className="text-center pt-4">
          By submitting the form you agree to our{" "}
          <span className="text-blue-500 font-semibold cursor-pointer">
            Terms of Service
          </span>{" "}
        </p>

        <MyButton
          onClick={() => {}}
          type="submit"
          variant="primary"
          className="mt-5 w-full"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </MyButton>

        <p className="text-center mt-4">
          already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 font-semibold cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignupForm;
