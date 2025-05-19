"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Subject = {
  _id: string;
  name: string;
  code: string;
  description: string;
};

type ExamGroup = {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  exam: string[];
  status: string;
  subjects: Subject[];
};

const registerSchema = z.object({
  examGroupId: z.string().min(1, "Organization ID is required"),
  subjectIds: z.array(z.string()).min(1, "Select at least one subject"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForTestSeriesForm = ({ data }: { data: ExamGroup }) => {

  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      examGroupId: data._id,
      subjectIds: [],
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      const response = await axios.post("/api/student/examGroup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Registered successfully",
        description: "You have been registered for the test series.",
      });
      reset();
      setFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description:
          error?.response?.data?.error || "Something went wrong. Try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: RegisterFormData) => {
    // console.log("formData : , ", formData);
    registerMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>Register</Button>

      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[540px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Register for {data.name}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="hidden"
                {...register("examGroupId")}
                value={data._id}
              />

              {data.subjects.map((subject) => (
                <div key={subject._id} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={subject._id}
                    value={subject._id}
                    {...register("subjectIds")}
                    className="mr-2"
                  />
                  <label htmlFor={subject._id}>
                    {subject.name}{" "}
                    <span className="text-xs text-main-600">
                      ({subject?.code})
                    </span>
                  </label>
                </div>
              ))}

              {errors.subjectIds && (
                <p className="text-sm text-red-500 mb-2">
                  {errors.subjectIds.message}
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={registerMutation?.isPending}>
                  {registerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterForTestSeriesForm;
