import apiClient from "./apiClient";

export const driverAPI = {

  createUpdateDriver: async (payload) => {
    return await apiClient.put("/api/vehicle/createUpdateDriver", payload);
  },

  getAllDriver: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/vehicle/getAllDriver", {
      params: { count, page, search, orgId }
    });
  },

  getDriverById: async (id) => {
    return await apiClient.get(`/api/vehicle/driverById`, {
      params: { id }
    });
  },

};
