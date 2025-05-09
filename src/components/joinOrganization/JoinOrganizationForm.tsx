"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import InputField from "../common/InputField";
import { PiStudent } from "react-icons/pi";

const joinOrganization = async (data: formDataType) => {
  const response = await axios.post(
    `/api/organization/${data.organizationId}/student`,
    data,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const formSchema = z.object({
  prn: z.string().min(4, "prn must be at least 4 charecters"),
  organizationId: z
    .string()
    .min(1, "organizationId must be at least 1 charecters"),
  token: z.string().min(1, "token must be at least 1 charecters"),
});

type formDataType = z.infer<typeof formSchema>;

const JoinOrganizationForm = ({
  organizationId,
  token,
}: {
  organizationId: string;
  token: string;
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending: joinOrganizationPending } = useMutation({
    mutationKey: ["joinOrganization"],
    mutationFn: joinOrganization,
    onSuccess: (data) => {
      console.log("data: ", data);
      toast({
        title: "Joined Institution Successfully",
        description: "You have joined the institution successfully",
      });
      router.push("/dashboard/joined-institutions");
    },
    onError: (error) => {
      console.log("error: ", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prn: "",
      organizationId: organizationId,
      token: token,
    },
  });

  const handleJoinInstitution = async (data: formDataType) => {
    // console.log("data : ", data);
    mutate(data);
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>Join Institution</Button>
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg min-w-[400px] shadow-lg">
            <h2 className="text-2xl font-medium mb-4">Join Institution</h2>

            <form
              className="flex flex-col gap-y-4"
              onSubmit={handleSubmit(handleJoinInstitution)}
            >
              <div className="space-y-1">
                <Label htmlFor="prn">PRN</Label>
                <InputField
                  type="text"
                  name="prn"
                  placeholder="Enter PRN"
                  id="prn"
                  register={register}
                  icon={<PiStudent />}
                />
                {errors.prn && (
                  <span className="text-red-500 text-xs">
                    {errors.prn.message as string}
                  </span>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  className="mr-2"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={joinOrganizationPending}>
                  {joinOrganizationPending ? "Joining..." : "Join"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinOrganizationForm;
