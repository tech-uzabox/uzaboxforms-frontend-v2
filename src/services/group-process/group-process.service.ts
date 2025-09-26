import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class GroupProcessService {
  getAllGroupAndProcessesByUserId({ queryKey }: any): Promise<any> {
    const [_, userId] = queryKey;
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/groups/user/${userId}/group-processes`)
    );
  }
}

export const groupProcessService = new GroupProcessService();
