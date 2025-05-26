"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  required,
  name,
  className,
  id,
  min,
  max,
  register,
  disabled = false,
  ...props
}: {
  icon?: React.ReactNode;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  min?: number;
  max?: number;
  id?: string;
  className?: string;
  register?: any;
  props?: any;
  disabled?: boolean;
}) => {
  const [inputType, setInputType] = useState<string>(type);

  return (
    <span
      className={`${className}  bg-purple-50 flex items-center border border-main-700 px-3 py-1 rounded-lg transition-all focus-within:ring-1 focus-within:ring-main-500`}
    >
      {Icon && (
        <span
          className={`"${disabled ? "text-gray-400" : "text-gray-500 "} px-1"`}
        >
          {Icon}
        </span>
      )}
      <Input
        min={min}
        max={max}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={register && register[name]?.error ? "true" : "false"}
        required={required}
        name={name}
        onKeyDown={onKeyDown}
        id={id}
        disabled={disabled}
        className="w-full bg-transparent placeholder:text-main-700 text-main-900 placeholder:text-base text-lg bg-purple-50 !border-none outline-none focus-visible:ring-0 !focus:ring-0 !focus:outline-none"
        {...(register ? register(name) : {})}
        {...props}
      />

      {type === "password" && (
        <button
          onClick={() =>
            inputType === "password"
              ? setInputType("text")
              : setInputType("password")
          }
          type="button"
          className="text-main-700"
        >
          <svg
            xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-eye"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      )}
    </span>
  );
};

export default InputField;
