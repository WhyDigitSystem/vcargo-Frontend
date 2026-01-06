import apiClient from "./apiClient";

export const tripAPI = {

  createUpdateTrip: async (payload) => {
    return await apiClient.put("/api/transaction/createUpdateTrips", payload);
  },

  getAllTrips: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/transaction/getTripsByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getTripById: async (id) => {
    return await apiClient.get(`/api/transaction/getTripsById`, {
      params: { id }
    });
  },

};
