"use client";

import { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AssignPrimaryDepartmentPayload, IUser } from "@/types/user";

interface AssignPrimaryDepartmentProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   user: IUser | null;
   onSave: (userId: string | undefined, departmentId: string) => Promise<void>;
}

export function AssignPrimaryDepartment({
   open,
   onOpenChange,
   user,
   onSave,
}: AssignPrimaryDepartmentProps) {
   const [departmentId, setDepartmentId] = useState("");
   const [saving, setSaving] = useState(false);

   const handleSave = async () => {
      if (!user?.id) return;
      setSaving(true);
      try {
         const payload: AssignPrimaryDepartmentPayload = {};
         if (departmentId) payload.departmentId = departmentId as any;
         if (user) payload.userId = user?.id as any;
         await onSave(payload.userId, departmentId);
         onOpenChange(false);
      } finally {
         setSaving(false);
      }
   };

   // Reset state when user changes
   // if (user && churchStatus !== user.churchStatus && !saving) {
   //    setChurchStatus(user.churchStatus || "");
   //    setMembershipType(user.membershipType || "");
   //    setWorkerType(user.workerType || "");
   //    setRole(user.role || "");
   // }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>
                  Assign Primary Department - {user?.firstName} {user?.lastName}
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
               <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                     </SelectTrigger>
                     <SelectContent>
                        {user?.departments?.map((dept) => (
                           <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <DialogFooter>
               <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
               </Button>
               <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
