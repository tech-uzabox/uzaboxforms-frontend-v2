import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "../utils";
const utils = new UtilsService();
class ChatService {
  getChatById(id: string): Promise<any> {
    return utils.handleApiRequest(() => authorizedAPI.get(`/ai/chat/${id}`));
  }
  getChatMessagesById(id: string): Promise<any> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/ai/chat/${id}/messages`)
    );
  }
  deletChatById(id: string): Promise<any> {
    return utils.handleApiRequest(() => authorizedAPI.delete(`/ai/chat/${id}`));
  }
}
export const chatService = new ChatService();
