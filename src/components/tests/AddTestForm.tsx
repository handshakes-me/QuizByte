"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddTestForm = () => {
  const [formOpen, setFormOpen] = useState(true);

  const { testSeries } = useSelector((state: RootState) => state.testSeries);
  console.log("testSeries : ", testSeries);

  const handleOpen = () => {
    setFormOpen((prev) => !prev);
  };

  return (
    <>
      <Button variant="default" onClick={handleOpen}>
        Create Test
      </Button>
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
                Add a new test test
              </h2>
              <button className="text-xl" onClick={() => setFormOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <div>
              <span>
                <label className="mt-1" htmlFor="testSeies">
                  Select a test series
                </label>
                <Select>
                  <SelectTrigger className="w-full border border-main-600">
                    <SelectValue placeholder="Select a test series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {testSeries.map((ts) => (
                        <SelectItem key={ts?._id} value={ts._id}>
                          {ts.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>
              <span>
                <label className="mt-1" htmlFor="testSeies">
                    Select a subject
                </label>
                <Select>
                  <SelectTrigger  className="w-full border border-main-600">
                    <SelectValue placeholder="Select a test series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {testSeries.map((ts) => (
                        <SelectItem key={ts?._id} value={ts._id}>
                          {ts.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTestForm;
