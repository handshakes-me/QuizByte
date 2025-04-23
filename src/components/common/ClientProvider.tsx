import React from "react";
import QueryProvider from "./QueryProvider";
import UserHydrator from "./UserHydrator";
import LocalizationProviderr from "./LocalizationProvider";
import { ReduxProvider } from "@/app/ReduxProvider";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ReduxProvider>
        <LocalizationProviderr>
          <UserHydrator />
          {children}
        </LocalizationProviderr>
      </ReduxProvider>
    </QueryProvider>
  );
};

export default ClientProvider;
