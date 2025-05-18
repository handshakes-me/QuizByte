"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import QuestionDisplay from "@/components/attempt/QuestionDisplay";
import QuestionList from "@/components/attempt/QuestionList";
import { useDispatch, useSelector } from "react-redux";
import {
  resetExamAttempt,
  setCurrentQuestionIndex,
  setExamData,
} from "@/slices/examSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/common/Loader";
import { RootState } from "@/app/store";

const fetchExamData = async (examId: string) => {
  const response = await axios.get(`/api/exam/${examId}/attempt`);
  return response.data;
};

const submitExamfn = async (examId: string, data: any) => {
  const response = await axios.post(`/api/exam/${examId}/attempt`, data, {
    withCredentials: true,
  });
  return response.data;
};

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { toast } = useToast();
  const { hintsUsed, attemptedQuestions, examAttemptId } = useSelector(
    (state: RootState) => state.examAttempt
  );
  const router = useRouter();
  const examId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const { mutate: submitExam, isPending: submitPending } = useMutation({
    mutationFn: ({
      examId,
      autoSubmit,
    }: {
      examId: string;
      autoSubmit: boolean;
    }) =>
      submitExamfn(examId, {
        attemptId: examAttemptId,
        answers: attemptedQuestions,
        autoSubmitted: autoSubmit,
        hintsUsed,
      }),
    onSuccess: () => {
      dispatch(resetExamAttempt());
      dispatch(setCurrentQuestionIndex(0));
      toast({
        title: "Test automatically submitted",
        description: "Test submitted successfully",
      });
      router.push("/dashboard/ongoing-tests");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        console.log("Error : ", error);
        toast({
          title: error?.response?.data?.message,
          variant: "destructive",
        });
      }
    },
  });
  const { data, isPending, isError, error } = useQuery({
    queryFn: () => fetchExamData(examId),
    queryKey: ["exam", examId],
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setExamData(data?.data));
    } else if (error) {
      console.log("error : ", error);
      if (isAxiosError(error) && error?.response?.status === 402) {
        toast({
          title: "Error",
          description: "You have completed all attempts.",
          variant: "destructive",
        });
        router.push("/dashboard/ongoing-tests");
      } else {
        toast({
          title: "Something went wrong",
          description: error?.message || "Failed to load exam data",
          variant: "destructive",
        });
        router.push("/dashboard/ongoing-tests");
      }
    }
  }, [data, isError]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex justify-between">
      <QuestionDisplay />
      <QuestionList />
    </div>
  );
};

export default Page;
