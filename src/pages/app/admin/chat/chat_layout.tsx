"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/chat/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_open');
      return stored ? JSON.parse(stored) : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_open', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  return (
    <>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="h-full">
        <SidebarInset>{children}</SidebarInset>
        <AppSidebar />
      </SidebarProvider>
    </>
  );
}
