import apiClient from "@/lib/apiClient";
import {
  AccountStatus,
  IUser,
  UpdateChurchJourneyPayload,
  UserFilterParams,
  BulkImportResult,
} from "@/types/user";
import { ApiResponse, PaginatedData } from "@/types/api";
import { handleApiCall } from "@/lib/utils";

const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const userService = {
  exportUsersXLSX: async (
    tableName: string,
    fields: {
      key: string;
      label: string;
    }[],
  ): Promise<Blob> => {
    const response = await apiClient.post(
      "/export",
      {
        tableName,
        fields,
      },
      {
        responseType: "blob",
      },
    );

    const dateLabel = new Date().toISOString().slice(0, 10);
    const fileName = `${tableName}_${dateLabel}.xlsx`;

    triggerBlobDownload(response.data, fileName);

    return response.data;
  },

  // exportUsersXLSX: (params: { name: string; address: string }[]) =>
  //    handleApiCall<IUser[]>(() =>
  //       apiClient.post<ApiResponse<IUser[]>>("/user/export", {
  //          params,
  //       }),
  //    ),

  getUsers: () =>
    handleApiCall<IUser[]>(() =>
      apiClient.get<ApiResponse<IUser[]>>("/user"),
    ),

  getFilteredUsers: (params?: UserFilterParams) =>
    handleApiCall<PaginatedData<IUser>>(() =>
      apiClient.get<ApiResponse<PaginatedData<IUser>>>("/user/list", {
        params,
      }),
    ),

  getUserById: (id: string) =>
    handleApiCall<IUser>(() =>
      apiClient.get<ApiResponse<IUser>>(`/user/${id}`),
    ),

  /** The currently authenticated user — drives role-aware UI. */
  getMe: () =>
    handleApiCall<IUser>(() => apiClient.get<ApiResponse<IUser>>("/user/me")),

  /** Send a password-setup invite email to the user. */
  sendInvite: (id: string) =>
    handleApiCall<{
      id: string;
      token: string;
      expiresAt: string;
      inviteLink: string;
    }>(
      () =>
        apiClient.post<
          ApiResponse<{
            id: string;
            token: string;
            expiresAt: string;
            inviteLink: string;
          }>
        >(`/user/${id}/invite`, { id }),
      "Invite email sent!",
    ),

  assignPrimaryDepartment: (userId: string, departmentId: string) =>
    handleApiCall<IUser[]>(() =>
      apiClient.patch<ApiResponse<IUser[]>>(
        `/user/assign-primary-department/${userId}/${departmentId}`,
      ),
    ),

  searchUsers: (name: string) =>
    handleApiCall<IUser[]>(() =>
      apiClient.get<ApiResponse<IUser[]>>(`/user/search`, {
        params: { name },
      }),
    ),

  updateUser: (id: string, data: Partial<IUser>) =>
    handleApiCall<IUser>(
      () => apiClient.put<ApiResponse<IUser>>(`/user/${id}`, data),
      "User updated successfully!",
    ),

  updateChurchJourney: (id: string, data: UpdateChurchJourneyPayload) =>
    handleApiCall<IUser>(
      () =>
        apiClient.patch<ApiResponse<IUser>>(
          `/user/${id}/church-journey`,
          data,
        ),
      "Church journey updated successfully!",
    ),

  setPassword: (id: string, password: string) =>
    handleApiCall<IUser>(
      () =>
        apiClient.patch<ApiResponse<IUser>>(`/user/${id}/set-password`, {
          password,
        }),
      "Password set successfully!",
    ),

  deleteUser: (id: string) =>
    handleApiCall<IUser>(
      () => apiClient.delete<ApiResponse<IUser>>(`/user/${id}`),
      "User deleted successfully!",
    ),

  updateAccountStatus: (id: string, accountStatus: AccountStatus) =>
    handleApiCall<{ id: string; accountStatus: AccountStatus }>(
      () =>
        apiClient.patch<
          ApiResponse<{ id: string; accountStatus: AccountStatus }>
        >(`/user/${id}/status`, { accountStatus }),
      "Account status updated",
    ),

  bulkImport: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return handleApiCall<BulkImportResult>(
      () =>
        apiClient.post<ApiResponse<BulkImportResult>>(
          "/user/bulk-import",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        ),
      "Members imported successfully!",
    );
  },
};
