import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "../language-toggle";
import BreadCrumb from "@/components/button/bread-crumb";
import ProfileDropdown from "@/components/dashboard/profile-dropdown";

interface props {
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarMinimized: boolean;
}

const DashboardNavbar: React.FC<props> = ({
  setIsSheetOpen,
  setIsSidebarMinimized,
  isSidebarMinimized,
}) => {
  return (
    <main className="h-[64px] transition-all duration-300 top-0 sticky bg-white flex flex-row-reverse sm:flex-row items-center justify-between px-[1rem] w-full z-40">
      <section className="sm:flex items-center space-x-4 hidden">
        <Button
          variant="ghost"
          className={`xl:hidden p-0 hover:bg-inherit cursor-pointer`}
          onClick={() => setIsSheetOpen(true)}
        >
          <Icon icon={"iconamoon:menu-burger-horizontal"} fontSize={24} />
        </Button>
        <button
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
          className="bg-[#F5F6FA] p-1.5 rounded-md text-gray-700 hidden xl:flex cursor-pointer"
        >
          <Icon icon="material-symbols:legend-toggle-rounded" fontSize={21} />
        </button>
        <BreadCrumb />
      </section>
      <section className="hidden sm:flex  gap-x-4 items-center">
        <LanguageToggle />
        <ProfileDropdown />
      </section>
      <div className="sm:hidden flex items-center">
        <img src="/uzaforms-logo-small.svg" alt="logo" className="w-[50px]" />
        <BreadCrumb />
      </div>
    </main>
  );
};

export default DashboardNavbar;
