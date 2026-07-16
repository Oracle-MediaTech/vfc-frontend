"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // This matches your components/Sidebar folder
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Dynamic Page Content Wrapper */}
      <div
        className={cn(
          "flex-1 min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          "pl-0", // No padding on mobile
          isOpen ? "md:pl-64" : "md:pl-16" // Adjusts padding on desktop when sidebar collapses
        )}
      >
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}