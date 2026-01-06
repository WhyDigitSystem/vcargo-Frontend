import apiClient from "./apiClient";

export const vehicleAPI = {

  createUpdateVehicle: async (payload) => {
    return await apiClient.put("/api/vehicle/createUpdateVehicle", payload);
  },

  getAllVehicle: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/vehicle/getAllVehicle", {
      params: { count, page, search, orgId }
    });
  },

  getVehicleById: async (id) => {
    return await apiClient.get(`/api/vehicle/getVehicleById`, {
      params: { id }
    });
  },

};
