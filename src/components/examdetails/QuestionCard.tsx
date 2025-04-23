import { Question } from "@/types";
import React, { useState } from "react";
import EditQuestionForm from "./EditQuestionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const QuestionCard = ({ question }: { question: Question }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteQuestion, isPending } = useMutation({
    mutationFn: async (questionId: string) => {
      const response = await axios.delete(`/api/question/${questionId}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["examData"] });
        toast({
          title: "Question deleted successfully",
          description: data.message,
        });
        setDeleteModalOpen(false);
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionHandler = () => {
    deleteQuestion(question._id);
  }

  return (
    <div className="border shadow-sm shadow-main-800 border-main-300 bg-white rounded-md p-4">
      <div className="flex justify-between items-start gap-x-4">
        <h3 className="font-semibold text-lg mb-2">
          Question: {question?.questionText}
        </h3>
        <div className="flex items-center gap-x-4 mt-1">
          <EditQuestionForm question={question} />
          <button onClick={() => setDeleteModalOpen(true)}>
            <span className="text-red-400 font-bold">Delete</span>
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-y-2 my-2">
        {question?.options?.map((option, index) => (
          <li
            className={`border w-full border-main-200 py-1 px-4 rounded-md ${option === question.correctAnswer ? "bg-green-200/40" : "bg-red-200/40"}`}
            key={index}
          >
            {option}
          </li>
        ))}
      </ul>
      <p className="pt-2">Hint: {question?.hint}</p>
      {deleteModalOpen && (
        <div
          onClick={() => setDeleteModalOpen(false)}
          className="inset-0 fixed bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-md shadow-sm shadow-main-950 bg-white flex flex-col gap-y-3 items-center p-8 text-main-900"
          >
            <h4 className="font-semibold text-2xl">Delete this Question</h4>
            <p className="text-center text-sm font-light">
              Are you sure you want to delete this question?
            </p>
            <span className="space-x-4">
              <Button
                onClick={() => setDeleteModalOpen(false)}
                variant="secondary"
              >
                cancel
              </Button>
              <Button disabled={isPending} onClick={deleteQuestionHandler} variant="default">
                delete
              </Button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
