"use client";
import { Subject } from "@/types";
import React, { useEffect, useState } from "react";
import AddSubject from "./AddSubject";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdBook, IoMdClose } from "react-icons/io";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { PiQrCode } from "react-icons/pi";
import TextAreaField from "../common/TextAreaField";
import { MdOutlineDescription } from "react-icons/md";
import { Button } from "../ui/button";

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
});

type FormDataType = z.infer<typeof formSchema>;

const SubjectCard = ({ data: subject }: { data: Subject }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for editing/updating a subject
  const { mutate: editSubject, isPending } = useMutation({
    mutationFn: async (formData: FormDataType) => {
      const response = await axios.patch(
        `/api/subject/${subject?._id}`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Subject updated successfully",
          description: "Subject updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["examGroup"] });
      }
      reset();
      setFormOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        title: "Something went wrong",
        description:
          error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a subject
  const { mutate: deleteSubject, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/subject/${subject?._id}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Subject deleted successfully",
          description: "Subject deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["examGroup"] });
      }
      setModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        title: "Something went wrong",
        description:
          error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = (data: FormDataType) => {
    editSubject(data);
  };

  const handleDeleteClick = () => {
    setFormOpen(false);
    setModalOpen(true);
  };

  const deleteSubjectHandler = () => {
    deleteSubject();
  };

  // Pre-fill the form fields when the modal opens
  useEffect(() => {
    setValue("name", subject?.name);
    setValue("description", subject?.description);
    setValue("code", subject?.code);
  }, [formOpen, setValue, subject]);

  return (
    <div>
      {/* Card Button */}
      <button
        className="py-2 px-4 flex flex-col items-center gap-y-1 text-sm text-center shadow-md rounded-2xl font-semibold bg-white transition-transform hover:scale-105 hover:shadow-lg"
        onClick={() => setFormOpen(true)}
      >
        {subject?.name}
        <span className="text-xs font-light text-gray-600">{subject?.code}</span>
      </button>

      {/* Edit Modal */}
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative p-8 bg-gradient-to-br from-white to-gray-50 text-main-900 rounded-2xl w-[580px] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Subject</h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>
            <form onSubmit={handleSubmit(submitHandler)} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Subject Name
                </Label>
                <InputField
                  name="name"
                  type="text"
                  icon={<IoMdBook className="text-sky-400" />}
                  placeholder="Subject name"
                  register={register}
                  className="mt-1"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Subject Code
                </Label>
                <InputField
                  name="code"
                  type="text"
                  icon={<PiQrCode className="text-sky-400" />}
                  placeholder="Subject code"
                  register={register}
                  className="mt-1"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Subject Description
                </Label>
                <TextAreaField
                  name="description"
                  type="text"
                  resize={false}
                  icon={<MdOutlineDescription className="text-sky-400" />}
                  placeholder="Subject description"
                  register={register}
                  className="mt-1"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="flex gap-x-4 justify-end mt-6">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>

            <Button
              onClick={handleDeleteClick}
              variant="destructive"
              className="w-full mt-4"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-2xl shadow-xl bg-white flex flex-col gap-y-4 items-center p-8 text-main-900"
          >
            <h4 className="text-2xl font-semibold">Are you sure?</h4>
            <p className="text-center text-sm font-light">
              This subject will be permanently deleted.
            </p>
            <div className="space-x-4">
              <Button onClick={() => setModalOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={deleteSubjectHandler} variant="default">
                {isDeletePending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
