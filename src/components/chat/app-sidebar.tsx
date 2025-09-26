"use client";

import { PlusIcon } from "@/components/chat/icons";
import { SidebarHistory } from "@/components/chat/sidebar-history";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/use-auth-store";
import { Link, useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const { user } = useAuthStore();

  return (
    <Sidebar side="right" className="h-[83vh] mt-[5.5rem]">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              to="#"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Uza-AI
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    navigate("/admin/chat");
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end" side="bottom">
                New Chat
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory />
      </SidebarContent>
      {/* <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter> */}
    </Sidebar>
  );
}
