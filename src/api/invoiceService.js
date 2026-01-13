import apiClient from "./apiClient";

export const invoiceAPI = {

  createUpdateInvoice: async (payload) => {
    return await apiClient.put("/api/tripinvoice/createUpdateTripInvoice", payload);
  },

  getAllInvoice: async ({ count, page, orgId }) => {
    return await apiClient.get("/api/tripinvoice/getAllTripInvoiceByOrgId", {
      params: { count, page, orgId }
    });
  },

};
