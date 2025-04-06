import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {

  return (
    <div className="min-h-screen bg-main-900">
      <Link href={"/signup"}>
        <Button variant="secondary" className="m-5">Sign up</Button>
      </Link>
      <Link href={"/login"}>
        <Button className="m-5">Login</Button>
      </Link>
      <Link href={"/dashboard"}>
        <Button className="m-5">Dashboard</Button>
      </Link>
    </div>
  );
};

export default page;
