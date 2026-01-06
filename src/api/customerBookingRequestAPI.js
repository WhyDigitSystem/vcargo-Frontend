import apiClient from "./apiClient";

export const customerBookingRequestAPI = {

  createUpdateCustomerBookingRequest: async (payload) => {
    return await apiClient.put("/api/transaction/createUpdateCustomerBookingRequest", payload);
  },

  getAllCustomerBookingRequest: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/transaction/getCustomerBookingRequestByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getCustomerBookingRequestById: async (id) => {
    return await apiClient.get(`/api/transaction/getCustomerBookingRequestById`, {
      params: { id }
    });
  },

};
