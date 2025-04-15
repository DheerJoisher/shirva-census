import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
    familyId: '',
    avatar: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get the current authenticated user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not authenticated
          navigate('/signin');
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch user profile data from the users table joined with residents
        const { data: userData, error } = await supabase
          .from('users')
          .select(`
            user_id,
            email,
            phone_number,
            residents (
              resident_id,
              first_name,
              middle_name,
              last_name,
              phone_number,
              household_id
            ),
            household:residents.household_id (
              household_id
            )
          `)
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
        
        if (userData && userData.residents) {
          const resident = userData.residents;
          const fullName = [resident.first_name, resident.middle_name, resident.last_name]
            .filter(Boolean)
            .join(' ');
            
          setUser({
            name: fullName,
            familyId: userData.household?.household_id || 'N/A',
            email: userData.email,
            phone: resident.phone_number || userData.phone_number,
            // Generate avatar URL if you have one, or use null for fallback initials
            avatar: null
          });
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const pages = [
    { name: 'Dashboard', link: '/user/dashboard', icon: <DashboardIcon /> },
    { name: 'Add Member', link: '/user/add-member', icon: <PersonAddIcon /> },
  ];
  
  const settings = [
    { name: 'Account Settings', link: '/user/settings', icon: <SettingsIcon />, action: () => {} },
    { name: 'Family Settings', link: '/user/family-settings', icon: <FamilyRestroomIcon />, action: () => {} },
    { name: 'Logout', link: '#', icon: <LogoutIcon />, action: handleLogout }
  ];
  
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setMobileDrawerOpen(false)}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{user.name.split(' ').map(n => n[0]).join('')}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">Family ID: {user.familyId}</Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem button key={page.name} component={Link} to={page.link}>
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settings.map((setting) => (
          <ListItem button key={setting.name} component={Link} to={setting.link}>
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <ListItemText primary={setting.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/user/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHIRVA CENSUS
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/user/dashboard"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHIRVA CENSUS
          </Typography>
          
          {/* Navigation links for desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.link}
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
                startIcon={page.icon}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={user.name} 
                  src={user.avatar}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  {user.name && user.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">{user.name || 'Loading...'}</Typography>
                <Typography variant="caption" color="text.secondary">Family ID: {user.familyId || 'Loading...'}</Typography>
                {user.email && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
              </Box>
              <Divider />
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={() => {
                    handleCloseUserMenu();
                    setting.action();
                  }} 
                  component={setting.link !== '#' ? Link : 'li'} 
                  to={setting.link !== '#' ? setting.link : undefined}
                >
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
