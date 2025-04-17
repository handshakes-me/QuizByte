"use client";

import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { FaQuestion, FaRegEdit, FaRegUser } from "react-icons/fa";
import { Button } from "../ui/button";
import InputField from "../common/InputField";
import axios from "axios";
import { Subject } from "@/types";
import dayjs, { Dayjs } from "dayjs";
import { RiNumbersLine } from "react-icons/ri";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiUserCheck } from "react-icons/fi";

const formSchema = z.object({
  title: z.string().min(1, "Test series name is required"), // ✅
  description: z.string().min(1, "Test series description is required"), // ✅
  subjectId: z.string().min(1, "Subject is required"), // ✅
  examGroupId: z.string().min(1, "Exam group is required"), // ✅
  startTime: z.string().min(1, "Start time is required"), // ✅
  endTime: z.string().min(1, "End time is required"), // ✅
  duration: z.number().optional(), // calculate // ✅
  totalMarks: z.coerce.number().min(1, "Total marks is required"), // ✅
  numberOfQuestions: z.coerce
    .number()
    .min(1, "Number of questions is required"), // ✅
  marksPerQuestion: z.coerce.number().min(1, "Marks per question is required"), // ✅
  passingMarks: z.coerce.number().min(1, "Passing marks is required"), // ✅
  attemptCount: z.coerce.number().min(1, "Attempt count is required"), // ✅
  hints: z.coerce.number().optional().default(0), // ✅
});

type formDataType = z.infer<typeof formSchema>;

