import apiClient from "./apiClient";

export const notificationAPI = {
  getAllNotificationByUserId: async ({ userId }) => {
    return await apiClient.get("/api/notification/byUserId", {
      params: { userId },
    });
  },

  clearNotificationById: async ({ id }) => {
    return await apiClient.put(`/api/notification/clear?id=${id}`);
  },

  clearAllNotificationd: async ({ userId }) => {
    return await apiClient.put(`/api/notification/clearAll?userId=${userId}`);
  },

  markRead: async ({ id }) => {
    return await apiClient.put(`/api/notification/markRead?id=${id}`);
  },
};
