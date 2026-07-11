import type { Metadata } from "next";
import "../globals.css";
// import "./globals.css";
import ReduxProvider from "@/src/providers/ReduxProvider";
import Sidebar from "@/src/components/Sidebar";
import Protected from "@/src/components/Protected";
import GetUserComponent from "@/src/components/GetUserComponent";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">

    <Protected>
      <GetUserComponent />
      <Toaster position="top-right" reverseOrder={false}/>
        <div className="w-full flex flex-row h-dvh overflow-hidden ">
          <div className="h-full ">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto p-4 h-screen ">
            <TooltipProvider>
            {children}
            </TooltipProvider>
          </main>
        </div>
    </Protected>

    // </html>
  );
}
