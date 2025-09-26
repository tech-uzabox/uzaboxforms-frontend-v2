import axios from "axios";
import { toast } from "sonner";

export class UtilsService {

    // Helper function for API requests that handles errors gracefully
    async handleApiRequest(apiCall: () => Promise<any>): Promise<any> {
        try {
            const response = await apiCall();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // For 401 errors, let the axios interceptor handle token refresh
                // The interceptor will either retry the request or redirect to login
                if (error.response?.status === 401) {
                    // Re-throw 401 errors to let axios interceptor handle token refresh
                    throw error;
                }
                
                if (error.response) {
                    // Server responded with error status (non-401)
                    const errorData = error.response.data;
                    return errorData;
                } else if (error.request) {
                    // Network error - no response received
                    return {
                        success: false,
                        message: "Network error. Please check your connection and try again."
                    };
                } else {
                    // Something else happened
                    toast.error("Request failed. Please try again.");
                    return {
                        success: false,
                        message: "Request failed. Please try again."
                    };
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.");
                return {
                    success: false,
                    message: "An unexpected error occurred. Please try again."
                };
            }
        }
    }

    getCookie(name: string) {
        if (typeof document !== 'undefined') {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
        }
        return null;
    }

    // Local Storage Helpers
    setLocalStorage(key: string, value: unknown) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Failed to set local storage:", error);
        }
    }

    getLocalStorage(key: string) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Failed to get local storage:", error);
            return null;
        }
    }

    removeLocalStorage(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("Failed to remove local storage:", error);
        }
    }
}
