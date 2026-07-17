import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
   AddSocialMediaPayload,
   ISocialMedia,
   UpdateSocialMediaPayload,
} from "@/types/social-media";

export const socialMediaService = {
   list: () =>
      handleApiCall<ISocialMedia[]>(() =>
         apiClient.get<ApiResponse<ISocialMedia[]>>("/social-media"),
      ),

   getById: (id: string) =>
      handleApiCall<ISocialMedia>(() =>
         apiClient.get<ApiResponse<ISocialMedia>>(`/social-media/${id}`),
      ),

   add: (payload: AddSocialMediaPayload) =>
      handleApiCall<ISocialMedia>(
         () =>
            apiClient.post<ApiResponse<ISocialMedia>>("/social-media", payload),
         "Social media added!",
      ),

   update: (id: string, payload: UpdateSocialMediaPayload) =>
      handleApiCall<ISocialMedia>(
         () =>
            apiClient.put<ApiResponse<ISocialMedia>>(
               `/social-media/${id}`,
               payload,
            ),
         "Social media updated!",
      ),

   remove: (id: string) =>
      handleApiCall<{ success: boolean }>(
         () =>
            apiClient.delete<ApiResponse<{ success: boolean }>>(
               `/social-media/${id}`,
            ),
         "Social media deleted!",
      ),
};
