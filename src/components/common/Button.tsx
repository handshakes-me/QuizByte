"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const MyButton = ({
  type,
  onClick,
  children,
  className,
  disabled,
  variant = "primary",
  ...props
}: {
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  props?: any;
}) => {
  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${variant === "primary" ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30" : variant === "danger" ? "bg-rose-600 hover:bg-rose-700 shadow-lg hover:shadow-rose-500/30" : "bg-gray-600 hover:bg-gray-700 shadow-lg hover:shadow-gray-500/30"} px-8 py-2 rounded-md text-white transform transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
