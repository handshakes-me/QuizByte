import { Button } from '@/components/ui/button'
import React from 'react'

const MyButton = ({
    type,
    onClick,
    children,
    className,
    disabled,
    variant,
    ...props
}: {
    type?: "submit" | "reset" | "button",
    onClick?: () => void,
    children: React.ReactNode,
    className?: string,
    disabled?: boolean,
    variant: "primary" | "secondary",
    props?: any
}) => {
  return (
    <Button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${className} ${variant === "primary" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"} px-8 py-2 rounded-md`}
        {...props}
    >
    {children}
    </Button>
  )
}

export default MyButton