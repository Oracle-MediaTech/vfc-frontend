"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationForm } from "@/components/RegistrationForm";
import type { RegisterPayload } from "@/types/auth";

interface RegisterMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (payload: RegisterPayload) => Promise<void>;
}

export function RegisterMemberDialog({
  open,
  onOpenChange,
  onRegister,
}: RegisterMemberDialogProps) {
  const handleRegister = async (payload: RegisterPayload) => {
    await onRegister(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
             w-[calc(100vw-1.5rem)]
    max-w-2xl
    max-h-[90dvh]
    overflow-y-auto
    rounded-xl
    p-10

        "
      >
        <DialogHeader className="">
          <DialogTitle className="text-xl font-semibold">
            Register New Member
          </DialogTitle>
        </DialogHeader>

        <RegistrationForm
          onSubmit={handleRegister}
          submitLabel="Register Member"
          submittingLabel="Registering..."
        />
      </DialogContent>
    </Dialog>
  );
}