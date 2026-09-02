"use client";

import { useEffect, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { ConsecutiveAbsentee } from "@/types/attendance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ConsecutiveAbsentees() {
  const [members, setMembers] = useState<ConsecutiveAbsentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getConsecutiveAbsentees()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        Loading consecutive absentees...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No consecutive absentees 
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40"
        >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {member.firstName[0]}
                {member.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">
                {member.firstName} {member.lastName}
              </h3>

              <p className="text-sm text-muted-foreground">
                {member.email}
              </p>
            </div>
          </div>

          <Badge variant="destructive">
            {member.consecutiveAbsences} missed
          </Badge>
        </div>
      ))}
    </div>
  );
}