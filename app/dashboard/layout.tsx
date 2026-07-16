"use client";

import { useState } from "react";
import WorkerSidebar from "@/components/WorkerSidebar"; 
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Worker Sidebar */}
      <WorkerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />


      <div
        className={cn(
          "flex-1 min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          "pl-0", 
          isOpen ? "md:pl-64" : "md:pl-16" 
        )}
      >
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}