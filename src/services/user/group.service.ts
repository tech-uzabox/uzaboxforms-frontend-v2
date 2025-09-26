import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "../utils/utils.service";
import { GroupWithRoles, CreateGroupData, UpdateGroupData } from "@/types";

export interface GroupParams {
  id?: string;
  formData?: UpdateGroupData;
}

const utils = new UtilsService();

class GroupService {
  getAllGroups(): Promise<GroupWithRoles[]> {
    return utils.handleApiRequest(() => authorizedAPI.get("/groups"));
  }

  updateGroup({ formData, id }: GroupParams): Promise<GroupWithRoles> {
    return utils.handleApiRequest(() =>
      authorizedAPI.patch(`/groups/${id}`, formData)
    );
  }

  createGroup(formData: CreateGroupData): Promise<GroupWithRoles> {
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/groups", formData)
    );
  }

  getGroupById(groupId: string): Promise<GroupWithRoles> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/groups/${groupId}`)
    );
  }

  deleteGroup(groupId: string): Promise<void> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/groups/${groupId}`)
    );
  }

}

export const groupService = new GroupService();
