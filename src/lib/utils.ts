import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const USERROLE = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN"

}
