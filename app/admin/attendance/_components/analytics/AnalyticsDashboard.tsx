"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceSummary } from "@/types/attendance";
import AttendanceTrendChart from "./AttendanceTrendChart";
import TopMembersChart from "./TopMembersChart";
import MemberInsights from "../member-insights/MembersInsights";
import MemberAttendanceCurve from "./MemberAttendanceCurve";
import AttendanceRateChart from "./AttendanceRateChart";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    attendanceService
      .getAttendanceSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

return (
  <div className="space-y-8">
    {/* Dashboard Header */}
    <div>
      <h2 className="text-2xl font-bold tracking-tight">
        Analytics Dashboard
      </h2>
      <p className="text-muted-foreground mt-2">
        Monitor attendance trends, participation, and engagement across all church services.
      </p>
    </div>

    {/* Summary Cards */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sessions
          </CardTitle>
          <BarChart3 className="h-5 w-5 text-blue-500" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {summary?.totalSessions ?? "--"}
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Attendance sessions recorded
          </p>
        </CardContent>
      </Card>

      {/* Unique Attendees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Unique Attendees
          </CardTitle>
          <Users className="h-5 w-5 text-green-500" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {summary?.uniqueAttendees ?? "--"}
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Members recorded
          </p>
        </CardContent>
      </Card>

      {/* Average Attendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Average Attendance
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {summary?.avgAttendancePerSession ?? "--"}
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Per session
          </p>
        </CardContent>
      </Card>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Dashboard Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            Live
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Analytics updated automatically
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Attendance Trend */}
    <AttendanceTrendChart />

    {/* Insights Placeholder */}
    <Card>
      <CardHeader>
        <CardTitle>Attendance Insights</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-medium"> Attendance Overview</p>
            <p className="text-sm text-muted-foreground mt-2">
              View attendance trends over time to monitor church growth.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="font-medium"> Member Participation</p>
            <p className="text-sm text-muted-foreground mt-2">
              Identify members with the highest attendance consistency.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Charts */}
    <div className="">
      {/* <TopMembersChart /> */}
      <MemberInsights/>
      {/* <AttendanceRateChart /> */}
    </div>

    {/* Member History */}
    <MemberAttendanceCurve />
  </div>
);
}
