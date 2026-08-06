"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AttendanceChampions from "./AttendanceChampions";
import ConsecutiveAbsentees from "./ConsecutiveAbsentees";
import ConsecutiveLateComers from "./ConsecutiveLateComers";

type View =
  | "champions"
  | "absentees"
  | "late";
export default function MemberInsights() {
  const [view, setView] = useState<View>("champions");

  return (
    <Card>

      <CardHeader>

        <CardTitle className="text-xl">
          Member Insights
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          View attendance behaviour and member engagement.
        </p>

        <div className="flex flex-wrap gap-2 pt-4">

          <Button
            variant={view === "champions" ? "default" : "outline"}
            onClick={() => setView("champions")}
          >
            🏆 Attendance Champions
          </Button>

          <Button
            variant={view === "absentees" ? "default" : "outline"}
            onClick={() => setView("absentees")}
          >
            ❌ Consecutive Absentees
          </Button>

          <Button
            variant={view === "late" ? "default" : "outline"}
            onClick={() => setView("late")}
          >
            ⏰ Late Workers
          </Button>

          

        </div>

      </CardHeader>

      <CardContent>

        {view === "champions" && <AttendanceChampions />}

        {view === "absentees" && (<ConsecutiveAbsentees/>
        )}

        {view === "late" && (<ConsecutiveLateComers/>
        )}

        

      </CardContent>

    </Card>
  );
}