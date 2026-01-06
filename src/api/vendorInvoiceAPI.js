import apiClient from "./apiClient";

export const vendorInvoiceAPI = {

  createUpdateVendorInvoice: async (formData) => {
    return await apiClient.put("/api/transaction/createUpdateVendorInvoice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllVendorInvoice: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/transaction/getVendorInvoiceByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getVendorInvoiceById: async (id) => {
    return await apiClient.get(`/api/transaction/getVendorInvoiceById`, {
      params: { id }
    });
  }

};
