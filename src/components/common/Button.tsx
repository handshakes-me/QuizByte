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
      className={`${className} ${variant === "primary" ? "bg-sky-400 hover:bg-sky-400/90 text-white" : variant === "danger" ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"} px-8 py-2 rounded-md`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
