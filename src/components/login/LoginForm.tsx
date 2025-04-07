"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import MyButton from "../common/Button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/slices/userSlice";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof loginSchema>;

const signUp = async (data: FormData) => {
  const response = await axios.post("/api/auth/login", data, {
    withCredentials: true, // ⬅️ This is crucial
  });

  return response.data;
};

const LoginForm = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    mutate: loginMutate,
    isPending,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: (data: any) => {
      toast({
        title: data?.message || "User registered successfully",
        description: "Welcome back.",
      });

      // save received user in state and localstorage
      dispatch(setUser(data?.data));
      localStorage.setItem("user", JSON.stringify(data?.data));

      reset();
      router.push("/dashboard");
      router.refresh();
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
    resolver: zodResolver(loginSchema),
  });

  const submitHandler = (data: FormData) => {
    loginMutate(data);
  };

  return (
    <main className="relative p-10 bg-main-50 rounded-xl w-[580px] border border-main-600 shadow-md shadow-main-950">
      {/* form header */}
      <div>
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            className="w-[170px]"
            alt="logo"
            width={200}
            height={50}
          />
        </Link>
        <div className="my-6 text-lg space-y-1">
          <p>
            <span className="text-sky-400 font-semibold">Log in</span> with
            your registered email and password.
          </p>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(submitHandler)}>
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

        <Link href={"/forgot-password"}>
          <p className="text-sky-400 text-sm font-semibold text-right mt-2 cursor-pointer">
            Forgot password?
          </p>
        </Link>

        <MyButton
          onClick={() => {}}
          type="submit"
          variant="primary"
          className="mt-3 w-full"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </MyButton>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            className="text-sky-400 font-semibold cursor-pointer"
            href="/signup"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginForm;
