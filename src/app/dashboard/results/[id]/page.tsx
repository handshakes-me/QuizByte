"use client";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { MdArrowBack } from "react-icons/md";

const fetchExamGroup = async (id: string) => {
  const response = await axios.get("/api/examGroup/" + id);
  return response.data;
};

const Page = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isPending } = useQuery({
    queryFn: () => fetchExamGroup(params.id),
    queryKey: ["examGroup", params.id],
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const completedExams = data?.data?.exams?.filter(
    (exam: any) => new Date(exam.endTime) < new Date()
  );

  return (
    <main>
      <div className="w-full bg-purple-50 text-main-900 rounded-md">
        {/* back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center mb-4 text-xs font-semibold gap-x-1 hover:gap-x-2 transition-all duration-100 hover:text-sky-400"
        >
          <MdArrowBack /> Back
        </button>
      </div>

      <div>
        <h3 className="text-xl font-medium">{data?.data?.name}</h3>

        <div className="mt-4">
          {completedExams?.length === 0 ? (
            <div className="w-full h-screen flex justify-center items-center">
              <h3 className="text-2xl font-medium">No completed exams found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedExams?.map((exam: any) => (
                <div
                  className="p-4 bg-white shadow-sm shadow-main-400 rounded-md hover:shadow-md transition-all duration-200"
                  key={exam._id}
                >
                  <h3 className="text-lg font-medium">{exam.title}</h3>
                  <p className="text-sm text-gray-500">{exam.description}</p>
                  <div className="mt-4">
                    <Button
                      className="h-8"
                      onClick={() =>
                        router.push(
                          `/dashboard/results/${params.id}/${exam._id}`
                        )
                      }
                    >
                      View Results
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
