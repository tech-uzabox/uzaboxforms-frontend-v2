import { Link } from "react-router-dom";
import { useState, type JSX } from "react";
import { useTranslation } from 'react-i18next';
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, _setIsClient] = useState(true);
    const [isSidebar, setIsSidebar] = useState(true);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

    return (
        <main className="flex h-screen max-w-[100rem] bg-subprimary overflow-x-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            {
                isSidebar && (
                    <section className={`transition-all duration-300 sticky top-0 hidden xl:block ${isSidebarMinimized ? "w-[80px]" : "w-[280px]"} h-full bg-white overflow-y-auto`}>
                        <DashboardSidebar setIsSidebarMinimized={setIsSidebarMinimized} setIsSheetOpen={setIsOpen} isSidebarMinimized={isSidebarMinimized} />
                    </section>
                )
            }
            {isClient && (
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTitle></SheetTitle>
                    <SheetContent aria-describedby={undefined} side={"left"} className="px-0 w-[280px] h-full overflow-y-auto">
                        <DashboardSidebar setIsSidebarMinimized={setIsSidebarMinimized} setIsSheetOpen={setIsOpen} isSidebarMinimized={isSidebarMinimized} />
                    </SheetContent>
                </Sheet>
            )}
            <section className="flex-1 flex flex-col gap-3 py-3 px-2 sm:px-0 sm:pl-3 max-w-full relative overflow-x-hidden">
                <DashboardNavbar setIsSheetOpen={setIsOpen} setIsSidebarOpen={setIsSidebar} isSidebarOpen={isSidebar} setIsSidebarMinimized={setIsSidebarMinimized} isSidebarMinimized={isSidebarMinimized} />
                <div className="flex-1 bg-white overflow-y-auto relative mb-6 p-2 xs:p-3 sm:p-4 lg:px-8">
                    {children}
                </div>
                <footer className="absolute bottom-0 w-full py-2 text-center z-40 bg-white text-sm text-[#494C52]">{t('processManagement.copyright')} &copy; <Link to="https://uzabox.com" className="">Uzabox</Link> {new Date().getFullYear()} | {t('processManagement.allRightsReserved')}</footer>
            </section>
        </main>
    );
}

export default DashboardLayout;