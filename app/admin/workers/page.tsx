"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Upload, Plus } from "lucide-react";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import {
   AccountStatus,
   AssignPrimaryDepartmentPayload,
   IUser,
   UpdateChurchJourneyPayload,
   UpdateUserPayload,
   UserFilterParams,
} from "@/types/user";
import { PaginatedData } from "@/types/api";
import type { RegisterPayload } from "@/types/auth";
import WorkersTable from "./_components/WorkersTable";
import { ChurchJourneyDialog } from "./_components/ChurchJourneyDialog";
import { SetPasswordDialog } from "./_components/SetPasswordDialog";
import { BulkImportDialog } from "./_components/BulkImportDialog";
import { RegisterMemberDialog } from "./_components/RegisterMemberDialog";
import { EditMemberDialog } from "./_components/EditWorkerDialog";
import { AssignPrimaryDepartment } from "./_components/AssignPrimaryDepartment";

const WORKERS_ONLY: UserFilterParams = {
   page: 1,
   limit: 20,
   membershipType: "WORKER",
   accountStatus: "ACTIVE",
   gender: "ALL",
};

export default function WorkersPage() {
   const [workers, setWorkers] = useState<IUser[]>([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0,
   });
   const [filters, setFilters] = useState<UserFilterParams>(WORKERS_ONLY);

   // Dialog states
   const [editUser, setEditUser] = useState<IUser | null>(null);
   const [journeyUser, setJourneyUser] = useState<IUser | null>(null);
   const [assignPrimaryDepartmentUser, setAssignPrimaryDepartmentUser] =
      useState<IUser | null>(null);
   const [passwordUser, setPasswordUser] = useState<IUser | null>(null);
   const [showImport, setShowImport] = useState(false);
   const [showRegister, setShowRegister] = useState(false);
   const [searchInput, setSearchInput] = useState("");

   const fetchWorkers = useCallback(async () => {
      setLoading(true);
      try {
         console.log("fetch func", filters);
         const result: PaginatedData<IUser> =
            await userService.getFilteredUsers(filters);
         setWorkers(
            result.data.filter((user) => user.membershipType === "WORKER"),
         );
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
      fetchWorkers();
   }, [fetchWorkers]);

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

   const handleFilterChange = (key: string, value: string) => {
      setFilters((prev) => ({
         ...prev,
         [key]: value === "ALL" ? undefined : value,
         page: 1,
      }));
   };

   const handleChurchJourneySave = async (
      id: string,
      data: UpdateChurchJourneyPayload,
   ) => {
      await userService.updateChurchJourney(id, data);
      fetchWorkers();
   };

   const handleAssignPrimaryDepartmentSave = async (
      userId: string | undefined,
      departmentId: string,
   ) => {
      if (userId === undefined) return;
      await userService.assignPrimaryDepartment(userId, departmentId);
      fetchWorkers();
   };

   const handleEditMemberSave = async (id: string, data: UpdateUserPayload) => {
      await userService.updateUser(id, data);
      fetchWorkers();
   };

   const handleSetPassword = async (id: string, password: string) => {
      await userService.setPassword(id, password);
   };

   const handleDelete = async (user: IUser) => {
      if (!user.id || !confirm(`Delete ${user.firstName} ${user.lastName}?`))
         return;
      await userService.deleteUser(user.id);
      fetchWorkers();
   };

   const handleSendInvite = async (user: IUser) => {
      if (!user.id) return;
      if (
         !confirm(
            `Send a password-setup invite email to ${user.firstName} ${user.lastName} (${user.email})?`,
         )
      ) {
         return;
      }
      await userService.sendInvite(user.id);
   };

   const handleAssignPrimaryDepartment = async (user: IUser) => {
      console.log(user);
   };

   const handleBulkImport = async (file: File) => {
      const result = await userService.bulkImport(file);
      fetchWorkers();
      return result;
   };

   const handleRegister = async (payload: RegisterPayload) => {
      await authService.register(payload);
      fetchWorkers();
   };

   const handleUpdateStatus = async (user: IUser, status: AccountStatus) => {
      if (!user.id) return;
      if (!confirm(`Set ${user.firstName} ${user.lastName} to ${status}?`))
         return;
      await userService.updateAccountStatus(user.id, status);
      fetchWorkers();
   };

   return (
      <div className="p-4 md:p-6 space-y-6">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
               <h1 className="text-2xl md:text-3xl font-bold">Workers</h1>
               <p className="text-gray-500">{pagination.total} total workers</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
               <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowImport(true)}
               >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
               </Button>
            </div>
         </div>

         {/* Filters */}
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

            <Select
               value={filters.gender || "ALL"}
               onValueChange={(v) => handleFilterChange("gender", v)}
            >
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gender" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="ALL">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
               </SelectContent>
            </Select>

            <Select
               value={filters.accountStatus || "ALL"}
               onValueChange={(v) => handleFilterChange("accountStatus", v)}
            >
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Table */}
         {loading ? (
            <div className="overflow-x-auto rounded-lg border">
               Loading workers...
            </div>
         ) : (
            <WorkersTable
               data={workers}
               onEdit={(user) => setEditUser(user)}
               onChurchJourney={(user) => setJourneyUser(user)}
               onSetPassword={(user) => setPasswordUser(user)}
               onAssignPrimaryDepartment={(user) =>
                  setAssignPrimaryDepartmentUser(user)
               }
               onDelete={handleDelete}
               onSendInvite={handleSendInvite}
               onUpdateStatus={handleUpdateStatus}
            />
         )}

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

         {/* Dialogs */}

         <EditMemberDialog
            open={!!editUser}
            onOpenChange={(open) => !open && setEditUser(null)}
            onSave={handleEditMemberSave}
            userData={editUser}
         />

         <ChurchJourneyDialog
            open={!!journeyUser}
            onOpenChange={(open) => !open && setJourneyUser(null)}
            user={journeyUser}
            onSave={handleChurchJourneySave}
         />

         <AssignPrimaryDepartment
            open={!!assignPrimaryDepartmentUser}
            onOpenChange={(open) =>
               !open && setAssignPrimaryDepartmentUser(null)
            }
            user={assignPrimaryDepartmentUser}
            onSave={handleAssignPrimaryDepartmentSave}
         />

         <SetPasswordDialog
            open={!!passwordUser}
            onOpenChange={(open) => !open && setPasswordUser(null)}
            user={passwordUser}
            onSave={handleSetPassword}
         />

         <BulkImportDialog
            open={showImport}
            onOpenChange={setShowImport}
            onImport={handleBulkImport}
         />

         <RegisterMemberDialog
            open={showRegister}
            onOpenChange={setShowRegister}
            onRegister={handleRegister}
         />
      </div>
   );
}
