import { Chat } from "@/components/chat/chat";
import { DataStreamHandler } from "@/components/chat/data-stream-handler";

import { generateUUID } from "@/lib/utils";
import { ChatLayout } from "./chat_layout";

export default async function Page() {
  const id = generateUUID();

  return (
    <ChatLayout>
      <div className="h-full pb-2">
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={"chat-model"}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </div>
    </ChatLayout>
  );
}
