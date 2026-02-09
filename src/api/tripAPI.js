import apiClient from "./apiClient";

export const tripAPI = {
  createUpdateTrip: async (payload) => {
    return await apiClient.put("/api/transaction/createUpdateTrips", payload);
  },

  getAllTrips: async ({ orgId }) => {
    return await apiClient.get("/api/transaction/getTripsByOrgId", {
      params: { orgId },
    });
  },

  getTripById: async (id) => {
    return await apiClient.get(`/api/transaction/getTripsById`, {
      params: { id },
    });
  },
};
