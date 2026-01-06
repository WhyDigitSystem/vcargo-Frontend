import apiClient from "./apiClient";

export const chargeTypeAPI = {

  createUpdateChargeType: async (payload) => {
    return await apiClient.put("/api/master/createUpdateChargeType", payload);
  },

  getAllChargeType: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getChargeTypeByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getChargeTypeById: async (id) => {
    return await apiClient.get(`/api/master/getChargeTypeById`, {
      params: { id }
    });
  },

  getChargeTypeDetails: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getChargeTypeList", {
      params: { count, page, search, orgId }
    });
  },

};
