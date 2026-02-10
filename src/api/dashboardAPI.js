import apiClient from "./apiClient";

export const dashboardAPI = {
  getAllRecentActivities: async ({ orgId }) => {
    return await apiClient.get("/api/dashboard/getAllRecentActivities", {
      params: { orgId },
    });
  },

  getVehicleStatus: async ({ orgId }) => {
    return await apiClient.get("/api/dashboard/getAllDashBoardVehicleDetails", {
      params: { orgId },
    });
  },
};
