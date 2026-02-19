// components/Topbar.jsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  Badge,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleDrawer, isMobile, drawerOpen, sidebarWidth = 280 }) => {
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Mock user data (replace with actual auth context)
  const user = {
    firstName: "John",
    lastName: "Doe",
    role: "Head_office"
  };

  const handleProfileMenu = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleNotificationMenu = useCallback((event) => setNotificationAnchor(event.currentTarget), []);
  
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  }, []);
  
  const handleLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      handleClose();
      // Add logout logic here
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  }, [navigate, handleClose]);

  // User information
  const userInitials = useMemo(() => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  }, [user]);

  const displayName = useMemo(() => {
    return user?.firstName || 'User';
  }, [user]);

  const userRole = useMemo(() => {
    const roleMap = {
      Head_office: 'Head Office',
      ZSM: 'Zonal Manager',
      ASM: 'Area Manager',
      TEAM: 'Field Executive'
    };
    return roleMap[user?.role] || 'User';
  }, [user]);

  const notifications = [
    { id: 1, title: 'New lead assigned', time: '5 min ago', read: false },
    { id: 2, title: 'Installation completed', time: '1 hour ago', read: true },
    { id: 3, title: 'Payment received', time: '2 hours ago', read: true },
  ];

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          width: isMobile ? "100%" : "82%",
          zIndex: 1200,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          minHeight: 64,
          px: { xs: 1.5, sm: 2, md: 3 },
        }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {isMobile && (
              <IconButton 
                onClick={toggleDrawer} 
                sx={{ 
                  color: '#4569ea',
                  '&:hover': { bgcolor: alpha('#4569ea', 0.1) },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#333333',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                display: { xs: isMobile ? 'none' : 'block', sm: 'block' },
              }}
            >
              Dashboard
            </Typography>

            {/* Search Bar - Hidden on mobile */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                width: 300,
                ml: 4,
                border: '1px solid #e0e0e0',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              <SearchIcon sx={{ color: '#999', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search..."
                sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  '& input::placeholder': { color: '#999', opacity: 1 },
                }}
              />
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Mobile Search Icon */}
            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#666',
                '&:hover': { bgcolor: alpha('#4569ea', 0.05) },
              }}
            >
              <SearchIcon />
            </IconButton>

            {/* Notifications */}
            <IconButton
              onClick={handleNotificationMenu}
              sx={{
                color: '#666',
                '&:hover': { bgcolor: alpha('#4569ea', 0.05) },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Profile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '8px',
                '&:hover': { bgcolor: alpha('#4569ea', 0.05) },
              }}
              onClick={handleProfileMenu}
            >
              <Avatar
                sx={{
                  bgcolor: '#4569ea',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  fontSize="0.9rem"
                  fontWeight={500}
                  color="#333333"
                  sx={{ lineHeight: 1.2 }}
                >
                  {displayName}
                </Typography>
                <Typography 
                  fontSize="0.75rem" 
                  color="#666666"
                  sx={{ lineHeight: 1.2 }}
                >
                  {userRole}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleClose}
          PaperProps={{ 
            sx: { 
              width: 320,
              mt: 1,
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              maxHeight: 400,
            } 
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography fontWeight={600} color="#333333">Notifications</Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleClose}
              sx={{ 
                py: 1.5, 
                px: 2,
                bgcolor: !notification.read ? alpha('#4569ea', 0.05) : 'transparent',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500} color="#333333">
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="#999">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ 
            sx: { 
              width: 240,
              mt: 1,
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            } 
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#4569ea',
                  color: '#ffffff',
                  width: 40,
                  height: 40,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {userInitials}
              </Avatar>
              <Box>
                <Typography fontWeight={600} fontSize="0.9rem" color="#333333">
                  {displayName}
                </Typography>
                <Typography fontSize="0.75rem" color="#666666">
                  {userRole}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Menu Items */}
          <Box sx={{ py: 0.5 }}>
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                py: 1.25, 
                px: 2,
                '&:hover': { bgcolor: alpha('#4569ea', 0.05) }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#666666' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{ fontSize: '0.9rem', color: '#333333' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                py: 1.25, 
                px: 2,
                '&:hover': { bgcolor: alpha('#4569ea', 0.05) }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#666666' }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ fontSize: '0.9rem', color: '#333333' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                py: 1.25, 
                px: 2,
                color: '#ff4444',
                '&:hover': { bgcolor: alpha('#ff4444', 0.05) }
              }}
              disabled={loggingOut}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={loggingOut ? "Logging out..." : "Logout"} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </MenuItem>
          </Box>
        </Menu>
      </AppBar>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: 64 }} />
    </>
  );
};

export default Topbar;