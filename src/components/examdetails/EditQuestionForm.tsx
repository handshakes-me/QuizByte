import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Label } from "@radix-ui/react-label";
import InputField from "../common/InputField";
import { FaRegUser } from "react-icons/fa";
import TextAreaField from "../common/TextAreaField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useParams } from "next/navigation";
import { Question } from "@/types";

const formSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  hint: z.string().optional(),
  examId: z.string().optional(),
});

type formDataType = z.infer<typeof formSchema>;

const EditQuestionForm = ({ question }: { question: Question }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>(question?.options);
  const [currentOption, setCurrentOption] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: question?.questionText,
      options: question?.options,
      correctAnswer: question?.correctAnswer,
      hint: question?.hint,
    },
  });

  const { mutate: editQuestion, isPending } = useMutation({
    mutationFn: async (data: formDataType) => {
      const response = await axios.patch(
        `/api/question/${question?._id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["examData"] });
        toast({
          title: "Question created successfully",
          description: data.message,
        });
      }
      reset();
      setOptions([]);
      setFormOpen(false);
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

  const handleAddOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (options.length >= 4) {
        toast({
          title: "Maximum 4 options allowed",
          description: "Maximum 4 options allowed",
          variant: "destructive",
        });
        return;
      }

      const trimmedOption = currentOption.trim();
      if (trimmedOption === "") return;

      if (!options.includes(trimmedOption)) {
        setOptions((prev) => [...prev, trimmedOption]);
        setCurrentOption("");
      } else {
        toast({
          title: "Option already exists",
          description: "Option already exists",
          variant: "destructive",
        });
      }
    }

    if (e.key === "Backspace" && currentOption === "" && options.length > 0) {
      setOptions((prev) => prev.slice(0, -1));
    }
  };

  const submitHandler = async (data: formDataType) => {
    // createTestSeries(data);
    console.log("data : ", data);

    // this condition will never hit but I just want to make the code bulletproof
    if (data?.options.length !== 4) {
      setError("options", {
        type: "manual",
        message: "Please add 4 options",
      });
      return;
    }

    if(!data?.options.includes(data.correctAnswer)) {
      setError("correctAnswer", {
        type: "manual",
        message: "Correct answer must be one of the options",
      });
      return;
    }

    editQuestion(data);
  };

  useEffect(() => {
    setValue("options", options);
    clearErrors("options");
  }, [options])

  return (
    <>
      <button onClick={() => setFormOpen(true)}>
        <span className="text-sky-400 font-bold">Edit</span>
      </button>
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-main-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            {/* form header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Add a new Question
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)}>
              {/* question */}
              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Question
                </Label>
                <TextAreaField
                  name="questionText"
                  type="text"
                  rows={4}
                  resize={false}
                  icon={<FaRegUser className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Write your question here"
                  register={register}
                />
                {errors.questionText && (
                  <span className="text-red-500 text-xs">
                    {errors.questionText.message}
                  </span>
                )}
              </div>

              {/* options */}
              <div className="mt-3">
                <Label htmlFor="options" className="text-main-600 capitalize">
                  Options
                </Label>
                <InputField
                  name="options"
                  type="text"
                  value={currentOption}
                  icon={<FaRegUser className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Press 'Enter' to add"
                  onKeyDown={handleAddOption}
                  onChange={(e) => setCurrentOption(e.target.value)}
                />
                {errors.options && (
                  <span className="text-red-500 text-xs">
                    {errors.options.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-y-1 my-2">
                {options.map((option, index) => (
                  <span
                    key={option + index}
                    className="bg-white flex justify-between items-center gap-x-2 rounded-md px-3 py-1  border border-main-300"
                  >
                    {option}
                    <button
                      onClick={() =>
                        setOptions((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-sky-400 font-bold"
                    >
                      <IoMdClose />
                    </button>
                  </span>
                ))}
              </div>

              <div>
                <Label
                  htmlFor="correctAnswer"
                  className="text-main-600 capitalize"
                >
                  Answer
                </Label>
                <Select
                  name="correctAnswer"
                  defaultValue={question.correctAnswer}
                  onValueChange={(val) => {
                    setValue("correctAnswer", val);
                    clearErrors("correctAnswer");
                  }}
                >
                  <SelectTrigger className="w-full mt-1 border border-main-900">
                    <SelectValue placeholder="Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {options.length > 0 ? (
                        options.map((option, index) => (
                          <SelectItem key={option + index} value={option}>
                            {option}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectLabel>No options available</SelectLabel>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.correctAnswer && (
                  <span className="text-red-500 text-xs">
                    {errors.correctAnswer.message}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Hint
                </Label>
                <TextAreaField
                  name="hint"
                  type="text"
                  rows={2}
                  resize={false}
                  register={register}
                  icon={<FaRegUser className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Hint about the answer"
                />
                {errors.hint && (
                  <span className="text-red-500 text-xs">
                    {errors.hint.message}
                  </span>
                )}
              </div>

              <span className="flex gap-x-4 justify-end mt-6">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </span>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditQuestionForm;
