import apiClient from "./apiClient";

export const customerAPI = {
  createOrUpdateCustomer: async (payload) => {
    return await apiClient.put("/api/master/createUpdateCustomer", payload);
  },

  getAllCustomersList: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getCustomerByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getCustomerById: async (id) => {
    return await apiClient.get("/api/master/getCustomerById", {
      params: { id }
    });
  },

  getCustomerName: async ({orgId}) => {
    return await apiClient.get("/api/master/getCustomerNameByOrgId", {
      params: { orgId }
    })}
};
