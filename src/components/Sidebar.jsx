// components/Sidebar.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  SwipeableDrawer,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Avatar,
  Badge,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  Groups,
  PersonAdd,
  AccountBalance,
  Description,
  ReceiptLong,
  TaskAlt,
  Warning,
  CloudUpload,
  CalendarMonth,
  FilterAlt,
  Paid,
  TrendingUp,
  Settings,
  Person,
  Logout,
  ChevronLeft,
  ChevronRight,
  Home,
  Download,
  Upload,
  Analytics,
  AdminPanelSettings,
  PendingActions,
  CreditCard,
  Assessment,
  Lightbulb,
  SolarPower,
  Business,
  LocationCity,
  GroupWork,
  Insights,
  Summarize,
  AccountTree,
  Speed,
  Report,
  AttachMoney,
  Timeline,
  PieChart,
  ShowChart,
  PeopleAlt,
  SupervisorAccount,
  WorkspacePremium,
  Security,
  VerifiedUser,
  ViewModule,
  FolderOpen,
  Checklist,
  PlaylistAddCheck,
  Cancel,
  CloudDownload,
  AccountCircle,
  HowToReg,
  AccountBalanceWallet,
  Build,
  Engineering,
  HomeWork,
  School,
  Factory,
  Agriculture,
  LocalPolice,
  LocalHospital,
  Storefront,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../logo.png";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

// Color Constants
const PRIMARY_COLOR = "#4569ea";
const PRIMARY_LIGHT = "#5c7cec";
const PRIMARY_DARK = "#3a5ac8";
const BACKGROUND_COLOR = "#4569ea";
const TEXT_COLOR = "#ffffff";
const ICON_COLOR = "#ffffff";
const HOVER_BG = "rgba(255, 255, 255, 0.15)";
const ACTIVE_BG = "rgba(255, 255, 255, 0.25)";
const BORDER_COLOR = "rgba(255, 255, 255, 0.25)";

// Constants
const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 70;
const MIN_SWIPE_DISTANCE = 50;

// Enhanced icons mapping
const ICON_MAPPING = {
  "Dashboard": <Dashboard />,
  "Total Visits": <Groups />,
  "Registration": <PersonAdd />,
  "Bank Loan Apply": <AccountBalance />,
  "Document": <Description />,
  "Bank at Pending": <PendingActions />,
  "Disbursement": <ReceiptLong />,
  "Installation": <TaskAlt />,
  "Missed Leads": <Warning />,
  "Import Leads": <CloudUpload />,
  "Attendance": <CalendarMonth />,
  "All Leads": <FilterAlt />,
  "Lead Funnel": <AccountTree />,
  "Expense": <Paid />,
  "User Management": <AdminPanelSettings />,
  "Reports": <Insights />,
};

