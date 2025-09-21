import { API_ENDPOINTS } from "./apiConfig";

/**
 * Fetch a production teaser from the backend
 * @param {string} productionName - The name of the production
 * @returns {Promise<string>} The teaser text
 */
export const fetchProductionTeaser = async (productionName) => {
    if (!productionName) {
        throw new Error("Production name is required");
    }

    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTION_TEASER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productionName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.teaser || "No teaser available";
    } catch (error) {
        console.error("Error fetching production teaser:", error);
        throw error;
    }
};
