import apiClient from "./apiClient";

export const routesAPI = {
  createUpdateRoutes: async (payload) => {
    return await apiClient.put("/api/master/createUpdateRoutes", payload);
  },

  getAllRouteList: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getRoutesByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getRouteById: async (id) => {
    return await apiClient.get("/api/master/getRoutesById", {
      params: { id }
    });
  },

  getRouteList: async ({ orgId }) => {
    return await apiClient.get("/api/master/getOriginAndDestinationList", {
      params: { orgId }
    })
  }

};
