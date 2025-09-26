import type { ReactNode } from 'react';
import type { User } from './user.types';
import type { NavItem } from './navigation.types';

// Auth Provider Types
export interface AuthProviderProps {
  children: ReactNode;
}

// Position Form Types
export interface PositionFormProps {
  initialData: {
    userId: string;
    title: string;
  };
  onSubmit: (data: { userId: string; title: string }) => void;
  onCancel: () => void;
}

export interface PositionFormUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Sidebar Navigation Types
export interface SidebarNavigationProps {
  filteredNavItems: NavItem[];
  expandedItem: string | undefined;
  setExpandedItem: (value: string | undefined) => void;
  isSidebarMinimized: boolean;
  pathName: string;
  onNavItemClick: (itemName: string) => void;
}

// UI Component Types
export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  label?: string;
  className?: string;
  labelClassName?: string;
}

// Settings Component Types
export interface UserRoleDataForModal {
  name: string;
  roleDescription: string;
  status: 'ENABLED' | 'DISABLED';
  createdAt?: Date;
  updatedAt?: string;
}

export interface UserEditModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
}

// Organization Chart Types
export interface TreeNodeProps {
  node: any; // Position type - will be imported from organization service
  level: number;
}