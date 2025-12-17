import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Container, Grid } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Business, AccountBalanceWallet, LocalShipping, People, Engineering, Assessment, Notifications } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const MainLayout = ({ children, userRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Define menu items based on user role
  const getMenuItems = (role) => {
    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Projects', icon: <Business />, path: '/projects' },
      { text: 'Reports', icon: <Assessment />, path: '/reports' },
    ];

    // Add role-specific items
    if (['gm', 'finance_manager', 'head_project_manager'].includes(role)) {
      baseItems.splice(2, 0, { text: 'Finance', icon: <AccountBalanceWallet />, path: '/finance' });
    }

    if (['gm', 'procurement_manager', 'project_manager', 'head_project_manager'].includes(role)) {
      baseItems.splice(3, 0, { text: 'Procurement', icon: <LocalShipping />, path: '/procurement' });
    }

    if (['gm', 'hr_manager', 'project_manager', 'team_leader'].includes(role)) {
      baseItems.splice(4, 0, { text: 'HR', icon: <People />, path: '/hr' });
    }

    if (['gm', 'ehs_manager', 'ehs_officer', 'project_manager'].includes(role)) {
      baseItems.splice(5, 0, { text: 'EHS', icon: <Engineering />, path: '/ehs' });
    }

    if (['gm', 'technical_manager', 'project_manager'].includes(role)) {
      baseItems.push({ text: 'Technical', icon: <Engineering />, path: '/technical' });
    }

    return baseItems;
  };

  const menuItems = getMenuItems(userRole);

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.text} onClick={() => window.location.href = item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Construction ERP
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 2 }}>
            Welcome, {userRole}
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;