import React, {useContext} from "react";
import { Box, IconButton, AppBar, Toolbar, Menu, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material"
import { TopBarProps } from "./type";
import { UserContext } from "module/BasePage/AuthGuard";
import { useRouter } from "next/router";

export const TopBar = ({drawerWidth, title}: TopBarProps) => {
  const header = title || 'Ayolinx';
  const user = useContext(UserContext);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login')
  };

  const handleLog = () => {
    router.push('/admin-log')
  };

  const userGreeting = `welcome, ${user?.name ?? ''}`

  return (
    <AppBar 
      position="sticky"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
          {header}
        </Typography>
        
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }} component="div">
              {userGreeting}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleLog}>Admin Log</MenuItem>
          </Menu>  
        </Box>
      </Toolbar>
    </AppBar>
  )
}