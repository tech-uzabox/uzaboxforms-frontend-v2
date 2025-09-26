"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { API_URL, generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import type { Attachment, UIMessage } from "ai";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import type { VisibilityType } from "./visibility-selector";
import { useTokenStore } from "@/store/use-token-store";

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const token = useTokenStore.getState().getToken()
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    api: `${API_URL}/ai/chat`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      console.log(error)
      toast.error("An error occurred, please try again!");
    },
    onResponse(response) {
      console.log(response?.body)
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  // const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  return (
    <>
      <div className="flex flex-col min-w-0 h-full">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={[]}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={false}
        />

        <form className="flex mx-auto gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              append={append}
              attachments={attachments}
              setAttachments={setAttachments}
            />
          )}
        </form>
      </div>
    </>
  );
}
