"use client";

import React from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'        

const LocalizationProviderr = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
    </LocalizationProvider>
  );
};

export default LocalizationProviderr;
