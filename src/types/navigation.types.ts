export interface NavItem {
  name: string;
  href?: string;
  icon?: string;
  roles?: string[];
  subItems?: NavItem[];
}
