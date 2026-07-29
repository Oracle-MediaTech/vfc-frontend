"use client";
import { toast } from "sonner";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Calendar, Loader2, Download } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { userService } from "@/services/userService";
import { useCurrentUser } from "@/hooks/use-current-user";
import ExcoHome from "./_components/ExcoHome";
import AttendanceTrendBlock from "@/components/AttendanceTrendBlock";

import { IAttendanceSession } from "@/types/attendance";



interface CardData {
  loading: boolean;
  value: string;
  hint?: string;
}

const empty = (hint?: string): CardData => ({ loading: false, value: "—", hint });


export default function AdminDashboardRoute() {
  // Role gate — excos see the read-only dashboard, admins fall through.
  const { isExco, status, user } = useCurrentUser();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }
  if (isExco) return <ExcoHome firstName={user?.firstName} />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [members, setMembers] = useState<CardData>({ loading: true, value: "…" });
  const [attendees, setAttendees] = useState<CardData>({ loading: true, value: "…" });
    const { id: sessionId } = useParams<{ id: string }>();
  const [sessionsThisMonth, setSessionsThisMonth] = useState<CardData>({
    loading: true,
    value: "…",
  });
  const [exporting, setExporting] = useState(false);
  const [session, setSession] = useState<IAttendanceSession | null>(null);

  useEffect(() => {
    // Card 1 — total members
    userService
      .getFilteredUsers({ churchStatus: "MEMBER", page: 1, limit: 1 })
      .then((res) =>
        setMembers({
          loading: false,
          value: res.total.toLocaleString(),
          hint: "churchStatus = MEMBER",
        }),
      )
      .catch(() => setMembers(empty()));

    // Card 2 — unique attendees + avg per session
    attendanceService
      .getAttendanceSummary()
      .then((s) =>
        setAttendees({
          loading: false,
          value: s.uniqueAttendees.toLocaleString(),
          hint: `avg ${s.avgAttendancePerSession} per session`,
        }),
      )
      .catch(() => setAttendees(empty()));

    // Card 3 — sessions this month + chart data
    attendanceService
      .getAttendanceTrend({ groupBy: "month" })
      .then((rows) => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const thisMonth = rows.find((r) => {
          const d = new Date(r.period);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          return key === monthKey;
        });
        setSessionsThisMonth({
          loading: false,
          value: String(thisMonth?.count ?? 0),
        });
      })
      .catch(() => setSessionsThisMonth(empty()));
  }, []);

  useEffect(() => {
  const loadLatestSession = async () => {
    try {
      const res = await attendanceService.getAllSessions({
        page: 1,
        limit: 1,
      });

      console.log("Latest session response:", res);

      if (res.data.length > 0) {
        setSession(res.data[0]);
        console.log("Session state will be:", res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load latest session:", err);
    }
  };

  loadLatestSession();
}, []);
 
const handleExportPdf = useCallback(async () => {
  const effectiveId = sessionId || session?.id || (session as any)?._id;
  if (!session || !effectiveId) {
    toast.error("Session ID is missing");
    return;
  }

  setExporting(true);
  try {
    const name = session.serviceName || "Attendance_Report";
    await attendanceService.exportSessionPdf(effectiveId, name, {});
    toast.success("PDF exported successfully!");
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to export attendance PDF");
  } finally {
    setExporting(false);
  }
}, [sessionId, session]);

  const renderCard = (
    title: string,
    icon: React.ReactNode,
    data: CardData,
    delay: string,
  ) => (
    <Card className={`animate-fade-up ${delay}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {data.loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                data.value
              )}
            </div>
            {data.hint && (
              <p className="text-xs text-gray-500">{data.hint}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Responsive Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>

    {/* pdf button link */}
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          ) : (
            <Download className="h-4 w-4 text-gray-600" />
          )}
          <span>Export Attendacce PDF</span>
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderCard(
          "Total Members",
          <Users className="h-4 w-4 text-gray-500" />,
          members,
          "",
        )}
        {renderCard(
          "Unique Attendees",
          <Activity className="h-4 w-4 text-gray-500" />,
          attendees,
          "animation-delay-200",
        )}
        {renderCard(
          "Sessions This Month",
          <Calendar className="h-4 w-4 text-gray-500" />,
          sessionsThisMonth,
          "animation-delay-300",
        )}
      </div>

      {/* Analytics & Trends Section Header */}
      <Card className="animate-fade-up animation-delay-400">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTrendBlock height={300} />
        </CardContent>
      </Card>
    </div>
  );
}