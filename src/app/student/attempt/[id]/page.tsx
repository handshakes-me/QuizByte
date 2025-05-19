"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const [examStarted, setExamStarted] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const warningShownRef = useRef(false);

  const { hintsUsed, attemptedQuestions, examAttemptId } = useSelector(
    (state: RootState) => state.examAttempt
  );

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

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      toast({
        title: "Test submitted",
        description: "Test submitted successfully",
      });

      router.push("/dashboard/ongoing-tests");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
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
      if (isAxiosError(error) && error?.response?.status === 402) {
        toast({
          title: "Error",
          description: "You have completed all attempts.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: error?.message || "Failed to load exam data",
          variant: "destructive",
        });
      }
      router.push("/dashboard/ongoing-tests");
    }
  }, [data, isError]);

  // 👮 Cheating Detection
  useEffect(() => {
    if (!examStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ["F11", "Tab", "Escape"];

      // Block Ctrl + (Shift)? + (I|J|U|C)
      if (
        (e.ctrlKey && ["i", "j", "u", "c"].includes(e.key.toLowerCase())) ||
        forbiddenKeys.includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventMouseBackForward = (e: MouseEvent) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
      }
    };

    const blockBackNavigation = () => {
      history.pushState(null, "", location.href);
    };

    const preventPopState = (e: PopStateEvent) => {
      blockBackNavigation();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", disableContextMenu);
    window.addEventListener("mousedown", preventMouseBackForward);
    window.addEventListener("popstate", preventPopState);

    blockBackNavigation();

    const handleBlur = () => setViolationCount((prev) => prev + 1);
    const handleVisibilityChange = () => {
      if (document.hidden) setViolationCount((prev) => prev + 1);
    };

    const devtoolsChecker = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        setViolationCount((prev) => prev + 1);
      }
    }, 2000);

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(devtoolsChecker);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", disableContextMenu);
      window.removeEventListener("mousedown", preventMouseBackForward);
      window.removeEventListener("popstate", preventPopState);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examStarted]);

  useEffect(() => {
    if (violationCount === 1 && !warningShownRef.current) {
      warningShownRef.current = true;
      toast({
        title: "Warning",
        description:
          "Tab change or dev tools is not allowed. Next violation will auto-submit your test.",
        variant: "destructive",
      });
    }

    if (violationCount >= 2) {
      submitExam({ examId, autoSubmit: true });
    }
  }, [violationCount]);

  const startExam = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen failed",
          description: err.message,
          variant: "destructive",
        });
      });
    }
    setExamStarted(true);
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  if (!examStarted) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Button onClick={startExam}>Start Exam</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <QuestionDisplay />
      <QuestionList />
    </div>
  );
};

export default Page;
