"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AddSocialMediaDialog } from "./AddSocialMediaDialog";
import { socialMediaService } from "@/services/socialMediaService";
import { ISocialMedia } from "@/types/social-media";

export function Socials() {
   const [socials, setSocials] = useState<ISocialMedia[]>([]);
   const [loading, setLoading] = useState(true);
   const [showCreate, setShowCreate] = useState(false);
   const [editTarget, setEditTarget] = useState<ISocialMedia | null>(null);

   const refresh = async () => {
      setLoading(true);
      try {
         const list = await socialMediaService.list();
         setSocials(list);
      } catch {
         // toast handled
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      refresh();
   }, []);

   const handleAdd = async (payload: { name: string; link?: string }) => {
      const body: Parameters<typeof socialMediaService.add>[0] = {
         name: payload.name,
         link: payload.link ?? "",
      };
      await socialMediaService.add(body);
      refresh();
   };

   const handleUpdate = async (payload: { name: string; link?: string }) => {
      if (!editTarget) return;
      const body: Parameters<typeof socialMediaService.update>[1] = {
         name: payload.name,
         link: payload.link ?? "",
      };
      await socialMediaService.update(editTarget.id, body);
      refresh();
   };

   const handleDelete = async (p: ISocialMedia) => {
      if (
         !confirm(
            `Delete "${p.name}"? Existing sessions stay but will lose this link.`,
         )
      )
         return;
      await socialMediaService.remove(p.id);
      refresh();
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-lg font-semibold">Social Media</h2>
               <p className="text-sm text-gray-500">
                  Manage your social media links and profiles.
               </p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
               <Plus className="h-4 w-4 mr-1" />
               Add Social Media
            </Button>
         </div>

         {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
         ) : socials.length === 0 ? (
            <p className="text-sm text-gray-500">No social media links yet.</p>
         ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {socials.map((p) => (
                  <Card key={p.id}>
                     <CardContent className="pt-4 space-y-2">
                        <div className="flex items-start justify-between">
                           <div>
                              <p className="font-semibold">{p.name}</p>
                              <p className="text-xs text-gray-500">
                                 {/* {formatDate(p.createdAt)} */}
                              </p>
                           </div>
                           <div className="flex gap-1">
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => setEditTarget(p)}
                              >
                                 <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="text-red-500"
                                 onClick={() => handleDelete(p)}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}

         <AddSocialMediaDialog
            open={showCreate}
            onOpenChange={setShowCreate}
            initial={null}
            onSave={handleAdd}
         />
         <AddSocialMediaDialog
            open={!!editTarget}
            onOpenChange={(open) => !open && setEditTarget(null)}
            initial={editTarget}
            onSave={handleUpdate}
         />
      </div>
   );
}
