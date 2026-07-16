"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { attendanceService } from "@/services/attendanceService";
import { StartSessionDialog } from "./_components/SessionDialog";
import AttendanceSessionsTable from "./_components/AttendanceSessionTable";
import AnalyticsDashboard from "./_components/analytics/AnalyticsDashboard";
import { Plus } from "lucide-react"; // plus icon

export default function AttendancePage() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  const handleStartSession = async ({
    date,
    serviceName,
    services,
    serviceDayId,
    specialProgramId,
  }: {
    date: string;
    serviceName: string;
    services: Array<{
      order: number;
      serviceTime: string;
      preServiceTime?: string | null;
      closesAt?: string | null;
    }>;
    serviceDayId?: string | null;
    specialProgramId?: string | null;
  }) => {
    const startedAt = services[0]?.serviceTime ?? new Date(`${date}T00:00`).toISOString();

    const session = await attendanceService.startSession({
      serviceName,
      date: new Date(`${date}T00:00`).toISOString(),
      startedAt,
      services,
      serviceDayId: serviceDayId ?? null,
      specialProgramId: specialProgramId ?? null,
    });

    router.push(`attendance/session?sessionId=${session.id}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
     {/* header container */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Attendance Management
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Record and track church attendance
          </p>
        </div>

       
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
         
          <TabsList className="grid grid-cols-2 w-full md:w-[220px] bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="sessions" className="rounded-lg text-sm font-medium py-2">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-sm font-medium py-2">
              Analytics
            </TabsTrigger>
          </TabsList>

   
          {activeTab === "sessions" && (
            <Button
              onClick={() => setOpenDialog(true)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all text-white font-medium py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Start New Session</span>
            </Button>
          )}
        </div>
      </div>

    
      <TabsContent value="sessions" className="mt-0 outline-none">
        <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 shadow-sm">
          <AttendanceSessionsTable />
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="mt-0 outline-none">
        <AnalyticsDashboard />
      </TabsContent>

      <StartSessionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onStartSession={handleStartSession}
      />
    </Tabs>
  );
}