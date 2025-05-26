"use client";

import React, { useState } from "react";
import { Textarea } from "../ui/textarea";

const TextAreaField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  name,
  className,
  id,
  register,
  rows,
  resize = true,
  ...props
}: {
  icon?: React.ReactNode;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  resize?: boolean;
  id?: string;
  className?: string;
  register?: any;
  props?: any;
  rows?: number;
}) => {
  const [inputType, setInputType] = useState<string>(type);

  return (
    <span
      className={`${className}  bg-purple-50 flex items-start border border-main-700 px-3 py-1 rounded-lg transition-all focus-within:ring-1 focus-within:ring-main-500`}
    >
      {Icon && <span className="text-gray-500 px-1 mt-3">{Icon}</span>}
      <Textarea
        type={inputType}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={register && register[name]?.error ? "true" : "false"}
        required={required}
        name={name}
        id={id}
        style={{
            resize: !resize? "none" : "vertical"
        }}
        className="w-full bg-transparent placeholder:text-main-700 text-main-900 placeholder:text-base text-lg bg-purple-50 !border-none outline-none focus-visible:ring-0 !focus:ring-0 !focus:outline-none"
        {...(register ? register(name) : {})}
        {...props}
      />
    </span>
  );
};

export default TextAreaField;
