export interface IChurchSettings {
   id: string;
   name: string;
   email: string;
   phoneNumber: string;
   logoUrl?: string | null;
   address?: string | null;
   updatedAt: string;
}

export interface UpdateChurchSettingsPayload {
   name?: string;
   email?: string;
   phoneNumber?: string;
   logoUrl?: string | null;
   address?: string | null;
}
