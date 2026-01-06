import apiClient from "./apiClient";

export const vehicleTypeAPI = {
  createUpdateVehicleType: async (payload) => {
    return await apiClient.put("/api/vehicle/createUpdateVehicleType", payload);
  },

  getAllVehicleTypeList: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/vehicle/getAllVehicleType", {
      params: {
        count,
        page,
        search: search || "",
        orgId
      }
    });
  },

  getVehicleTypeListById: async (id) => {
    return await apiClient.get("/api/vehicle/vehicleTypeById", {
      params: { id }
    });
  },

  getVehicleType: async ({orgId}) => {
    return await apiClient.get("/api/master/getVehicleTypeListByOrgId", {
      params: { orgId },
    })}
};
