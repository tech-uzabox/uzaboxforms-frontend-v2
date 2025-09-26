import type { NavItem } from '@/types';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbStore } from '@/store/ui';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { SidebarLogo, SidebarNavigation, getNavItems } from '@/components/sidebar';

interface Props {
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSidebar: React.FC<Props> = ({ isSidebarMinimized, setIsSidebarMinimized }) => {
  const { t } = useTranslation();
  const { roles } = useAuthStore();
  const { setBreadcrumbItems, isCustomOverride } = useBreadcrumbStore();
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  const pathName = useLocation().pathname;
  const [expandedItem, setExpandedItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    const navItems = getNavItems(t);
    const filteredNavItems = navItems
      .filter(item =>
        item.roles?.some(name =>
          roles?.some((role: string) => role === name)
        )
      )
      .map(item => ({
        ...item,
        subItems: item.subItems?.filter(subItem =>
          subItem.roles?.some(name =>
            roles?.some((role: string) => role === name)
          ) || !subItem.roles
        )
      }))
      .filter(item => !item.subItems || item.subItems.length > 0);
    setFilteredNavItems(filteredNavItems);
  }, [roles, t]);

  useEffect(() => {
    // Don't set breadcrumbs if there's a custom override active
    if (isCustomOverride) {
      return;
    }

    const breadcrumbItems: { name: string; href: string }[] = [];
    for (const item of filteredNavItems) {
      if (item.href && pathName === item.href) {
        breadcrumbItems.push({ name: item.name, href: item.href });
      } else if (item.subItems) {
        const subItem = item.subItems.find(sub => pathName.startsWith(sub.href!));
        if (subItem) {
          breadcrumbItems.push({ name: item.name, href: subItem.href || '' });
          breadcrumbItems.push({ name: subItem.name, href: subItem.href! });
          break;
        }
      }
    }
    setBreadcrumbItems(breadcrumbItems);
    if (breadcrumbItems.length === 0) {
      setBreadcrumbItems([{ name: t('sidebar.home'), href: '/' }]);
    }
  }, [pathName, filteredNavItems, setBreadcrumbItems, t, isCustomOverride]);

  const handleNavItemClick = (itemName: string) => {
    if (isSidebarMinimized) {
      setIsSidebarMinimized(false);
      setExpandedItem(itemName);
    } else {
      setExpandedItem(expandedItem === itemName ? undefined : itemName);
    }
  };

  return (
    <main className={`bg-white h-full w-full pl-[1rem] pt-[2rem] pb-[4rem] min-w-[264px] ${isSidebarMinimized ? "pl-[0.5rem] pt-[1rem]" : "pl-[1rem] pt-[2rem]"}`}>
      <SidebarLogo isSidebarMinimized={isSidebarMinimized} />
      <SidebarNavigation
        filteredNavItems={filteredNavItems}
        expandedItem={expandedItem}
        setExpandedItem={setExpandedItem}
        isSidebarMinimized={isSidebarMinimized}
        pathName={pathName}
        onNavItemClick={handleNavItemClick}
      />
    </main>
  );
};

export default DashboardSidebar;
