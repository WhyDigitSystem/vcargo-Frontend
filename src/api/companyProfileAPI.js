import apiClient from "./apiClient";

export const companyProfileAPI = {

    createUpdateCompanyProfile: async (formData) => {
        try {
            console.log("Sending company profile blob payload...");

            const response = await apiClient.put(
                "/api/master/createUpdateCompanyProfile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response?.statusFlag === "Ok") {
                return response;
            }

            throw new Error(
                response?.paramObjectsMap?.message || "Failed to save company profile"
            );
        } catch (error) {
            console.error("Error saving company profile:", error);
            throw error;
        }
    },

    getAllCompanyProfile: async ({ count, page, orgId }) => {
        return await apiClient.get("/api/master/getAllCompanyProfileByOrgId", {
            params: { count, page, orgId }
        });
    },

    // getCompanyProfileById: async (id) => {
    //     return await apiClient.get(`/api/vehicle/driverById`, {
    //         params: { id }
    //     });
    // },

};
