import { clsx, type ClassValue } from "clsx"
import { GrOrganization } from "react-icons/gr"
import { RiProfileLine } from "react-icons/ri"
import { twMerge } from "tailwind-merge"
import { HiOutlineCollection } from "react-icons/hi";
import { IoMdBook } from "react-icons/io";
import { PiExamDuotone } from "react-icons/pi";
import { SiStudyverse } from "react-icons/si";
import { GrSchedules } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export const USERROLE = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN"
}

export const SUPERADMINPAGES = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: RiProfileLine,
  },
  {
    name: "Organizations",
    href: "/dashboard/organizations",
    icon: GrOrganization,
  },
  {
    name: 'statistics',
    href: '/dashboard/statistics',
    icon: GrOrganization,
  }
]

export const ADMINPAGES = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: RiProfileLine,
  },
  {
    name: "Institution",
    href: '/dashboard/institution',
    icon: GrOrganization,
  },
  {
    name: 'Test Series',
    href: "/dashboard/test-series",
    icon: HiOutlineCollection,
  },
  // {
  //   name: 'Subjects',
  //   href: '/dashboard/subjects',
  //   icon: IoMdBook,
  // },
  // {
  //   name: 'Tests',
  //   href: '/dashboard/tests',
  //   icon: SiStudyverse,
  // },
  {
    name: 'Results',
    href: '/dashboard/results',
    icon: PiExamDuotone
  }
]

export const STUDENTPAGES = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: RiProfileLine,
  },
  {
    name: 'Instrututions',
    href: "/dashboard/joined-institutions",
    icon: HiOutlineCollection,
  },
  {
    name: 'Upcoming Tests',
    href: "/dashboard/upcoming-tests",
    icon: GrSchedules,
  },
  {
    name: 'Ongoing Tests',
    href: "/dashboard/ongoing-tests",
    icon: FaRegClock,
  },
]

export const EXAMGROUPSTATUS = {
  INACTIVE: 'INACTIVE',
  ACTIVE: "ACTIVE"
}

//"scheduled", "ongoing", "finished", "cancelled"
export const EXAMSTATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: "ongoing",
  FINISHED: "finished",
  CANCELLED: "cancelled"
}

export function getFormattedDate(isoString?: string, time: boolean = true): string {
  try {
    if (!isoString) return "Invalid Date";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid date");

    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    if (time) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    }

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
}
