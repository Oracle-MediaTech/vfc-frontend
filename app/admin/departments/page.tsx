"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Users, Crown, Pencil, Trash2 } from "lucide-react";
import { departmentService } from "@/services/departmentService";
import { IDepartment } from "@/types/department";
import { PaginatedData } from "@/types/api";
import { DepartmentDialog } from "./_components/DepartmentDialog";
import { ManageMembersDialog } from "./_components/ManageMembersDialog";
import { BulkImportDialog } from "../members/_components/BulkImportDialog";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editDepartment, setEditDepartment] = useState<IDepartment | null>(null);
  const [manageDepartment, setManageDepartment] = useState<IDepartment | null>(null);
  const [showImport, setShowImport] = useState(false);

  const fetchDepartments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result: PaginatedData<IDepartment> =
        await departmentService.getAllDepartments({ page, limit: 20 });
      setDepartments(result.data);
      setPagination({ page: result.page, totalPages: result.totalPages });
    } catch {
      // Error handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (data: { name: string; description?: string }) => {
    await departmentService.createDepartment(data);
    fetchDepartments();
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editDepartment) return;
    await departmentService.updateDepartment(editDepartment.id, data);
    setEditDepartment(null);
    fetchDepartments();
  };

  const handleDelete = async (dept: IDepartment) => {
    if (!confirm(`Delete department "${dept.name}"?`)) return;
    await departmentService.deleteDepartment(dept.id);
    fetchDepartments();
  };

  const handleAssignHead = async (deptId: string, userId: string) => {
    const updated = await departmentService.assignHead(deptId, userId);
    refreshDepartmentInList(updated);
  };

  const handleAssignAssistantHead = async (deptId: string, userId: string) => {
    const updated = await departmentService.assignAssistantHead(deptId, [userId]);
    refreshDepartmentInList(updated);
  };

  const handleRemoveHead = async (deptId: string) => {
    const updated = await departmentService.removeHead(deptId);
    refreshDepartmentInList(updated);
  };

  const handleRemoveAsstHead = async (deptId: string, userId: string) => {
    const updated = await departmentService.removeAssistantHead(deptId, [userId]);
    refreshDepartmentInList(updated);
  };

  const handleAddMembers = async (deptId: string, userIds: string[]) => {
    const updated = await departmentService.addMembers(deptId, userIds);
    refreshDepartmentInList(updated);
  };

  const handleRemoveMembers = async (deptId: string, userIds: string[]) => {
    const updated = await departmentService.removeMembers(deptId, userIds);
    refreshDepartmentInList(updated);
  };

  const refreshDepartmentInList = (updated: IDepartment) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
    if (manageDepartment?.id === updated.id) {
      setManageDepartment(updated);
    }
  };

  const handleBulkImport = async (file: File) => {
    const result = await departmentService.bulkImport(file);
    fetchDepartments();
    return result;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Departments
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage church departments
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowImport(true)}
            className="w-full sm:w-auto active:scale-[0.98] transition-all py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white active:scale-[0.98] transition-all py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Department
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading departments...
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No departments yet. Create one or import from Excel.
        </div>
      ) : (
        // grid for mobile responsivenesss
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-all rounded-2xl border-gray-200/80 bg-white flex flex-col justify-between">
              <CardHeader className="pb-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-gray-900 truncate">
                    {dept.name}
                  </CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-gray-100 text-gray-600"
                      onClick={() => setEditDepartment(dept)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {dept.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1.5">
                    {dept.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4 p-5 pt-0 mt-auto">
                <hr className="border-gray-100 -mx-5" />
                
            
                <div className="space-y-2.5">
                  {/* Head */}
                  <div className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Crown className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                    <span className="truncate">
                      <strong className="font-semibold text-gray-900">Head: </strong>
                      {dept.head
                        ? `${dept.head.firstName} ${dept.head.lastName}`
                        : "No head assigned"}
                    </span>
                  </div>

                  {/* Asstistant Head */}
                  <div className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Crown className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                    <span className="truncate">
                      <strong className="font-semibold text-gray-900">Asst: </strong>
                      {dept.assistantHeads && dept.assistantHeads.length > 0
                        ? dept.assistantHeads
                            .map((h) => `${h.firstName} ${h.lastName}`)
                            .join(", ")
                        : "No Asst Head assigned"}
                    </span>
                  </div>

                  {/* Members count */}
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Users className="h-4 w-4 text-gray-500 shrink-0" />
                    <span>
                      <strong className="font-semibold text-gray-900">Members: </strong>
                      {dept.members?.length || 0}
                    </span>
                  </div>
                </div>

             
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full py-2.5 rounded-xl hover:bg-gray-50 font-medium active:scale-[0.98] transition-all"
                  onClick={() => setManageDepartment(dept)}
                >
                  Manage Members
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 py-2.5 active:scale-95 transition-transform"
            disabled={pagination.page <= 1}
            onClick={() => fetchDepartments(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 py-2.5 active:scale-95 transition-transform"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchDepartments(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialog  */}
      <DepartmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleCreate}
      />

      <DepartmentDialog
        open={!!editDepartment}
        onOpenChange={(open) => !open && setEditDepartment(null)}
        department={editDepartment}
        onSave={handleUpdate}
      />

      <ManageMembersDialog
        open={!!manageDepartment}
        onOpenChange={(open) => !open && setManageDepartment(null)}
        department={manageDepartment}
        onAssignHead={handleAssignHead}
        onAssignAssistantHead={handleAssignAssistantHead}
        onRemoveHead={handleRemoveHead}
        onRemoveAsstHead={handleRemoveAsstHead}
        onAddMembers={handleAddMembers}
        onRemoveMembers={handleRemoveMembers}
      />

      <BulkImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImport={handleBulkImport}
        title="Import Departments"
        description="Upload an Excel file (.xlsx) with columns: name, description"
      />
    </div>
  );
}