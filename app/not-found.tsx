"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
          <FileQuestion className="h-12 w-12 text-gray-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            404
          </span>
        </div>

        {/* Heading text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xs mx-auto">
            Sorry, we couldn&apos;t find the page you are looking for. It might have been moved or deleted.
          </p>
        </div>

    
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto rounded-xl py-5 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <MoveLeft className="h-4 w-4" /> Go Back
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto rounded-xl py-5 bg-green-600 hover:bg-green-700 text-white active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}