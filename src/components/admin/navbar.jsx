import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box, 
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Approvals', path: '/admin/approvals', icon: <CheckCircleIcon /> },
    { text: 'Residents', path: '/admin/residents', icon: <PeopleIcon /> },
    { text: 'Analytics', path: '/admin/analytics', icon: <BarChartIcon /> },
  ];

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Shirva Census Admin
        </Typography>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem 
            button 
            component={Link} 
            to={link.path} 
            key={link.text}
            onClick={handleDrawerToggle}
            selected={isActiveLink(link.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
              },
              '&.Mui-selected .MuiListItemIcon-root': {
                color: 'primary.main',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActiveLink(link.path) ? 'primary.main' : 'inherit',
              }}
            >{link.icon}</ListItemIcon>
            <ListItemText 
              primary={link.text} 
              primaryTypographyProps={{
                fontWeight: isActiveLink(link.path) ? 'bold' : 'normal',
                color: isActiveLink(link.path) ? 'primary.main' : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component={Link} to="/admin/dashboard" sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}>
            Shirva Census Admin
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navLinks.map((link) => (
                <Typography 
                  key={link.text} 
                  component={Link} 
                  to={link.path} 
                  sx={{ 
                    textDecoration: 'none',
                    color: isActiveLink(link.path) ? 'primary.main' : 'inherit',
                    fontWeight: isActiveLink(link.path) ? 700 : 500,
                    position: 'relative',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    '&::after': isActiveLink(link.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      backgroundColor: 'primary.main',
                    } : {}
                  }}
                >
                  {link.text}
                </Typography>
              ))}
            </Box>
          )}

          <IconButton onClick={handleProfileClick}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose} component={Link} to="/admin/profile">
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} component={Link} to="/signin">
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
