import { BreadcrumbItemProps } from "reusables/types";

export interface BasicLayoutProps {
  children: JSX.Element;
  title: string;
  breadcrumb?: BreadcrumbItemProps[];
}

export interface SideBarProps {
  drawerWidth: number;
  logo: string;
  refreshSidebar: number;
}

export interface TopBarProps {
  drawerWidth: number;
  title: string;
}