import { toast } from "sonner";
import { chatService } from "@/services/chat/chat.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetChatById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ["chat", id],
    queryFn: () => chatService.getChatById(id),
    enabled: !!id,
  });
};

export const useGetChatMessagesById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ["chat-messages", id],
    queryFn: () => chatService.getChatMessagesById(id),
    enabled: !!id,
  });
};

export const useDeleteChatById = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: chatService.deletChatById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      toast.success("Chat deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting chat:', error);
      toast.error("Failed to delete chat");
    },
  });
};
