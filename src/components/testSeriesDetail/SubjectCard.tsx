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
          title: "Subject added successfully",
          description: "Subject added successfully",
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
      console.log(error);
      toast({
        title: "Something went wrong",
        description: error?.response?.data?.error || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = (data: FormDataType) => {
    console.log(data);
    editSubject(data);
  };

  const handleDeleteClick = () => {
    setFormOpen(false);
    setModalOpen(true);
  };

  const deleteSubjectHandler = () => {
    deleteSubject();
  }

  useEffect(() => {
    setValue("name", subject?.name);
    setValue("description", subject?.description);
    setValue("code", subject?.code);
  }, [formOpen]);

  return (
    <div>
      <button
        className={`py-2 px-6 flex flex-col gap-x-1 items-center text-sm text-center shadow-sm shadow-main-950 rounded-md font-semibold bg-white`}
        onClick={() => setFormOpen(true)}
      >
        {subject?.name}
        <span className=" text-xs font-normal text-center">
          {subject?.code}
        </span>
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-900">
                Edit subject
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject name
                </Label>
                <InputField
                  name="name"
                  type="text"
                  icon={<IoMdBook className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject name"
                  register={register}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs" >{errors.name.message}</span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject code
                </Label>
                <InputField
                  name="code"
                  type="text"
                  icon={<PiQrCode className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject code"
                  register={register}
                />
                {errors.code && (
                  <span className="text-red-500 text-xs" >{errors.code.message}</span>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor="name" className="text-main-600 capitalize">
                  Subject Description
                </Label>
                <TextAreaField
                  name="description"
                  type="text"
                  resize={false}
                  icon={<MdOutlineDescription className="text-sky-400" />}
                  className="mt-1"
                  placeholder="Subject description"
                  register={register}
                  rows={4}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs" >
                    {errors.description.message}
                  </span>
                )}
              </div>

              <span className="flex gap-x-4 justify-end mt-6">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </span>
            </form>

            <Button
              onClick={handleDeleteClick}
              variant="destructive"
              className="w-full mt-4"
            >
              delete
            </Button>
          </div>
        </div>
      )}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="inset-0 fixed bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-md shadow-sm shadow-main-950 bg-white flex flex-col gap-y-3 items-center p-8 text-main-900"
          >
            <h4 className="font-semibold text-2xl">Are you sure?</h4>
            <p className="text-center text-sm font-light">
              This subject will be deleted permanently
            </p>
            <span className="space-x-4">
              <Button onClick={() => setModalOpen(false)} variant="secondary">
                cancel
              </Button>
              <Button onClick={deleteSubjectHandler} variant="default">
                {!isDeletePending? "delete" : "deleting..."}
              </Button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
