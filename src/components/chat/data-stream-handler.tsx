"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

export type DataStreamDelta = {
  type:
    | "text-delta"
    | "code-delta"
    | "sheet-delta"
    | "image-delta"
    | "title"
    | "id"
    | "suggestion"
    | "clear"
    | "finish"
    | "kind";
  content: string | any;
};

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream } = useChat({ id });
  const lastProcessedIndex = useRef(-1);
  return null;
}
