import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/common/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "./ReduxProvider";
import UserHydrator from "@/components/common/UserHydrator";
import LocalizationProviderr from "@/components/common/LocalizationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuizByte",
  description: "QuizByte - A solution for your online examination needs",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} select-none ${geistMono.variable} antialiased`}
      >
        <LocalizationProviderr>
          <QueryProvider>
            <ReduxProvider>
              {/* hydrating local storage data into state memory */}
              <UserHydrator />
              {children}
            </ReduxProvider>
          </QueryProvider>
        </LocalizationProviderr>
        <Toaster />
      </body>
    </html>
  );
}
