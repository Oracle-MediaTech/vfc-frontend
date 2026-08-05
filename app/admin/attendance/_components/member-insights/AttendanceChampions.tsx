"use client";

import { useEffect, useMemo, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { TopMember } from "@/types/attendance";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Medal } from "lucide-react";

export default function AttendanceChampions() {
  const [members, setMembers] = useState<TopMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
const pageSize = 10;

const totalPages = Math.ceil(members.length / pageSize);

const paginatedMembers = useMemo(() => {
  const start = (page - 1) * pageSize;
  return members.slice(start, start + pageSize);
}, [members, page]);

useEffect(() => {
  attendanceService
    .getTopMembers()
    .then(setMembers)
    .catch(() => setMembers([]))
    .finally(() => setLoading(false));
}, []);


  const highest = useMemo(() => {
    return members.length
      ? members[0].attendanceCount
      : 0;
  }, [members]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        Loading attendance champions...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No attendance records available.
      </div>
    );
  }

  return (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {paginatedMembers.map((member, index) => {

        const percent = highest
          ? Math.round(
              (member.attendanceCount / highest) * 100
            )
          : 0;

        const initials =
          `${member.firstName[0]}${member.lastName[0]}`;

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

                    {member.attendanceCount} Attendances

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

               {/* <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" /> */}

                <span className="font-bold">

                  #{(page - 1) * pageSize + index + 1}

                </span>

              </div>

            </div>

            <div className="mt-5">

              <Progress value={percent} />

              <div className="mt-2 flex justify-between text-sm text-muted-foreground">

                <span>{percent}%</span>

                <span>{member.attendanceCount}</span>

              </div>

            </div>

          </div>
          

        );
      })}

 <div className="mt-6 flex items-center  border-t pt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="rounded-md border px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="rounded-md border px-4 py-2 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    </div>
  );
}