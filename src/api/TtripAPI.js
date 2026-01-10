import apiClient from "./apiClient";

export const tripAPI = {

  createUpdateTrip: async (payload) => {
    return await apiClient.put("/api/trip/createUpdateTrip", payload);
  },

  getAllTrips: async ({ count, page, orgId }) => {
    return await apiClient.get("/api/trip/getAllTripByOrgId", {
      params: { count, page, orgId }
    });
  },

  getTripById: async (id) => {
    return await apiClient.get(`/api/trip/getTripById`, {
      params: { id }
    });
  },

};
