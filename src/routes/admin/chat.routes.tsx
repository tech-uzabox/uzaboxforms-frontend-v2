import { ComponentSuspense } from "@/components/ui/suspense-wrapper";
import { lazy } from "react";
import type { RouteConfig } from "../types";

const ChatPage = lazy(() => import("@/pages/app/admin/chat/chat"));
const ChatByIdPage = lazy(() => import("@/pages/app/admin/chat/chat_by_id"));

export const chatRoutes: RouteConfig[] = [
  {
    path: "admin/chat",
    element: (
      <ComponentSuspense>
        <ChatPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaAI | UzaForm",
      description: "Chat with UzaAI to get instant assistance",
    },
  },
  {
    path: "admin/chat/:id",
    element: (
      <ComponentSuspense>
        <ChatByIdPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaAI | UzaForm",
      description: "Chat with UzaAI to get instant assistance",
    },
  },
];
