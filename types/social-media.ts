export interface ISocialMedia {
   id: string;
   name: string;
   link: string;
   createdAt: string;
   updatedAt: string;
}

export interface AddSocialMediaPayload {
   name: string;
   link: string;
}

export interface UpdateSocialMediaPayload {
   name?: string;
   link?: string;
}
