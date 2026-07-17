"use client";

import { useEffect, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISocialMedia } from "@/types/social-media";

interface Props {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   initial: ISocialMedia | null;
   onSave: (payload: { name: string; link?: string }) => Promise<void>;
}

export function AddSocialMediaDialog({
   open,
   onOpenChange,
   initial,
   onSave,
}: Props) {
   const [name, setName] = useState("");
   const [link, setLink] = useState("");
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!open) return;
      if (initial) {
         setName(initial.name);
         setLink(initial.link || "");
      } else {
         setName("");
         setLink("");
      }
      setError(null);
   }, [open, initial]);

   const handleSave = async () => {
      if (!name.trim()) return setError("Name is required.");

      setSaving(true);
      try {
         await onSave({
            name: name.trim(),
            link: link.trim(),
         });
         onOpenChange(false);
      } finally {
         setSaving(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>
                  {initial ? "Edit Social Media" : "Add Social Media"}
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
               <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                     placeholder="e.g. Facebook"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                     placeholder="e.g. https://facebook.com/yourpage"
                     value={link}
                     onChange={(e) => setLink(e.target.value)}
                  />
               </div>

               {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <DialogFooter>
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
               >
                  Cancel
               </Button>
               <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
