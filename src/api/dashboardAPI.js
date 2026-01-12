import apiClient from "./apiClient";

export const dashboardAPI = {
  getAllRecentActivities: async ({ orgId }) => {
    return await apiClient.get("/api/dashboard/getAllRecentActivities", {
      params: { orgId },
    });
  },
};
