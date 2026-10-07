"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/userService";
import { IUser, UserFilterParams } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MEMBERS_ONLY: UserFilterParams = {
  page: 1,
  limit: 20,
  churchStatus: "MEMBER",
  accountStatus: "ACTIVE",
  gender: "ALL",
};

export interface DataTableColumnMeta {
  exportKey?: string;
  exportLabel?: string;
}

export default function AddressBook() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<UserFilterParams>(MEMBERS_ONLY);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userService.getFilteredUsers(filters);
      setUsers(result.data);
      setPagination({
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      });
    } catch {
      // Error handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => {
        const next = searchInput || undefined;
        if (prev.search === next) return prev;
        return { ...prev, search: next, page: 1 };
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const exportToXLSX = useCallback(async () => {
    setIsExporting(true);
    try {
      const tableName = "users";
      const fields = [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "phoneNumber", label: "Phone Number" },
        { key: "email", label: "Email" },
        { key: "gender", label: "Gender" },
        { key: "membershipType", label: "Membership Type" },
        { key: "address", label: "Address" },
      ];
      await userService.exportUsersXLSX(tableName, fields);
      toast.success("XLSX exported successfully!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to export users XLSX",
      );
    } finally {
      setIsExporting(false);
    }
  }, [users, isExporting]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Address Book</h1>
          <p className="text-gray-500">Name and address of all members</p>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={exportToXLSX}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-[10px] text-gray-600" />
          ) : (
            <Download className="h-4 w-4 mr-[10px] text-gray-600" />
          )}
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex-1 sm:col-span-2 min-w- full">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="overflow-x-auto rounded-lg border">
          Loading members...
        </div>
      ) : (
        <>
          <AllMembersTable users={users} />
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))
                }
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AllMembersTable({ users }: { users: IUser[] }) {
  const columns: ColumnDef<IUser>[] = [
    {
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
      meta: {
        exportKey: "name",
        exportLabel: "Name",
      },
    },
    {
      header: "Address",
      accessorKey: "address",
      meta: {
        exportKey: "address",
        exportLabel: "Address",
      },
    },
  ];

  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search members..."
        />
      </div>
    </div>
  );
}
