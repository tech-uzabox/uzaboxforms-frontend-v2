import { Chat } from "@/components/chat/chat";
import { DataStreamHandler } from "@/components/chat/data-stream-handler";
import { ErrorState, LoadingSkeleton } from "@/components/ui";
import { useGetChatById } from "@/hooks";
// import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
// import type { DBMessage } from "@/lib/db/schema";
import type { Attachment, UIMessage } from "ai";
import { useParams } from "react-router-dom";
import { ChatLayout } from "./chat_layout";

export default function ChatById() {
  const { id } = useParams();
  const { data: chat, isLoading, isError, error, refetch } = useGetChatById(id!);

  if (isLoading) {
    return (
      <ChatLayout>
        <div className="h-full pb-2 flex items-center justify-center">
          <LoadingSkeleton type="header" />
        </div>
      </ChatLayout>
    );
  }

  if (isError) {
    return (
      <ChatLayout>
        <div className="h-full pb-2 flex items-center justify-center">
          <ErrorState
            error={error}
            onRetry={refetch}
            title="Failed to load chat"
          />
        </div>
      </ChatLayout>
    );
  }

  if (!chat) {
    return (
      <ChatLayout>
        <div className="h-full pb-2 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat not found</h3>
            <p className="text-sm text-gray-500">The chat you're looking for doesn't exist.</p>
          </div>
        </div>
      </ChatLayout>
    );
  }

  const { messages } = chat;
  console.log(chat)
  function convertToUIMessages(messages: Array<any>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      experimental_attachments:
        (message.attachments as Array<Attachment>) ?? [],
    }));
  }

  return (
    <ChatLayout>
      <div className="h-full pb-2">
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messages)}
          selectedChatModel={"chat-model"}
          selectedVisibilityType={chat.visibility}
          isReadonly={false}
        />
        <DataStreamHandler id={id!} />
      </div>
    </ChatLayout>
  );
}
