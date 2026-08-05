"use client";

import { useEffect, useMemo, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { ConsecutiveLateComer } from "@/types/attendance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsecutiveLateComers() {
  const [members, setMembers] = useState<ConsecutiveLateComer[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    attendanceService
      .getConsecutiveLateComers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const highest = useMemo(() => {
    return members.length
      ? members[0].consecutiveLateCount
      : 0;
  }, [members]);

  const totalPages = Math.max(
    1,
    Math.ceil(members.length / pageSize)
  );

  const currentMembers = useMemo(() => {
    const start = (page - 1) * pageSize;

    return members.slice(start, start + pageSize);
  }, [members, page]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        Loading consecutive late comers...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="py-16 text-center text-muted-foreground">
         Nobody is currently on a late-coming streak.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {currentMembers.map((member, index) => {
          const initials =
            `${member.firstName[0]}${member.lastName[0]}`;

          const percent = highest
            ? Math.round(
                (member.consecutiveLateCount / highest) * 100
              )
            : 0;

          return (
            <div
              key={member.id}
              className="rounded-xl border p-5 hover:bg-muted/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold">
                      {member.firstName} {member.lastName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {member.consecutiveLateCount} Consecutive Late
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-orange-500" />

                  <span className="font-bold">
                    #{(page - 1) * pageSize + index + 1}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Progress value={percent} />

                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>{percent}%</span>

                  <span>
                    {member.consecutiveLateCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Page {page} of {totalPages}
        </p>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}