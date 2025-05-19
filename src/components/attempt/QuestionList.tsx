import { RootState } from "@/app/store";
import { setCurrentQuestionIndex, resetExamAttempt } from "@/slices/examSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import axios, { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

const submitExamfn = async (examId: string, data: any) => {
  const response = await axios.post(`/api/exam/${examId}/attempt`, data, {
    withCredentials: true,
  });
  return response.data;
};

const QuestionList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const {
    currentQuestionIndex,
    questions,
    title,
    hints,
    hintsUsed,
    duration,
    startedAt,
    attemptedQuestions,
    examAttemptId,
  } = useSelector((state: RootState) => state.examAttempt);

  const params = useParams();
  const examId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds

  const { mutate: submitExam, isPending } = useMutation({
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
        title: "Test submitted successfully",
        description: "You have successfully submitted your Test",
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

  useEffect(() => {
    if (startedAt && duration > 0) {
      const start = new Date(startedAt).getTime();
      const end = start + duration * 60 * 1000;

      const interval = setInterval(() => {
        const now = Date.now(); // more reliable
        const remaining = Math.floor((end - now) / 1000);

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          // Handle auto-submit
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startedAt, duration, dispatch]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmitExam = () => {
    submitExam({ examId, autoSubmit: true });
  };

  return (
    <div className="w-[400px] bg-main-100 h-screen px-8 py-8 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{title}</h2>
        <div className="text- mt-4 text-gray-700 mb-4">
          <p className="mb-2">
            Time left{" "}
            <span className="font-medium text-lg">{formatTime(timeLeft)}</span>{" "}
          </p>
          <p>
            Hints left{" "}
            <span className="font-medium">
              {hintsUsed}/{hints}
            </span>
          </p>
        </div>

        <h3 className="text-xl font-medium mb-4">Questions</h3>
        <div className="flex flex-wrap gap-4">
          {questions?.map((_, index) => (
            <button
              onClick={() => dispatch(setCurrentQuestionIndex(index))}
              key={index}
              className={`w-12 aspect-square rounded-md border bg-white flex items-center justify-center font-medium text-lg ${
                currentQuestionIndex === index
                  ? "border-2 border-black"
                  : "border-main-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {currentQuestionIndex === questions.length - 1 && (
          <Button
            disabled={isPending}
            className="w-full"
            onClick={handleSubmitExam}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
