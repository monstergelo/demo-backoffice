import { Box, Divider, Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Toolbar } from "@mui/material";
import Image from "next/image";
import { SideBarProps } from './type';
import { getNav } from "./nav";
import { useFetch } from "module/BasePage";
import React, { useEffect } from "react";
import NextLink from "reusables/NextLink";

const SideBar = ({drawerWidth, logo, refreshSidebar}: SideBarProps) => {
  const [list, setList] = React.useState([])
  const { get } = useFetch();
  
  const navs = getNav(list)

  useEffect(() => {
    const getPermission = async () => {
      const response = await get(`/role/self`);
      setList(response?.permissions ?? [])
    }
    getPermission();
  }, [get, refreshSidebar])

  return (
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box display="flex" justifyContent="center">
          <Image 
            src={logo}
            width="120"
            height="120"
            alt="logo"
          />
        </Box>
        <Divider />
        <List>
          {navs.map((nav) => (
            <NextLink 
              href={{
                pathname: nav?.link
              }}
              key={nav?.label}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <nav.logo />
                  </ListItemIcon>
                  <ListItemText primary={nav?.label} />
                </ListItemButton>
              </ListItem>
            </NextLink>
          ))}
        </List>
      </Drawer>
  )
}

export default SideBar;