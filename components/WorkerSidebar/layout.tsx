"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Or WorkerSidebar
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Share the sidebar state at the layout level
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* The Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* 2. Dynamic Main Content Container */}
      <div
        className={cn(
          "flex-1 min-h-screen flex flex-col",
          "transition-all duration-300 ease-in-out",
          
          // On mobile, there's no left spacing because the sidebar acts as an overlay
          "pl-0", 
          
          // On desktop, adjust the padding dynamically based on the sidebar state
          isOpen ? "md:pl-64" : "md:pl-16"
        )}
      >
        {/* Main page body */}
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}