const Sidebar = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuContentRef = useRef(null);

  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [activeItem, setActiveItem] = useState("");

  // Save collapsed state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Update active item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveItem(currentPath);
  }, [location.pathname]);

  // Handle scroll on mobile
  const handleMenuScroll = useCallback(
    (e) => {
      if (!isMobile) return;

      const scrollTop = e.target.scrollTop;
      setScrollTop(scrollTop);
      setScrolled(scrollTop > 10);
    },
    [isMobile],
  );

  // Role-based configurations
  const roleConfig = useMemo(() => {
    const config = {
      Head_office: {
        label: "Head Office",
        icon: <WorkspacePremium sx={{ fontSize: 20, color: TEXT_COLOR }} />,
        color: "#ff6d00",
        badgeColor: "warning",
      },
      ZSM: {
        label: "Zonal Manager",
        icon: <SupervisorAccount sx={{ fontSize: 20, color: TEXT_COLOR }} />,
        color: "#1a237e",
        badgeColor: "primary",
      },
      ASM: {
        label: "Area Manager",
        icon: <PeopleAlt sx={{ fontSize: 20, color: TEXT_COLOR }} />,
        color: "#2e7d32",
        badgeColor: "success",
      },
      TEAM: {
        label: "Field Executive",
        icon: <Engineering sx={{ fontSize: 20, color: TEXT_COLOR }} />,
        color: "#6a1b9a",
        badgeColor: "secondary",
      },
    };

    return (
      config[user?.role] || {
        label: "User",
        icon: <Person sx={{ fontSize: 20, color: TEXT_COLOR }} />,
        color: "#666",
        badgeColor: "default",
      }
    );
  }, [user]);

  // Role-based menu permissions
  const hasPermission = useCallback(
    (requiredRoles) => {
      if (!user?.role) return false;
      return requiredRoles.includes(user.role);
    },
    [user],
  );

  const menuItems = useMemo(() => {
    const allItems = [
      {
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/dashboard",
        exact: true,
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Total Visits",
        icon: <Groups />,
        path: "/total-visits",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Registration",
        icon: <PersonAdd />,
        path: "/registration",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Bank Loan",
        icon: <AccountBalance />,
        path: "/bank-loan-apply",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Document",
        icon: <Description />,
        path: "/document-submission",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Loan Pending",
        icon: <PendingActions />,
        path: "/bank-at-pending",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Disbursement",
        icon: <ReceiptLong />,
        path: "/disbursement",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Installation",
        icon: <TaskAlt />,
        path: "/installation-completion",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Missed Leads",
        icon: <Warning />,
        path: "/missed-leads",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Import Leads",
        icon: <CloudUpload />,
        path: "/import-leads",
        roles: ["Head_office", "ZSM"],
      },
      {
        text: "Attendance",
        icon: <CalendarMonth />,
        path: "/attendance",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Visitors",
        icon: <PeopleAltIcon />,
        path: "/visitors",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "All Leads",
        icon: <FilterAlt />,
        path: "/all-leads",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Lead Funnel",
        icon: <AccountTree />,
        path: "/lead-funnel",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Expense",
        icon: <Paid />,
        path: "/expense",
        roles: ["Head_office", "ZSM", "ASM", "TEAM"],
      },
      {
        text: "Users",
        icon: <AdminPanelSettings />,
        path: "/user-management",
        roles: ["Head_office", "ZSM", "ASM"],
      },
      {
        text: "Reports",
        icon: <Insights />,
        path: "/reports",
        roles: ["Head_office", "ZSM", "ASM"],
      },
    ];

    // Filter items based on user role
    return allItems.filter((item) => hasPermission(item.roles));
  }, [hasPermission]);

  // Check if item is active
  const isActive = useCallback(
    (path, exact = false) => {
      if (exact) {
        return activeItem === path;
      }
      return activeItem.startsWith(path);
    },
    [activeItem],
  );

  // Navigation handler
  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      if (isMobile) {
        toggleDrawer();
      }
    },
    [navigate, isMobile, toggleDrawer],
  );

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback(
    (e) => {
      if (isMobile) {
        setTouchStart(e.targetTouches[0].clientX);
      }
    },
    [isMobile],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (isMobile && touchStart !== null) {
        setTouchEnd(e.targetTouches[0].clientX);
      }
    },
    [isMobile, touchStart],
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !isMobile) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;

    if (isLeftSwipe && open) {
      toggleDrawer();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isMobile, open, toggleDrawer]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user?.firstName && !user?.lastName) return "U";
    return `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase();
  }, [user]);

  // Get user full name
  const getUserFullName = useCallback(() => {
    if (!user?.firstName && !user?.lastName) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }, [user]);

  // Render menu item with enhanced design
  const renderMenuItem = useCallback(
    (item) => {
      const active = isActive(item.path, item.exact);
      const bgColor = active ? ACTIVE_BG : "transparent";
      const textColor = TEXT_COLOR;
      const hoverBgColor = HOVER_BG;

      const iconWithBadge = item.badge ? (
        <Badge
          color="error"
          variant="dot"
          sx={{
            "& .MuiBadge-dot": {
              right: 2,
              top: 2,
            },
          }}
        >
          {ICON_MAPPING[item.text] || item.icon}
        </Badge>
      ) : (
        ICON_MAPPING[item.text] || item.icon
      );

      if (!isCollapsed || isMobile) {
        return (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            sx={{
              pl: 2,
              borderRadius: "12px",
              mx: 1,
              my: 0.5,
              bgcolor: bgColor,
              color: textColor,
              "&:hover": {
                bgcolor: hoverBgColor,
                transform: "translateX(4px)",
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
              },
              py: 1.5,
              px: 2,
              border: active
                ? `2px solid rgba(255, 255, 255, 0.4)`
                : "2px solid transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              minHeight: 52,
              boxShadow: active
                ? "0 8px 25px rgba(255, 255, 255, 0.2)"
                : "none",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              "&::before": active
                ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "5px",
                    background: "linear-gradient(180deg, #5c7cec 0%, #3a5ac8 100%)",
                    borderRadius: "0 4px 4px 0",
                  }
                : {},
              "&::after": active
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(92, 124, 236, 0.1) 0%, rgba(58, 90, 200, 0.1) 100%)",
                  }
                : {},
            }}
          >
            <ListItemIcon sx={{ minWidth: 42, mr: 2.5 }}>
              {React.cloneElement(iconWithBadge, {
                sx: {
                  fontSize: 24,
                  color: ICON_COLOR,
                  opacity: active ? 1 : 0.85,
                  filter: active ? "drop-shadow(0 2px 4px rgba(255,255,255,0.3))" : "none",
                },
              })}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: active ? 700 : 600,
                color: textColor,
                letterSpacing: "0.2px",
                textShadow: active ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
              }}
            />
            {active && (
              <Box
                sx={{
                  position: "absolute",
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    animation: "pulse 1.5s infinite 0.2s",
                  }}
                />
                <Box
                  sx={{
                    width: 2,
                    height: 2,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                    animation: "pulse 1.5s infinite 0.4s",
                  }}
                />
              </Box>
            )}
          </ListItemButton>
        );
      }

      return (
        <Tooltip key={item.path} title={item.text} placement="right" arrow>
          <ListItemButton
            onClick={() => handleNavigate(item.path)}
            sx={{
              justifyContent: "center",
              borderRadius: "12px",
              my: 0.5,
              bgcolor: bgColor,
              "&:hover": {
                bgcolor: hoverBgColor,
                transform: "scale(1.15)",
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
              },
              p: 1.5,
              minHeight: 52,
              minWidth: 52,
              border: active
                ? `2px solid rgba(255, 255, 255, 0.4)`
                : "2px solid transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              backdropFilter: "blur(10px)",
            }}
          >
            <ListItemIcon sx={{ justifyContent: "center", minWidth: "auto" }}>
              {React.cloneElement(iconWithBadge, {
                sx: {
                  fontSize: 18,
                  color: ICON_COLOR,
                  opacity: active ? 1 : 0.85,
                  filter: active ? "drop-shadow(0 2px 3px rgba(255,255,255,0.3))" : "none",
                },
              })}
            </ListItemIcon>
            {active && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 6,
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #5c7cec, #3a5ac8)",
                  boxShadow: "0 0 8px rgba(92, 124, 236, 0.8)",
                }}
              />
            )}
            {item.badge && (
              <Badge
                color="error"
                variant="dot"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  "& .MuiBadge-dot": {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                  },
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      );
    },
    [isCollapsed, isMobile, isActive, handleNavigate],
  );

  // Desktop Sidebar content
  const DesktopSidebarContent = useMemo(
    () => (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: BACKGROUND_COLOR,
          overflow: "hidden",
          width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          background: `linear-gradient(135deg, ${BACKGROUND_COLOR} 0%, ${PRIMARY_DARK} 100%)`,
          boxShadow: "inset -1px 0 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            p: isCollapsed ? 2.5 : 3.5,
            minHeight: isCollapsed ? 100 : 120,
            display: "flex",
            flexDirection: isCollapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? 0 : 2,
            cursor: "pointer",
            borderBottom: `1px solid ${BORDER_COLOR}`,
            "&:hover": {
              bgcolor: HOVER_BG,
            },
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => handleNavigate("/dashboard")}
        >
          {/* Animated background effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 50%, ${PRIMARY_LIGHT} 0%, transparent 70%)`,
              opacity: 0.2,
            }}
          />

          {/* Logo Container */}
          <Box
            sx={{
              width: isCollapsed ? 48 : 56,
              height: isCollapsed ? 48 : 56,
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.12)",
              border: `2px solid rgba(255, 255, 255, 0.3)`,
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
              transition: "all 0.3s ease",
              backdropFilter: "blur(12px)",
              zIndex: 1,
              "&:hover": {
                transform: "rotate(5deg)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <img
              src={logo}
              alt="Sunergytech Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "12px",
                filter: "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
          </Box>

          {!isCollapsed && (
            <Box sx={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={900}
                color={TEXT_COLOR}
                sx={{
                  fontSize: "1.3rem",
                  lineHeight: 1.2,
                  mb: 0.5,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #fff, #e0e7ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SunergyTech
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  display: "block",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                Solar Management
              </Typography>
            </Box>
          )}
        </Box>

        {/* Menu Content */}
        <Box
          ref={menuContentRef}
          onScroll={handleMenuScroll}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            py: 2,
            px: isCollapsed ? 1.5 : 2.5,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            },
          }}
        >
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => renderMenuItem(item)) }
          </List>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: isCollapsed ? 1.5 : 2,
            borderTop: `1px solid ${BORDER_COLOR}`,
            bgcolor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Collapse Toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: isCollapsed ? 1 : 1.5,
            }}
          >
            <Tooltip
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              arrow
            >
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                size="small"
                sx={{
                  color: TEXT_COLOR,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    transform: "rotate(180deg)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  },
                  width: 40,
                  height: 40,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: `1px solid rgba(255, 255, 255, 0.25)`,
                }}
              >
                {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Version and Logout */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: isCollapsed ? 0.5 : 1,
            }}
          >
            {!isCollapsed && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.7)",
                    display: "block",
                  }}
                >
                  v2.2.0
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  SunergyTech
                </Typography>
              </Box>
            )}
            <Tooltip
              title="Logout"
              placement={isCollapsed ? "right" : "top"}
              arrow
            >
              <IconButton
                size="small"
                onClick={logout}
                sx={{
                  color: TEXT_COLOR,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    transform: "rotate(90deg)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  width: isCollapsed ? 36 : 40,
                  height: isCollapsed ? 36 : 40,
                  border: `1px solid rgba(255, 255, 255, 0.25)`,
                }}
              >
                <Logout fontSize={isCollapsed ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    ),
    [
      theme,
      isCollapsed,
      menuItems,
      handleNavigate,
      logout,
      renderMenuItem,
      scrolled,
      handleMenuScroll,
      roleConfig,
      getUserInitials,
      getUserFullName,
    ],
  );

  // Mobile Sidebar content
  const MobileSidebarContent = useMemo(
    () => (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: BACKGROUND_COLOR,
          width: isSmallMobile ? "100vw" : SIDEBAR_WIDTH,
          position: "relative",
          background: `linear-gradient(135deg, ${BACKGROUND_COLOR} 0%, ${PRIMARY_DARK} 100%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Header */}
        <Fade in={!scrolled || scrollTop === 0}>
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              bgcolor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Animated background effect */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 30% 50%, ${PRIMARY_LIGHT} 0%, transparent 60%)`,
                opacity: 0.2,
              }}
            />

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}
            >
              {/* Mobile Logo */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  border: `2px solid rgba(255, 255, 255, 0.3)`,
                  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <img
                  src={logo}
                  alt="Sunergytech Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "12px",
                    filter: "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  color={TEXT_COLOR}
                  sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  Sunergytech
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontWeight: 600,
                    textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  Solar Management
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Mobile User Profile */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: `1px solid ${BORDER_COLOR}`,
            bgcolor: "rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            mx: 2,
            my: 2,
            borderRadius: "16px",
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: TEXT_COLOR,
              fontSize: "1.3rem",
              fontWeight: "bold",
              border: `2px solid rgba(255, 255, 255, 0.3)`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={TEXT_COLOR}
              sx={{
                fontSize: "1rem",
                mb: 0.5,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {getUserFullName()}
            </Typography>
            <Chip
              label={roleConfig.label}
              size="small"
              icon={roleConfig.icon}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: TEXT_COLOR,
                fontSize: "0.75rem",
                fontWeight: 600,
                height: 26,
                "& .MuiChip-icon": {
                  color: TEXT_COLOR,
                  fontSize: 14,
                },
                border: `1px solid rgba(255, 255, 255, 0.2)`,
              }}
            />
          </Box>
        </Box>

        {/* Mobile Menu Content */}
        <Box
          ref={menuContentRef}
          onScroll={handleMenuScroll}
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 2,
            px: 2.5,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
            },
          }}
        >
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => renderMenuItem(item))}
          </List>

          {/* Spacer for better scrolling */}
          <Box sx={{ height: 30 }} />
        </Box>

        {/* Mobile Footer */}
        <Box
          sx={{
            p: 2.5,
            borderTop: `1px solid ${BORDER_COLOR}`,
            textAlign: "center",
            flexShrink: 0,
            bgcolor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
              display: "block",
              mb: 1.5,
            }}
          >
            © 2025 Sunergytech • v2.2.0
          </Typography>
          <IconButton
            onClick={logout}
            sx={{
              color: TEXT_COLOR,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
              width: 48,
              height: 48,
              border: `1px solid rgba(255, 255, 255, 0.25)`,
            }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Box>
    ),
    [
      theme,
      menuItems,
      logout,
      renderMenuItem,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      scrolled,
      scrollTop,
      isSmallMobile,
      handleMenuScroll,
      roleConfig,
      getUserInitials,
      getUserFullName,
    ],
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "4px 0 30px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {DesktopSidebarContent}
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
          swipeAreaWidth={30}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: isSmallMobile ? "100vw" : SIDEBAR_WIDTH,
              maxWidth: "100vw",
              boxSizing: "border-box",
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "4px 0 30px rgba(0, 0, 0, 0.25)",
            },
          }}
        >
          {MobileSidebarContent}
        </SwipeableDrawer>
      )}
    </>
  );
};

export default Sidebar;