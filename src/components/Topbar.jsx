// components/Topbar.js
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleDrawer, sidebarWidth = 260, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleProfileMenu = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);
  
  const handleLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      handleClose();
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  }, [logout, navigate, handleClose]);

  // User information
  const userInitials = useMemo(() => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return 'User';
    return user.firstName || 'User';
  }, [user]);

  const userRole = useMemo(() => {
    if (!user?.role) return 'User';
    const roleMap = {
      Head_office: 'Head Office',
      ZSM: 'Zonal Manager',
      ASM: 'Area Manager',
      TEAM: 'Field Executive'
    };
    return roleMap[user.role] || 'User';
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
          width: '100%',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          height: 64,
          px: { xs: 2, sm: 3 },
        }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton 
                onClick={toggleDrawer} 
                sx={{ 
                  color: '#4569ea',
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
                fontSize: '1.25rem',
              }}
            >
              Dashboard
            </Typography>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Notifications */}
            <IconButton
              onClick={handleProfileMenu}
              sx={{
                color: '#666666',
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
                  width: 36,
                  height: 36,
                  fontSize: '0.9rem',
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
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  color: '#333333'
                }}
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
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  color: '#333333'
                }}
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
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                }}
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