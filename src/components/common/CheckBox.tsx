import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const CheckBox = ({
  checked,
  onChange,
  className,
  disabled,
  id,
  name,
  ...props
}: {
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  props?: any;
  id?: string;
  name?: string;
}) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className={`${className} ${disabled ? "cursor-not-allowed" : ""} data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500`}
      {...props}
      disabled={disabled}
      id={id}
      name={name}
    />
  );
};

export default CheckBox;
