import apiClient from "@/lib/apiClient";
import { handleApiCall } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { AccountSetupPayload } from "@/types/auth";

// 🧩 Account Setup Service
export const accountSetupService = {
   // 🔐 Set Password
   async setPassword(
      credentials: AccountSetupPayload,
   ): Promise<{ success: boolean }> {
      const res = await handleApiCall<{ success: boolean }>(
         () =>
            apiClient.post<ApiResponse<{ success: boolean }>>(
               "/user/set-password",
               credentials,
            ),
         "Password set successfully!",
      );

      return res;
   },
};