const CreateTest = ({
  subjects,
  examGroupId,
}: {
  subjects: Subject[];
  examGroupId: string;
}) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examGroupId: examGroupId,
    },
  });

  const { mutate: createExam, isPending } = useMutation({
    mutationFn: async (formData: formDataType) => {
      const response = await axios.post(`/api/exam`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Test created successfully",
          description: "test created",
        });
        queryClient.invalidateQueries({ queryKey: ["examGroup"] });
      }
      reset();
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

  const submitHandler = async (data: formDataType) => {
    const start = dayjs(data.startTime);
    const end = dayjs(data.endTime);

    if (!start.isValid() || !end.isValid()) {
      toast({
        title: "Invalid Date",
        description: "Please select valid start and end times.",
        variant: "destructive",
      });
      return;
    }

    if (end.isBefore(start)) {
      setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
      return;
    }

    // Calculate duration in minutes
    const durationMinutes = end.diff(start, "minute");

    if (durationMinutes < 0) {
      toast({
        title: "Invalid Duration",
        description: "Please select valid start and end times.",
        variant: "destructive",
      });
      return;
    }

    if (durationMinutes < 30) {
      toast({
        title: "Invalid Duration",
        description: "Duration must be greater than 30 minutes",
        variant: "destructive",
      });
      return;
    }

    if (durationMinutes > 180) {
      toast({
        title: "Invalid Duration",
        description: "Duration must be less than 180 minutes",
        variant: "destructive",
      });
      return;
    }

    // Set it to the form data
    data.duration = durationMinutes;

    // console.log("Final Form Data: ", data);
    createExam(data);
  };

  useEffect(() => {
    if (currentSubject) {
      const selectedSubject = subjects.filter(
        (subject: Subject) => subject._id === currentSubject
      );

      setValue("title", selectedSubject[0]?.name);
      setValue("description", selectedSubject[0]?.description);
      setValue("subjectId", selectedSubject[0]?._id);
      clearErrors("subjectId");
    }
  }, [currentSubject]);

  const watchedTotalMarks = watch("totalMarks");
  const watchedNumberOfQuestions = watch("numberOfQuestions");

  useEffect(() => {
    if (watchedTotalMarks && watchedNumberOfQuestions) {
      const calculated = Math.ceil(
        Number(watchedTotalMarks) / Number(watchedNumberOfQuestions)
      );
      setValue("marksPerQuestion", calculated);
      clearErrors("marksPerQuestion");
    } else {
      setValue("marksPerQuestion", 0);
    }
  }, [watchedTotalMarks, watchedNumberOfQuestions]);

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>Create Test</Button>
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-main-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Create test
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <div className="mt-2">
              <div>
                <Label className="text-main-600 capitalize" htmlFor="subject">
                  Select Subject
                </Label>
                {subjects.length === 0 ? (
                  <div className="w-full border border-main-600 bg-main-100 cursor-not-allowed py-2 text-main-700 rounded-md mt-1">
                    <p className="text-center">No subjects found</p>
                  </div>
                ) : (
                  <Select
                    name="subject"
                    onValueChange={(val) => setCurrentSubject(val)}
                  >
                    <SelectTrigger className="w-full h-10 border mt-1 placeholder:text-main-700 text-main-900 border-main-600">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjects.map((subject: Subject) => (
                          <SelectItem key={subject?._id} value={subject?._id}>
                            {subject?.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                {errors.subjectId && (
                  <span className="text-red-500 text-xs">
                    select a subject to continue
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="flex gap-x-4 w-full">
                  {/* total marks */}
                  <div className="mt-2 w-full">
                    <Label
                      htmlFor="totalMarks"
                      className="text-main-600 capitalize"
                    >
                      Total marks
                    </Label>
                    <InputField
                      type="number"
                      placeholder="Total marks"
                      name="totalMarks"
                      className="mt-1"
                      register={register}
                      icon={<RiNumbersLine />}
                    />
                    {errors.totalMarks && (
                      <span className="text-red-500 text-xs">
                        {errors.totalMarks.message}
                      </span>
                    )}
                  </div>

                  {/* no. of questiosn */}
                  <div className="mt-2 w-full">
                    <Label
                      htmlFor="numberOfQuestions"
                      className="text-main-600 capitalize"
                    >
                      Number of Questions
                    </Label>
                    <InputField
                      type="number"
                      className="mt-1"
                      placeholder="Number of questions"
                      name="numberOfQuestions"
                      register={register}
                      icon={<FaQuestion />}
                    />
                    {errors.numberOfQuestions && (
                      <span className="text-red-500 text-xs">
                        {errors.numberOfQuestions.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-4 w-full">
                  {/* marks per question */}
                  <div className="mt-2 w-full">
                    <Label
                      htmlFor="marksPerQuestion"
                      className="text-main-600 capitalize"
                    >
                      Marks per question
                    </Label>
                    <InputField
                      type="number"
                      disabled={true}
                      className="mt-1"
                      register={register}
                      placeholder="Marks per question"
                      name="marksPerQuestion"
                      icon={<FaQuestion className="text-gray-400" />}
                    />
                    {errors.marksPerQuestion && (
                      <span className="text-red-500 text-xs">
                        {errors.marksPerQuestion.message}
                      </span>
                    )}
                  </div>

                  {/* hints */}
                  <div className="mt-2 w-full">
                    <Label htmlFor="hints" className="text-main-600 capitalize">
                      hints Allowed
                    </Label>
                    <InputField
                      type="number"
                      className="mt-1"
                      placeholder="0"
                      min={0}
                      name="hints"
                      register={register}
                      icon={<HiOutlineLightBulb />}
                    />
                    {errors.hints && (
                      <span className="text-red-500 text-xs">
                        {errors.hints.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-4 w-full">
                  {/* passing Marks */}
                  <div className="mt-2 w-full">
                    <Label
                      htmlFor="passingMarks"
                      className="text-main-600 capitalize"
                    >
                      Passing marks
                    </Label>
                    <InputField
                      type="number"
                      className="mt-1"
                      placeholder="Passing marks"
                      name="passingMarks"
                      register={register}
                      icon={<RiNumbersLine />}
                    />
                    {errors.passingMarks && (
                      <span className="text-red-500 text-xs">
                        {errors.passingMarks.message}
                      </span>
                    )}
                  </div>

                  {/* attempt Count*/}
                  <div className="mt-2 w-full">
                    <Label
                      htmlFor="attemptCount"
                      className="text-main-600 capitalize"
                    >
                      Attempts Allowed
                    </Label>
                    <InputField
                      type="number"
                      className="mt-1"
                      placeholder="Attempts allowed"
                      name="attemptCount"
                      register={register}
                      icon={<FiUserCheck />}
                    />
                    {errors.attemptCount && (
                      <span className="text-red-500 text-xs">
                        {errors.attemptCount.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-4 w-full">
                  {/* start tiem */}
                  <div className="mt-3 flex flex-col w-full">
                    <Label
                      htmlFor="startTime"
                      className="text-main-600 capitalize"
                    >
                      Start time
                    </Label>
                    <DesktopDateTimePicker
                      className="w-full"
                      name="startTime"
                      minDateTime={dayjs()}
                      onChange={(date) => {
                        if (date) {
                          setValue("startTime", date.toISOString());
                          clearErrors("startTime");
                        }
                      }}
                    />
                    {errors.startTime && (
                      <span className="text-red-500 text-xs">
                        {errors.startTime.message}
                      </span>
                    )}
                  </div>

                  {/* end tiem */}
                  <div className="mt-3 flex flex-col w-full">
                    <Label
                      htmlFor="endTime"
                      className="text-main-600 capitalize"
                    >
                      end time
                    </Label>
                    <DesktopDateTimePicker
                      className="w-full"
                      name="endTime"
                      minDateTime={dayjs()}
                      onChange={(date) => {
                        if (date) {
                          setValue("endTime", date.toISOString());
                          clearErrors("endTime");
                        }
                      }}
                    />
                    {errors.endTime && (
                      <span className="text-red-500 text-xs">
                        {errors.endTime.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* submit */}
                <span className="flex gap-x-4 justify-end mt-6">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </span>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTest;
