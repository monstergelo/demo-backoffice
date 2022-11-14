
import React, { createContext } from "react";
import { Box, Toolbar } from "@mui/material";
import { BasicLayoutProps } from "./type";
import logo from '/public/logoipsum.svg'
import SideBar from "./SideBar";
import { TopBar } from "./TopBar";
import BreadCrumbLine from "reusables/BreadcrumbLine";

export const BasicLayoutContext = createContext({
  refreshSidebar: () => {},
})

const BasicLayout = ({ children, title, breadcrumb }: BasicLayoutProps) => {
  const [manualRefreshSidebar, setRefreshSidebar] = React.useState(0);
  const refreshSidebar = () => {
    setRefreshSidebar((prev) => prev + 1);
  }

  const drawerWidth = 240;

  const contextValue = {
    refreshSidebar
  }

  return (
    <Box sx={{overflow: 'auto', backgroundColor: 'white'}}>
      <TopBar drawerWidth={drawerWidth} title={title} />
      <SideBar logo={logo?.src} drawerWidth={drawerWidth} refreshSidebar={manualRefreshSidebar} />

      <Box sx={{
        margin: `20px 20px 0 ${drawerWidth + 20}px`,
      }}>
        <Toolbar>
          <BreadCrumbLine items={breadcrumb}/>
        </Toolbar>
        
        <BasicLayoutContext.Provider value={contextValue}>
          {children}
        </BasicLayoutContext.Provider>
      </Box>
    </Box>
  );
};

export default BasicLayout;
