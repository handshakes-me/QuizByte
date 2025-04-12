"use client";

import Badge from "@/components/common/Badge";
import Loader from "@/components/common/Loader";
import EditTestSeriesForm from "@/components/testSeriesDetail/EditTestSeriesForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { PiExam } from "react-icons/pi";
import { LiaBookSolid } from "react-icons/lia";
import SubjectsData from "@/components/testSeriesDetail/SubjectData";
import StudentData from "@/components/testSeriesDetail/StudentData";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useQuery({
    queryKey: ["examGroup", id],
    queryFn: async () => {
      const response = await axios.get(`/api/examGroup/${id}`);
      return response.data.data;
    },
  });

  //   console.log("data : ", data);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main>
      <div className="w-full bg-main-50 text-main-900 rounded-md">
        {/* back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center mb-4 text-xs font-semibold gap-x-1 hover:gap-x-2 transition-all duration-100 hover:text-sky-400"
        >
          <MdArrowBack /> Back
        </button>

        {/* page header */}
        <div className="mb-4 flex gap-x-4 justify-between items-center">
          <span className="">
            <h2 className="text-2xl font-semibold">{data?.name}</h2>
            <p className="mt-2 font-normal text-base text-main-500">
              {data?.description}
            </p>
            <div className="flex gap-x-2 mt-4">
              <Badge
                text={data?.students.length?.toString() || "0"}
                icon={<PiStudent />}
              />
              <Badge
                text={data?.exams.length?.toString() || "0"}
                icon={<PiExam />}
              />
              <Badge
                text={data?.subjects.length?.toString() || "0"}
                icon={<LiaBookSolid />}
              />
            </div>
          </span>
          <EditTestSeriesForm data={data} />
        </div>

        <SubjectsData data={data} />

        <StudentData data={data?.students} />
      </div>
    </main>
  );
};

export default Page;
