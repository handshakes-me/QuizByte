import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Question,
  setAnswer,
  setCurrentQuestionIndex,
  setHintUsed,
  setQuestionHint,
} from "@/slices/examSlice";
import axios, { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const fetchHintfn = async (examId: string, data: any) => {
  const response = await axios.post(
    "/api/exam/" + examId + "/attempt/hint",
    data
  );
  // console.log("gethint response : ", response.data);
  return response.data;
};

const QuestionDisplay = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const {
    questions,
    examId,
    currentQuestionIndex,
    attemptedQuestions,
    examAttemptId,
    hintsUsed,
  } = useSelector((state: RootState) => state.examAttempt);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const currentQuestion: Question = questions[currentQuestionIndex];

  // Restore previously selected answer from array
  useEffect(() => {
    const answerObj = attemptedQuestions.find(
      (ans) => ans.questionId === currentQuestion?._id
    );
    setSelectedAnswer(answerObj?.selectedAnswer || "");
  }, [currentQuestionIndex, attemptedQuestions, currentQuestion]);

  const { mutate, isPending } = useMutation({
    mutationFn: (examId: string) =>
      fetchHintfn(examId!, {
        examAttemptId,
        questionId: currentQuestion._id,
      }),
    onSuccess: (data) => {
      // console.log("data : ", data);
      if (data.success) {
        dispatch(
          setQuestionHint({
            _id: currentQuestion._id,
            hint: data?.data?.hint,
          })
        );
        dispatch(setHintUsed(hintsUsed + 1));
      }
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

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);

    dispatch(
      setAnswer({
        questionId: currentQuestion._id,
        selectedAnswer: option,
      })
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
    }
  };

  const fetchHint = () => {
    mutate(examId!);
  };

  return (
    <div className="px-12 py-8 border border-black w-full flex-1">
      <div className="mb-8">
        <div className="text-xl font-medium flex items-start gap-x-4">
          <h3>{currentQuestion?.questionText} </h3>
        </div>
        {currentQuestion?.hint && (
          <div className=" my-4">
            <h4 className="font-medium mb-1">Hint:</h4>
            <div className="py-2 px-4 font-medium rounded-md bg-green-200 border border-main-400 w-full">
              {currentQuestion.hint}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {currentQuestion?.options?.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`border w-full border-main-400 px-4 py-2 rounded-md text-start transition-all duration-200 ${
              option === selectedAnswer ? "bg-green-400/60" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="space-x-2">
          {currentQuestionIndex > 0 && (
            <Button onClick={handlePrev}>Prev</Button>
          )}
          {currentQuestionIndex < questions.length - 1 && (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>

        {currentQuestion?.hintExists && !currentQuestion?.hint && (
          <div>
            <Button disabled={isPending} onClick={fetchHint}>
              {isPending ? "Loading..." : "Get Hint"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
