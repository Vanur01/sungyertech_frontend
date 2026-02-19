// layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import '../MainLayout.css';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = 280;
  const collapsedWidth = 70;

  // Handle responsive behavior
  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(true);
      setMobileOpen(false);
    } else {
      setDrawerOpen(false);
      setMobileOpen(false);
    }
  }, [isMobile]);

  const toggleDrawer = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen(!drawerOpen);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Topbar Component */}
      <Topbar 
        toggleDrawer={toggleDrawer} 
        isMobile={isMobile} 
        drawerOpen={isMobile ? mobileOpen : drawerOpen}
        sidebarWidth={sidebarWidth}
      />
      
      {/* Sidebar Component */}
      <Sidebar
        open={isMobile ? mobileOpen : drawerOpen}
        toggleDrawer={toggleDrawer}
        onClose={handleDrawerClose}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: {
            xs: 0,
            md: drawerOpen ? `${sidebarWidth}px` : `${collapsedWidth}px`,
          },
          width: {
            xs: "100%",
            md: drawerOpen ? `calc(100% - ${sidebarWidth}px)` : `calc(100% - ${collapsedWidth}px)`,
          },
          pt: {
            xs: "64px", // Topbar height
          },
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
        }}
      >
        {/* Content Wrapper */}
        <Box
          className="main-content-wrapper"
          sx={{
            width: "100%",
            minHeight: "calc(100vh - 64px)",
            p: {
              xs: 1.5,      // mobile
              sm: 2,        // tablet
              md: 2.5,      // desktop
              lg: 3,        // large desktop
            },
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "1600px",
              xl: "1800px",
            },
            margin: "0 auto",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderRadius: {
              xs: 0,
              sm: "12px",
              md: "16px",
            },
            transition: "all 0.3s ease",
            mx: {
              xs: 0,
              sm: 2,
              md: 3,
            },
            my: {
              xs: 0,
              sm: 2,
              md: 3,
            },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Overlay for mobile when drawer is open */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            backdropFilter: "blur(4px)",
            transition: "opacity 0.3s ease",
          }}
          onClick={handleDrawerClose}
        />
      )}
    </Box>
  );
};

export default MainLayout;