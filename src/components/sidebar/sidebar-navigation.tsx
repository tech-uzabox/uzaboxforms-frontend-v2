import type { NavItem } from '@/types';
import { SidebarNavigationProps } from '@/types';
import { SidebarNavItem } from "./sidebar-nav-item";
import { Accordion } from "@/components/ui/accordion";

export function SidebarNavigation({
  filteredNavItems,
  expandedItem,
  setExpandedItem,
  isSidebarMinimized,
  pathName,
  onNavItemClick
}: SidebarNavigationProps) {
  const renderNavItem = (item: NavItem) => {
    const isActive = Boolean(
      pathName === item.href || 
      item.subItems?.some(subItem => pathName.startsWith(subItem.href!)) || 
      (item.href && item.href !== '/' && pathName.includes(item.href as string))
    );
    const isExpanded = expandedItem === item.name;

    return (
      <SidebarNavItem
        key={item.name}
        item={item}
        isActive={isActive}
        isExpanded={isExpanded}
        isSidebarMinimized={isSidebarMinimized}
        onNavItemClick={onNavItemClick}
        pathName={pathName}
      />
    );
  };

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full mt-12 space-y-2" 
      value={expandedItem || ""} 
      onValueChange={setExpandedItem}
    >
      {filteredNavItems.map(renderNavItem)}
    </Accordion>
  );
}
