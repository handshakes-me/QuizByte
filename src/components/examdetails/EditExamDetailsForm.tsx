"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { FaQuestion, FaRegEdit, FaRegUser } from "react-icons/fa";
import { IoIosPhonePortrait, IoMdClose } from "react-icons/io";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Exam } from "@/types";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { RiNumbersLine } from "react-icons/ri";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiUserCheck } from "react-icons/fi";
import dayjs from "dayjs";

const FormSchema = z.object({
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

type formDataType = z.infer<typeof FormSchema>;

const EditExamDetailsForm = ({ examData }: { examData: Exam }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

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
    resolver: zodResolver(FormSchema),
  });

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

  useEffect(() => {
    if (examData) {
      setValue("totalMarks", examData.totalMarks);
      setValue("numberOfQuestions", examData.numberOfQuestions);
      setValue("passingMarks", examData.passingMarks);
      setValue("attemptCount", examData.attemptCount);
      setValue("hints", examData.hints);
      setValue("startTime", examData.startTime);
      setValue("endTime", examData.endTime);
    }
  }, [examData]);

  const { mutate: editExam, isPending } = useMutation({
    mutationFn: async (data: formDataType) => {
      const response = await axios.patch(`/api/exam/${examData?._id}`, data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "exam edited successfully",
        description: "Exam edited successfully",
      });
      reset();
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["examData"] });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      console.log(error);
    },
  });

  const submitHandler = (data: formDataType) => {
    editExam(data);
  };

  return (
    <div>
      <Button onClick={() => setFormOpen(true)}>
        <span className="flex items-center gap-x-3">
          <FaRegEdit /> Edit
        </span>
      </Button>
      {formOpen && (
        <section
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center rounded-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-6 bg-purple-50 text-main-900 rounded-md w-[580px] shadow-sm shadow-main-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Edit Exam details
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>
            {/* <form onSubmit={handleSubmit(submitHandler)}> */}

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
                    value={
                      watch("startTime") ? dayjs(watch("startTime")) : null
                    }
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
                  <Label htmlFor="endTime" className="text-main-600 capitalize">
                    end time
                  </Label>
                  <DesktopDateTimePicker
                    className="w-full"
                    name="endTime"
                    value={
                      watch("endTime") ? dayjs(watch("endTime")) : null
                    }
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
        </section>
      )}
    </div>
  );
};

export default EditExamDetailsForm;
