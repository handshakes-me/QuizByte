import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

const page = () => {

  return (
    <div>
      <Link href={"/signup"}>
        <Button className="m-5">Sign up</Button>
      </Link>
    </div>
  );
};

export default page;
