import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";
import type { CreateUserData, UpdateUserData } from "@/types";

const utils = new UtilsService();

class UserService {
    getAllUsers(params?: { roleIds?: string[]; names?: string[] }): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get("/users", { params }));
    }

    createUser(userData: CreateUserData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/users", userData));
    }

    updateUser(userId: string, userData: UpdateUserData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.patch(`/users/${userId}`, userData));
    }

    getUserById(userId: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/users/${userId}`));
    }

    deleteUser(userId: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.delete(`/users/${userId}`));
    }

    changeUserPassword(userId: string, passwordData: { currentPassword: string; newPassword: string }): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.patch(`/users/${userId}/change-password`, passwordData)
        );
    }
}

export const userService = new UserService();
