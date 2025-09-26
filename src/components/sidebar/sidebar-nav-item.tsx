import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import type { NavItem } from '@/types';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  isSidebarMinimized: boolean;
  onNavItemClick: (itemName: string) => void;
  pathName: string;
}

export function SidebarNavItem({
  item,
  isActive,
  isExpanded,
  isSidebarMinimized,
  onNavItemClick,
  pathName
}: SidebarNavItemProps) {
  if (item.subItems) {
    return (
      <AccordionItem key={item.name} value={item.name} className='border-none'>
        <AccordionTrigger
          className={`text-base transition duration-300 hover:bg-[#E5EDFF] hover:text-primary h-[48px] px-6 rounded text-[#494C52] w-full flex items-center justify-between gap-2 font-normal ${isActive ? 'bg-[#E5EDFF] text-primary border-l-[2.4px] border-primary relative' : ''}`}
          onClick={() => onNavItemClick(item.name)}
        >
          <div className={`flex items-center gap-2 ${isSidebarMinimized ? "absolute w-full z-50" : ""}`}>
            <Icon icon={item.icon as string} fontSize={24} />
            {!isSidebarMinimized && item.name}
          </div>
        </AccordionTrigger>
        {!isSidebarMinimized && isExpanded && (
          <AccordionContent className=''>
            <ol className='relative flex mt-4 w-full transition duration-300 ml-14'>
              <div className='w-[2px] bg-inherit py-2'>
                <div className='w-full h-full bg-primary'></div>
              </div>
              <div>
                {item.subItems.map((subItem, index) => {
                  const isSubItemActive = pathName === subItem.href;
                  const isLastSubItem = index === item.subItems!.length - 1;
                  return (
                    <li key={subItem.name} className={`${!isLastSubItem ? 'mb-4' : ''}`}>
                      <div className={`absolute w-[10px] h-[10px] rounded-full mt-1.5 -start-1 border border-white bg-primary`}></div>
                      <Link to={subItem.href!} className={`text-sm transition duration-300 hover:text-primary ml-3 -mt-2 ${isSubItemActive ? 'text-primary' : 'text-[#494C52]'}`}>
                        {subItem.name}
                      </Link>
                    </li>
                  );
                })}
              </div>
            </ol>
          </AccordionContent>
        )}
      </AccordionItem>
    );
  } else {
    return (
      <Link to={item.href!} key={item.name} className={`text-base transition duration-300 hover:bg-[#E5EDFF] hover:text-primary h-[48px] px-6 rounded text-[#494C52] w-full flex items-center justify-between gap-2 font-normal ${isActive ? 'bg-[#E5EDFF] text-primary border-l-[2.4px] border-primary relative' : ''}`}>
        <div className={`flex items-center gap-2 ${isSidebarMinimized ? "absolute w-full z-50" : ""}`}>
          <Icon icon={item.icon as string} fontSize={24} />
          {!isSidebarMinimized && item.name}
        </div>
      </Link>
    );
  }
}
