import apiClient from "./apiClient";

export const customerRateAPI = {
  createUpdateCustomerRate: async (payload) => {
    return await apiClient.put("/api/master/createUpdateCustomerRate", payload);
  },

  getAllCustomerRateList: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getCustomerRateByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getCustomerRateById: async (id) => {
    return await apiClient.get("/api/master/getCustomerRateById", {
      params: { id }
    });
  },

  getCustomerRate: async ({orgId}) => {
    return await apiClient.get("/api/master/getCustomerRateAndOriginList", {
      params: { orgId }
    })}
};
