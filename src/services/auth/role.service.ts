import { Role } from '@/types';
import { UtilsService } from '../utils';
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface RoleParams {
    id?: string;
    formData?: Partial<Role>;
}

class RoleService {
    getAllRoles(): Promise<Role[]> {
        return utils.handleApiRequest(() => authorizedAPI.get('/roles'));
    }

    getRolesByUserId({ queryKey }: { queryKey: [string, string] }): Promise<Role[]> {
        const [_, userId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/user-roles/${userId}`));
    }

    updateRole({ formData, id }: RoleParams): Promise<Role> {
        return utils.handleApiRequest(() => authorizedAPI.patch(`/roles/${id}`, formData));
    }

    createRole(formData: Partial<Role>): Promise<Role> {
        return utils.handleApiRequest(() => authorizedAPI.post('/roles', formData));
    }

    getRoleById(roleId: string): Promise<Role> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/roles/${roleId}`));
    }

    deleteRole(roleId: string): Promise<void> {
        return utils.handleApiRequest(() => authorizedAPI.delete(`/roles/${roleId}`));
    }
}

export const roleService = new RoleService();
