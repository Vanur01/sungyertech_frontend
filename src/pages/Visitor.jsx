// pages/VisitorTrackingPage.jsx - Fixed Imports
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  CardContent,
  Tooltip,
  InputAdornment,
  Pagination,
  Avatar,
  alpha,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  FormHelperText,
  Menu,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
  Zoom,
  Grow,
  Slide,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
  Switch,
  AvatarGroup,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Breadcrumbs,
  Link,
  AlertTitle,
  ListSubheader,
} from "@mui/material";

// Import Timeline components from @mui/lab
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

// Icons
import {
  Search,
  Visibility,
  Close,
  CheckCircle,
  Clear,
  Refresh,
  Cancel,
  PendingActions,
  Verified,
  FolderOpen,
  Image as ImageIcon,
  InsertDriveFile,
  DescriptionOutlined,
  GetApp,
  CloudUpload,
  Delete,
  Add,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Fullscreen,
  FullscreenExit,
  Person,
  Email,
  Phone,
  LocationOn,
  Note,
  Warning,
  Tune,
  ArrowUpward,
  ArrowDownward,
  Save,
  MoreVert,
  Business,
  Home,
  Route,
  Timeline as TimelineIcon,
  Place,
  AddLocation,
  MyLocation,
  GpsFixed,
  GpsOff,
  DirectionsWalk,
  DirectionsCar,
  TwoWheeler,
  LocationCity,
  Terrain,
  AccessTime,
  Speed,
  Layers,
  Map,
  PinDrop,
  Navigation,
  NearMe,
  NotListedLocation,
  LocationSearching,
  LocationDisabled,
  CompassCalibration,
  Explore,
  Satellite,
  StreetView,
  MapOutlined,
  PinDropOutlined,
  AddLocationAlt,
  FmdGood,
  FmdBad,
  FmdGoodOutlined,
  Flag,
  FlagOutlined,
  FlagCircle,
  Room,
  RoomOutlined,
  EditLocation,
  EditLocationAlt,
  ShareLocation,
  Assistant,
  AssistantDirection,
  TripOrigin,
  RadioButtonChecked,
  Adjust,
  CenterFocusWeak,
  CenterFocusStrong,
  ControlCamera,
  CameraAlt,
  CameraEnhance,
  CameraFront,
  CameraRear,
  Collections,
  CollectionsBookmark,
  PhotoCamera,
  PhotoLibrary,
  Wallpaper,
  WbSunny,
  WbCloudy,
  WbTwilight,
  NightsStay,
  Grain,
  Lens,
  BlurOn,
  BlurOff,
  FilterHdr,
  Landscape,
  Nature,
  NaturePeople,
  Park,
  Forest,
  Water,
  Waves,
  BeachAccess,
  AcUnit,
  Whatshot,
  ArrowBack,
  ArrowForward,
  VisibilityOff,
  Security,
  CalendarToday,
  Edit,
} from "@mui/icons-material";

import { useAuth } from "../contexts/AuthContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  format,
  isValid,
  parseISO,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";

// ========== CONSTANTS & CONFIGURATION ==========
const PRIMARY = "#3a5ac8";
const SECONDARY = "#2c489e";
const SUCCESS = "#4caf50";
const WARNING = "#ff9800";
const ERROR = "#f44336";
const INFO = "#2196f3";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DEFAULT_ITEMS_PER_PAGE = 10;
const ALLOWED_ROLES = ["Head_office", "ZSM", "ASM", "TEAM"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic"];

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

// Location Types
const LOCATION_TYPES = {
  OFFICE: "office",
  CLIENT_SITE: "client_site",
  FIELD_VISIT: "field_visit",
  HOME: "home",
  OTHER: "other",
};

const LOCATION_TYPE_CONFIG = {
  [LOCATION_TYPES.OFFICE]: {
    label: "Office",
    icon: <Business sx={{ fontSize: 16 }} />,
    color: PRIMARY,
    bg: alpha(PRIMARY, 0.1),
    gradient: "linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)",
  },
  [LOCATION_TYPES.CLIENT_SITE]: {
    label: "Client Site",
    icon: <LocationCity sx={{ fontSize: 16 }} />,
    color: SUCCESS,
    bg: alpha(SUCCESS, 0.1),
    gradient: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  },
  [LOCATION_TYPES.FIELD_VISIT]: {
    label: "Field Visit",
    icon: <Terrain sx={{ fontSize: 16 }} />,
    color: WARNING,
    bg: alpha(WARNING, 0.1),
    gradient: "linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)",
  },
  [LOCATION_TYPES.HOME]: {
    label: "Home",
    icon: <Home sx={{ fontSize: 16 }} />,
    color: "#9c27b0",
    bg: alpha("#9c27b0", 0.1),
    gradient: "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
  },
  [LOCATION_TYPES.OTHER]: {
    label: "Other",
    icon: <Place sx={{ fontSize: 16 }} />,
    color: "#757575",
    bg: alpha("#757575", 0.1),
    gradient: "linear-gradient(135deg, #616161 0%, #9e9e9e 100%)",
  },
};

// Visit Status
const VISIT_STATUS = {
  PLANNED: "planned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const VISIT_STATUS_CONFIG = {
  [VISIT_STATUS.PLANNED]: {
    label: "Planned",
    icon: <PendingActions sx={{ fontSize: 16 }} />,
    color: WARNING,
    bg: alpha(WARNING, 0.1),
    gradient: "linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)",
  },
  [VISIT_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    icon: <DirectionsWalk sx={{ fontSize: 16 }} />,
    color: INFO,
    bg: alpha(INFO, 0.1),
    gradient: "linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)",
  },
  [VISIT_STATUS.COMPLETED]: {
    label: "Completed",
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
    color: SUCCESS,
    bg: alpha(SUCCESS, 0.1),
    gradient: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  },
  [VISIT_STATUS.CANCELLED]: {
    label: "Cancelled",
    icon: <Cancel sx={{ fontSize: 16 }} />,
    color: ERROR,
    bg: alpha(ERROR, 0.1),
    gradient: "linear-gradient(135deg, #c62828 0%, #f44336 100%)",
  },
};

// Transport Mode for KM Calculation
const TRANSPORT_MODES = {
  WALKING: "walking",
  DRIVING: "driving",
  BICYCLING: "bicycling",
  MOTORCYCLE: "motorcycle",
  CAR: "car",
  PUBLIC_TRANSPORT: "public_transport",
  OTHER: "other",
};

const TRANSPORT_MODE_CONFIG = {
  [TRANSPORT_MODES.WALKING]: {
    label: "Walking",
    icon: <DirectionsWalk sx={{ fontSize: 18 }} />,
    speed: 5,
    carbonFootprint: 0,
    color: "#4caf50",
  },
  [TRANSPORT_MODES.BICYCLING]: {
    label: "Bicycling",
    icon: <TwoWheeler sx={{ fontSize: 18 }} />,
    speed: 15,
    carbonFootprint: 0,
    color: "#ff9800",
  },
  [TRANSPORT_MODES.MOTORCYCLE]: {
    label: "Motorcycle",
    icon: <TwoWheeler sx={{ fontSize: 18 }} />,
    speed: 40,
    carbonFootprint: 103,
    color: "#9c27b0",
  },
  [TRANSPORT_MODES.CAR]: {
    label: "Car",
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    speed: 60,
    carbonFootprint: 192,
    color: "#2196f3",
  },
  [TRANSPORT_MODES.DRIVING]: {
    label: "Driving",
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    speed: 50,
    carbonFootprint: 150,
    color: "#3f51b5",
  },
  [TRANSPORT_MODES.PUBLIC_TRANSPORT]: {
    label: "Public Transport",
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    speed: 30,
    carbonFootprint: 50,
    color: "#9e9e9e",
  },
  [TRANSPORT_MODES.OTHER]: {
    label: "Other",
    icon: <Route sx={{ fontSize: 18 }} />,
    speed: 20,
    carbonFootprint: 100,
    color: "#757575",
  },
};

// Role Configuration
const ROLE_CONFIG = {
  Head_office: {
    label: "Head Office",
    color: PRIMARY,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: "linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)",
  },
  ZSM: {
    label: "Zone Sales Manager",
    color: PRIMARY,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: "linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)",
  },
  ASM: {
    label: "Area Sales Manager",
    color: PRIMARY,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: "linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)",
  },
  TEAM: {
    label: "Field Executive",
    color: SUCCESS,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  },
};

// ========== HELPER FUNCTIONS ==========
const hasAccess = (userRole) => ALLOWED_ROLES.includes(userRole);

const getUserPermissions = (userRole) => ({
  canView: true,
  canEdit: ["Head_office", "ZSM", "ASM"].includes(userRole),
  canDelete: userRole === "Head_office",
  canManage: ["Head_office", "ZSM", "ASM"].includes(userRole),
  canSeeAll: ["Head_office", "ZSM", "ASM"].includes(userRole),
  canSeeOwn: userRole === "TEAM",
  canTrackLocation: ["TEAM"].includes(userRole),
  canAddManualLocation: ["Head_office", "ZSM", "ASM"].includes(userRole),
});

const getRoleConfig = (role) => {
  return (
    ROLE_CONFIG[role] || {
      label: role || "Unknown",
      color: PRIMARY,
      icon: <Person sx={{ fontSize: 16 }} />,
      gradient: "linear-gradient(135deg, #757575 0%, #9e9e9e 100%)",
    }
  );
};

const getLocationTypeConfig = (type) => {
  return (
    LOCATION_TYPE_CONFIG[type] || {
      label: "Unknown",
      icon: <Place sx={{ fontSize: 16 }} />,
      color: "#757575",
      bg: alpha("#757575", 0.1),
      gradient: "linear-gradient(135deg, #616161 0%, #9e9e9e 100%)",
    }
  );
};

const getVisitStatusConfig = (status) => {
  return (
    VISIT_STATUS_CONFIG[status] || {
      label: "Unknown",
      icon: <Warning sx={{ fontSize: 16 }} />,
      color: "#757575",
      bg: alpha("#757575", 0.1),
      gradient: "linear-gradient(135deg, #616161 0%, #9e9e9e 100%)",
    }
  );
};

const getTransportModeConfig = (mode) => {
  return (
    TRANSPORT_MODE_CONFIG[mode] || {
      label: "Other",
      icon: <Route sx={{ fontSize: 18 }} />,
      speed: 20,
      carbonFootprint: 100,
      color: "#757575",
    }
  );
};

const formatDistance = (distance) => {
  if (!distance && distance !== 0) return "0 km";
  if (distance < 0.1) return `${(distance * 1000).toFixed(0)} m`;
  if (distance < 1) return `${(distance * 1000).toFixed(0)} m`;
  if (distance < 10) return `${distance.toFixed(1)} km`;
  if (distance < 100) return `${distance.toFixed(0)} km`;
  return `${Math.round(distance)} km`;
};

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "0 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

const formatSpeed = (speed) => {
  if (!speed && speed !== 0) return "0 km/h";
  const kmh = speed * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
};

const calculateTravelTime = (distance, mode = TRANSPORT_MODES.DRIVING) => {
  const config = getTransportModeConfig(mode);
  const hours = distance / config.speed;
  return hours * 60;
};

const calculateCarbonFootprint = (distance, mode = TRANSPORT_MODES.DRIVING) => {
  const config = getTransportModeConfig(mode);
  return Math.round(distance * config.carbonFootprint);
};

const validateFile = (file) => {
  if (!file) return "";
  if (file.size > MAX_FILE_SIZE) return "File size should be less than 10MB";
  if (!ALLOWED_FILE_TYPES.includes(file.type))
    return "Only JPG, PNG, WEBP and HEIC files are allowed";
  return "";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Safe date formatting function
const safeFormatDate = (dateString, formatStr = "dd MMM yyyy, hh:mm a") => {
  if (!dateString) return "Not set";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : "Invalid Date";
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// Safe date only formatting (no time)
const safeFormatDateOnly = (dateString, formatStr = "dd MMM yyyy") => {
  if (!dateString) return "Not set";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : "Invalid Date";
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// Safe time formatting
const safeFormatTime = (dateString, formatStr = "hh:mm a") => {
  if (!dateString) return "--:--";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : "--:--";
  } catch (error) {
    console.error("Time formatting error:", error);
    return "--:--";
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "";
    const seconds = differenceInSeconds(new Date(), date);
    if (seconds < 60) return `${Math.floor(seconds)}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  } catch {
    return "";
  }
};

// ========== API SERVICE LAYER ==========
const VisitService = {
  // Create visit - POST /api/v1/visit
  createVisit: async (fetchAPI, formData) => {
    return await fetchAPI("/visit", {
      method: "POST",
      body: formData,
    });
  },

  // Get all visits with pagination - GET /api/v1/visit
  getVisits: async (fetchAPI, page = 1, limit = 10, filters = {}) => {
    let url = `/visit?page=${page}&limit=${limit}`;
    
    if (filters.date) url += `&date=${filters.date}`;
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.userId) url += `&userId=${filters.userId}`;
    if (filters.locationType) url += `&locationType=${filters.locationType}`;
    
    return await fetchAPI(url);
  },

  // Get visit by ID - GET /api/v1/visit/:id
  getVisitById: async (fetchAPI, id) => {
    return await fetchAPI(`/visit/${id}`);
  },

  // Update visit - PUT /api/v1/visit/:id
  updateVisit: async (fetchAPI, id, formData) => {
    return await fetchAPI(`/visit/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  // Delete visit - DELETE /api/v1/visit/:id
  deleteVisit: async (fetchAPI, id) => {
    return await fetchAPI(`/visit/${id}`, {
      method: "DELETE",
    });
  },

  // Get visit stats - GET /api/v1/visit/stats
  getVisitStats: async (fetchAPI) => {
    return await fetchAPI("/visit/stats");
  },

  // Get visit report - GET /api/v1/visit/report/:type
  getVisitReport: async (fetchAPI, type, params = {}) => {
    let url = `/visit/report/${type}`;
    const queryParams = [];
    
    if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
    if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
    if (params.userId) queryParams.push(`userId=${params.userId}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    return await fetchAPI(url);
  },

  // Get daily summary - GET /api/v1/visit/daily-summary
  getDailySummary: async (fetchAPI, date) => {
    return await fetchAPI(`/visit/daily-summary?date=${date}`);
  },
};

// ========== WEBCAM CAPTURE COMPONENT ==========
const WebcamCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      // Convert base64 to file
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `visit_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file, capturedImage);
        });
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {!capturedImage ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
            videoConstraints={{
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }}
            style={{
              borderRadius: 8,
              marginBottom: 16,
              maxWidth: '100%'
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={capture}
              startIcon={<CameraAlt />}
              sx={{ borderRadius: 2 }}
            >
              Capture Photo
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 8,
              marginBottom: 16
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={confirmCapture}
              startIcon={<CheckCircle />}
              sx={{ borderRadius: 2, bgcolor: SUCCESS }}
            >
              Use Photo
            </Button>
            <Button
              variant="outlined"
              onClick={retake}
              startIcon={<Refresh />}
              sx={{ borderRadius: 2 }}
            >
              Retake
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

// ========== ENHANCED LOCATION PERMISSION DIALOG ==========
const LocationPermissionDialog = ({ open, onClose, onAllow, onDeny }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onDeny}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${PRIMARY} 0%, ${SECONDARY} 50%, ${SUCCESS} 100%)`,
          },
        }}
      >
        <DialogTitle sx={{ pt: 4, pb: 2, textAlign: "center" }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.1)} 0%, ${alpha(PRIMARY, 0.05)} 100%)`,
                mb: 2,
              }}
            >
              <LocationOn
                sx={{
                  fontSize: 64,
                  color: PRIMARY,
                  filter: "drop-shadow(0 8px 12px rgba(58,90,200,0.2))",
                }}
              />
            </Box>
          </motion.div>
          
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Location Access Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
            To track your visits and calculate distances accurately, we need access to your location
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 2 }}>
          <Stack spacing={3}>
            {/* Benefits Cards */}
            <Grid container spacing={2}>
              {[
                {
                  icon: <GpsFixed sx={{ fontSize: 32 }} />,
                  title: "Accurate Tracking",
                  description: "Get precise location data for your field visits",
                  color: PRIMARY,
                },
                {
                  icon: <Route sx={{ fontSize: 32 }} />,
                  title: "Distance Calculation",
                  description: "Automatically calculate KM traveled and travel time",
                  color: SUCCESS,
                },
                {
                  icon: <TimelineIcon sx={{ fontSize: 32 }} />,
                  title: "Visit History",
                  description: "Maintain complete history of your visit locations",
                  color: WARNING,
                },
              ].map((item, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        bgcolor: alpha(item.color, 0.05),
                        borderRadius: 3,
                        border: `1px solid ${alpha(item.color, 0.1)}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.1)} 100%)`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Privacy Note */}
            <Alert
              severity="info"
              sx={{
                borderRadius: 3,
                bgcolor: alpha(INFO, 0.05),
                border: `1px solid ${alpha(INFO, 0.1)}`,
              }}
              icon={<Security sx={{ color: INFO }} />}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Your Privacy Matters</AlertTitle>
              <Typography variant="body2">
                We only track your location while you are actively using the app. 
                Location data is encrypted and never shared with third parties.
              </Typography>
            </Alert>

            {/* Instructions */}
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(PRIMARY, 0.03),
                borderRadius: 3,
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                How to enable location:
              </Typography>
              <Stepper orientation="vertical" sx={{ mt: 1 }}>
                <Step active>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "& .MuiStepIcon-text": { fill: "white" },
                        "& .MuiStepIcon-root": { color: PRIMARY },
                      },
                    }}
                  >
                    Click "Allow Location Access" button below
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption" color="text.secondary">
                      Your browser will show a permission prompt
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "& .MuiStepIcon-text": { fill: "white" },
                        "& .MuiStepIcon-root": { color: PRIMARY },
                      },
                    }}
                  >
                    Select "Allow" in the browser prompt
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption" color="text.secondary">
                      This allows us to access your device's GPS
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "& .MuiStepIcon-text": { fill: "white" },
                        "& .MuiStepIcon-root": { color: PRIMARY },
                      },
                    }}
                  >
                    Start tracking your visits
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption" color="text.secondary">
                      You can now use real-time location tracking
                    </Typography>
                  </StepContent>
                </Step>
              </Stepper>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            pt: 2,
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onDeny}
            size="large"
            sx={{
              borderRadius: 3,
              py: 1.5,
              borderWidth: 2,
              "&:hover": { borderWidth: 2 },
            }}
          >
            Not Now
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onAllow}
            size="large"
            startIcon={<MyLocation />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              background: `linear-gradient(45deg, ${PRIMARY} 30%, ${SECONDARY} 90%)`,
              boxShadow: `0 8px 16px ${alpha(PRIMARY, 0.3)}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${SECONDARY} 30%, ${PRIMARY} 90%)`,
              },
            }}
          >
            Allow Location Access
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// ========== CREATE VISIT DIALOG ==========
const CreateVisitDialog = ({ open, onClose, onSubmit, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    locationName: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: "Geolocation not supported" }));
      return;
    }

    setGettingLocation(true);
    setErrors((prev) => ({ ...prev, location: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setGettingLocation(false);
      },
      (error) => {
        let errorMsg = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
          default:
            errorMsg = "An unknown error occurred.";
        }
        setErrors((prev) => ({ ...prev, location: errorMsg }));
        setGettingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const handleCapturePhoto = (capturedFile, capturedPreview) => {
    setPhoto(capturedFile);
    setPreviewUrl(capturedPreview);
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhoto(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.latitude) newErrors.latitude = "Latitude is required";
    if (!formData.longitude) newErrors.longitude = "Longitude is required";
    if (!formData.locationName) newErrors.locationName = "Location name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData, photo);
  };

  const handleClose = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData({
      latitude: "",
      longitude: "",
      locationName: "",
      remarks: "",
    });
    setPhoto(null);
    setPreviewUrl(null);
    setErrors({});
    setGettingLocation(false);
    setShowCamera(false);
    onClose();
  };

  return (
    <>
      {/* Camera Dialog */}
      <Dialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Take Photo
            </Typography>
            <IconButton onClick={() => setShowCamera(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <WebcamCapture 
            onCapture={handleCapturePhoto} 
            onClose={() => setShowCamera(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Main Create Visit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.15)} 0%, ${alpha(PRIMARY, 0.05)} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: PRIMARY,
                }}
              >
                <AddLocationAlt sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Create New Visit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record a new field visit location
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="large">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <AlertTitle>Location Required</AlertTitle>
              Enter the coordinates or use your current location
            </Alert>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={gettingLocation ? <CircularProgress size={20} /> : <MyLocation />}
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                sx={{
                  borderRadius: 2,
                  bgcolor: PRIMARY,
                  "&:hover": { bgcolor: SECONDARY },
                  minWidth: 200,
                }}
              >
                {gettingLocation ? "Getting Location..." : "Use Current Location"}
              </Button>
              <Typography variant="body2" color="text.secondary">
                or enter manually
              </Typography>
            </Box>

            {errors.location && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.location}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude *"
                  value={formData.latitude}
                  onChange={handleInputChange("latitude")}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDrop sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude *"
                  value={formData.longitude}
                  onChange={handleInputChange("longitude")}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDrop sx={{ color: "text.secondary", transform: "rotate(45deg)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Location Name *"
              value={formData.locationName}
              onChange={handleInputChange("locationName")}
              fullWidth
              size="medium"
              placeholder="Enter location name"
              error={!!errors.locationName}
              helperText={errors.locationName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={handleInputChange("remarks")}
              fullWidth
              multiline
              rows={3}
              size="medium"
              placeholder="Enter any remarks about this visit..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Note sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Photo (Optional)
              </Typography>
              
              {!previewUrl ? (
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  fullWidth
                  sx={{
                    p: 2,
                    border: `2px dashed ${alpha(PRIMARY, 0.3)}`,
                    borderRadius: 2,
                    color: PRIMARY,
                    '&:hover': {
                      borderColor: PRIMARY,
                      bgcolor: alpha(PRIMARY, 0.05),
                    }
                  }}
                >
                  Take Photo
                </Button>
              ) : (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.9)",
                      "&:hover": { bgcolor: "white" },
                    }}
                    onClick={handleRemovePhoto}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              )}
              
              {errors.photo && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.photo}
                </FormHelperText>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth={isMobile}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth={isMobile}
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              borderRadius: 2,
              bgcolor: SUCCESS,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
          >
            {loading ? "Creating..." : "Create Visit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ========== EDIT VISIT DIALOG ==========
const EditVisitDialog = ({ open, onClose, visit, onSubmit, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    locationName: "",
    remarks: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (visit) {
      setFormData({
        locationName: visit.locationName || "",
        remarks: visit.remarks || "",
        latitude: visit.location?.lat?.toString() || "",
        longitude: visit.location?.lng?.toString() || "",
      });
      if (visit.photoUrl) {
        setPreviewUrl(visit.photoUrl);
      }
    }
  }, [visit]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCapturePhoto = (capturedFile, capturedPreview) => {
    setPhoto(capturedFile);
    setPreviewUrl(capturedPreview);
    setRemoveCurrentPhoto(false);
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhoto(null);
    setPreviewUrl(null);
    setRemoveCurrentPhoto(true);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: "Geolocation not supported" }));
      return;
    }

    setGettingLocation(true);
    setErrors((prev) => ({ ...prev, location: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setGettingLocation(false);
      },
      (error) => {
        let errorMsg = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
          default:
            errorMsg = "An unknown error occurred.";
        }
        setErrors((prev) => ({ ...prev, location: errorMsg }));
        setGettingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.latitude) newErrors.latitude = "Latitude is required";
    if (!formData.longitude) newErrors.longitude = "Longitude is required";
    if (!formData.locationName) newErrors.locationName = "Location name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData, photo, removeCurrentPhoto);
  };

  const handleClose = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData({
      locationName: "",
      remarks: "",
      latitude: "",
      longitude: "",
    });
    setPhoto(null);
    setPreviewUrl(null);
    setRemoveCurrentPhoto(false);
    setErrors({});
    setGettingLocation(false);
    setShowCamera(false);
    onClose();
  };

  return (
    <>
      {/* Camera Dialog */}
      <Dialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Take Photo
            </Typography>
            <IconButton onClick={() => setShowCamera(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <WebcamCapture 
            onCapture={handleCapturePhoto} 
            onClose={() => setShowCamera(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Main Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.15)} 0%, ${alpha(PRIMARY, 0.05)} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: PRIMARY,
                }}
              >
                <EditLocationAlt sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Edit Visit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update visit information
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="large">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <AlertTitle>Update Location</AlertTitle>
              Modify the coordinates or use your current location
            </Alert>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={gettingLocation ? <CircularProgress size={20} /> : <MyLocation />}
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                sx={{
                  borderRadius: 2,
                  bgcolor: PRIMARY,
                  "&:hover": { bgcolor: SECONDARY },
                  minWidth: 200,
                }}
              >
                {gettingLocation ? "Getting Location..." : "Use Current Location"}
              </Button>
              <Typography variant="body2" color="text.secondary">
                or enter manually
              </Typography>
            </Box>

            {errors.location && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.location}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude *"
                  value={formData.latitude}
                  onChange={handleInputChange("latitude")}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDrop sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude *"
                  value={formData.longitude}
                  onChange={handleInputChange("longitude")}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDrop sx={{ color: "text.secondary", transform: "rotate(45deg)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Location Name *"
              value={formData.locationName}
              onChange={handleInputChange("locationName")}
              fullWidth
              size="medium"
              placeholder="Enter location name"
              error={!!errors.locationName}
              helperText={errors.locationName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={handleInputChange("remarks")}
              fullWidth
              multiline
              rows={3}
              size="medium"
              placeholder="Enter any remarks about this visit..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Note sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Photo
              </Typography>
              
              {!previewUrl ? (
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  fullWidth
                  sx={{
                    p: 2,
                    border: `2px dashed ${alpha(PRIMARY, 0.3)}`,
                    borderRadius: 2,
                    color: PRIMARY,
                    '&:hover': {
                      borderColor: PRIMARY,
                      bgcolor: alpha(PRIMARY, 0.05),
                    }
                  }}
                >
                  Take New Photo
                </Button>
              ) : (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.9)",
                        "&:hover": { bgcolor: "white" },
                      }}
                      onClick={() => setShowCamera(true)}
                    >
                      <PhotoCamera />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.9)",
                        "&:hover": { bgcolor: "white" },
                      }}
                      onClick={handleRemovePhoto}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Box>
              )}
              
              {errors.photo && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.photo}
                </FormHelperText>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth={isMobile}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth={isMobile}
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              borderRadius: 2,
              bgcolor: SUCCESS,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
          >
            {loading ? "Updating..." : "Update Visit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ========== ENHANCED LOCATION TRACKER COMPONENT ==========
const LocationTracker = React.memo(({ visit, onLocationUpdate, userRole, onManualLocationClick }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [trackingActive, setTrackingActive] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState(TRANSPORT_MODES.DRIVING);
  const [showStats, setShowStats] = useState(true);

  // Check location permission on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setLocationPermission(result.state);
          if (result.state === "prompt") {
            setPermissionDialogOpen(true);
          }
          result.onchange = () => {
            setLocationPermission(result.state);
            if (result.state === "granted") {
              getCurrentLocation();
            }
          };
        })
        .catch((err) => {
          console.error("Permission query error:", err);
        });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      // Cleanup object URLs
      locationHistory.forEach(loc => {
        if (loc.imageUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(loc.imageUrl);
        }
      });
    };
  }, [watchId, locationHistory]);

  // Start tracking location
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    if (locationPermission === "denied") {
      setLocationError(
        "Location permission denied. Please enable location access in your browser settings."
      );
      return;
    }

    setLoading(true);
    setLocationError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed: currentSpeed } = position.coords;

        const newLocation = {
          id: Date.now(),
          latitude,
          longitude,
          accuracy,
          speed: currentSpeed || 0,
          timestamp: new Date().toISOString(),
          transportMode: selectedTransportMode,
        };

        setCurrentLocation(newLocation);
        setAccuracy(accuracy);
        setSpeed(currentSpeed || 0);

        // Calculate distance from last known location
        if (locationHistory.length > 0) {
          const lastLoc = locationHistory[locationHistory.length - 1];
          const dist = calculateDistance(
            lastLoc.latitude,
            lastLoc.longitude,
            latitude,
            longitude
          );
          setDistance((prev) => prev + dist);

          // Calculate duration
          const timeDiff = differenceInMinutes(
            parseISO(newLocation.timestamp),
            parseISO(lastLoc.timestamp)
          );
          setDuration((prev) => prev + timeDiff);
        }

        setLocationHistory((prev) => [...prev, newLocation]);

        // Callback to parent
        if (onLocationUpdate) {
          onLocationUpdate({
            currentLocation: newLocation,
            distance,
            duration,
            locationHistory,
          });
        }

        setLoading(false);
      },
      (error) => {
        let errorMsg = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied";
            setLocationPermission("denied");
            setPermissionDialogOpen(true);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
          default:
            errorMsg = "An unknown error occurred";
        }
        setLocationError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setTrackingActive(true);
  }, [locationPermission, locationHistory, onLocationUpdate, distance, duration, selectedTransportMode]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTrackingActive(false);
  }, [watchId]);

  // Get current location once
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed: currentSpeed } = position.coords;

        const location = {
          id: Date.now(),
          latitude,
          longitude,
          accuracy,
          speed: currentSpeed || 0,
          timestamp: new Date().toISOString(),
          transportMode: selectedTransportMode,
        };

        setCurrentLocation(location);
        setAccuracy(accuracy);
        setSpeed(currentSpeed || 0);
        setLocationPermission("granted");
        setLoading(false);

        if (onLocationUpdate) {
          onLocationUpdate({ currentLocation: location });
        }
      },
      (error) => {
        let errorMsg = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied";
            setLocationPermission("denied");
            setPermissionDialogOpen(true);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
        }
        setLocationError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLocationUpdate, selectedTransportMode]);

  // Handle permission allow
  const handleAllowLocation = useCallback(() => {
    setPermissionDialogOpen(false);
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Handle permission deny
  const handleDenyLocation = useCallback(() => {
    setPermissionDialogOpen(false);
    setLocationPermission("denied");
  }, []);

  if (!getUserPermissions(userRole).canTrackLocation) {
    return null;
  }

  return (
    <>
      {/* Location Permission Dialog */}
      <LocationPermissionDialog
        open={permissionDialogOpen}
        onClose={handleDenyLocation}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />

      {/* Location Tracker Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            border: `1px solid ${alpha(PRIMARY, 0.1)}`,
            mb: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: trackingActive
                ? `linear-gradient(90deg, ${SUCCESS} 0%, ${PRIMARY} 50%, ${INFO} 100%)`
                : `linear-gradient(90deg, ${alpha(PRIMARY, 0.3)} 0%, ${alpha(PRIMARY, 0.1)} 100%)`,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: trackingActive
                        ? `linear-gradient(135deg, ${alpha(SUCCESS, 0.2)} 0%, ${alpha(PRIMARY, 0.1)} 100%)`
                        : `linear-gradient(135deg, ${alpha(PRIMARY, 0.15)} 0%, ${alpha(PRIMARY, 0.05)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: trackingActive ? SUCCESS : PRIMARY,
                    }}
                  >
                    {trackingActive ? (
                      <MyLocation sx={{ fontSize: 32 }} />
                    ) : currentLocation ? (
                      <GpsFixed sx={{ fontSize: 32 }} />
                    ) : (
                      <LocationSearching sx={{ fontSize: 32 }} />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {trackingActive
                        ? "📍 Tracking Active"
                        : currentLocation
                        ? "📍 Location Captured"
                        : "📍 Ready to Track"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trackingActive
                        ? "Your movement is being tracked in real-time"
                        : currentLocation
                        ? `Last updated ${formatTimeAgo(currentLocation.timestamp)}`
                        : "Start tracking to record your visit location"}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {getUserPermissions(userRole).canAddManualLocation && (
                    <Tooltip title="Add Manual Location" arrow>
                      <IconButton
                        onClick={() => onManualLocationClick()}
                        sx={{
                          bgcolor: alpha(PRIMARY, 0.1),
                          "&:hover": { bgcolor: alpha(PRIMARY, 0.2) },
                          width: 44,
                          height: 44,
                        }}
                      >
                        <AddLocationAlt />
                      </IconButton>
                    </Tooltip>
                  )}

                  {locationPermission === "denied" && (
                    <Tooltip title="Enable Location" arrow>
                      <IconButton
                        onClick={() => setPermissionDialogOpen(true)}
                        sx={{
                          bgcolor: alpha(WARNING, 0.1),
                          color: WARNING,
                          "&:hover": { bgcolor: alpha(WARNING, 0.2) },
                          width: 44,
                          height: 44,
                        }}
                      >
                        <LocationDisabled />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title={showStats ? "Hide Stats" : "Show Stats"} arrow>
                    <IconButton
                      onClick={() => setShowStats(!showStats)}
                      sx={{
                        bgcolor: alpha(PRIMARY, 0.1),
                        "&:hover": { bgcolor: alpha(PRIMARY, 0.2) },
                        width: 44,
                        height: 44,
                      }}
                    >
                      {showStats ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Tooltip>

                  {trackingActive ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={stopTracking}
                      startIcon={<Close />}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.2,
                        background: `linear-gradient(45deg, #d32f2f 30%, #f44336 90%)`,
                        boxShadow: "0 4px 12px rgba(211,47,47,0.3)",
                      }}
                    >
                      Stop Tracking
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={startTracking}
                      disabled={loading || locationPermission === "denied"}
                      startIcon={loading ? <CircularProgress size={20} /> : <MyLocation />}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.2,
                        background: `linear-gradient(45deg, ${PRIMARY} 30%, ${SECONDARY} 90%)`,
                        boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.3)}`,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${SECONDARY} 30%, ${PRIMARY} 90%)`,
                        },
                      }}
                    >
                      {loading ? "Starting..." : "Start Tracking"}
                    </Button>
                  )}

                  {!trackingActive && !currentLocation && locationPermission !== "denied" && (
                    <Button
                      variant="outlined"
                      onClick={getCurrentLocation}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <GpsFixed />}
                      sx={{ borderRadius: 3, px: 3, py: 1.2 }}
                    >
                      Get Current Location
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Transport Mode Selection */}
              {!trackingActive && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(PRIMARY, 0.03),
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Transport Mode
                  </Typography>
                  <RadioGroup
                    row
                    value={selectedTransportMode}
                    onChange={(e) => setSelectedTransportMode(e.target.value)}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {Object.values(TRANSPORT_MODES).slice(0, 5).map((mode) => {
                      const config = getTransportModeConfig(mode);
                      return (
                        <FormControlLabel
                          key={mode}
                          value={mode}
                          control={
                            <Radio
                              sx={{
                                color: config.color,
                                "&.Mui-checked": {
                                  color: config.color,
                                },
                              }}
                            />
                          }
                          label={
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              {config.icon}
                              <Typography variant="body2">{config.label}</Typography>
                            </Stack>
                          }
                          sx={{
                            mr: 0,
                            p: 1,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: selectedTransportMode === mode ? config.color : "divider",
                            bgcolor: selectedTransportMode === mode ? alpha(config.color, 0.05) : "transparent",
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                </Box>
              )}

              {/* Error Alert */}
              <AnimatePresence>
                {locationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Alert
                      severity="error"
                      onClose={() => setLocationError(null)}
                      sx={{ borderRadius: 2 }}
                      icon={<Warning />}
                    >
                      {locationError}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location Stats */}
              {currentLocation && showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: alpha(PRIMARY, 0.03),
                      borderRadius: 3,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr 1fr",
                        sm: "repeat(4, 1fr)",
                        md: "repeat(8, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Latitude
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentLocation.latitude.toFixed(6)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Longitude
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentLocation.longitude.toFixed(6)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Accuracy
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: accuracy < 20 ? SUCCESS : accuracy < 50 ? WARNING : ERROR,
                        }}
                      >
                        ±{Math.round(accuracy || 0)}m
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Speed
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatSpeed(speed)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Distance
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={PRIMARY}>
                        {formatDistance(distance)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={PRIMARY}>
                        {formatDuration(duration)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Update
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatTimeAgo(currentLocation.timestamp) || "Just now"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        CO₂
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={SUCCESS}>
                        {calculateCarbonFootprint(distance, selectedTransportMode)}g
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Location History */}
              {locationHistory.length > 0 && showStats && (
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Location History (Last 3 Points)
                    </Typography>
                    <Chip
                      label={`${locationHistory.length} points`}
                      size="small"
                      sx={{
                        bgcolor: alpha(PRIMARY, 0.1),
                        color: PRIMARY,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Timeline sx={{ m: 0, p: 0 }}>
                    {locationHistory.slice(-3).map((loc, index) => (
                      <TimelineItem key={loc.id || index}>
                        <TimelineOppositeContent
                          variant="caption"
                          color="text.secondary"
                          sx={{ flex: 0.2 }}
                        >
                          {safeFormatTime(loc.timestamp, "HH:mm:ss")}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            sx={{
                              bgcolor: index === locationHistory.length - 1 ? SUCCESS : PRIMARY,
                              boxShadow: `0 0 0 4px ${alpha(index === locationHistory.length - 1 ? SUCCESS : PRIMARY, 0.2)}`,
                            }}
                          />
                          {index < locationHistory.length - 1 && (
                            <TimelineConnector sx={{ bgcolor: alpha(PRIMARY, 0.2) }} />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2" fontWeight={600}>
                            {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ±{Math.round(loc.accuracy)}m • {formatSpeed(loc.speed)}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
});

LocationTracker.displayName = "LocationTracker";

// ========== ENHANCED IMAGE VIEWER MODAL ==========
const ImageViewerModal = React.memo(({ open, onClose, imageUrl, title, images = [] }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleZoomIn = useCallback(
    () => setZoom((prev) => Math.min(prev + 0.25, 3)),
    []
  );
  const handleZoomOut = useCallback(
    () => setZoom((prev) => Math.max(prev - 0.25, 0.5)),
    []
  );
  const handleRotateRight = useCallback(
    () => setRotation((prev) => (prev + 90) % 360),
    []
  );
  const handleRotateLeft = useCallback(
    () => setRotation((prev) => (prev - 90 + 360) % 360),
    []
  );
  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    setCurrentIndex(0);
    onClose();
  }, [handleReset, onClose]);

  const handleNext = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setZoom(1);
      setRotation(0);
    }
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setZoom(1);
      setRotation(0);
    }
  }, [images.length]);

  const currentImage = images.length > 0 ? images[currentIndex] : { url: imageUrl, name: title };
  const isImage = useMemo(
    () => currentImage?.url && /\.(jpg|jpeg|png|gif|bmp|webp|heic)$/i.test(currentImage.url),
    [currentImage]
  );

  const handleDownload = useCallback(() => {
    if (!currentImage?.url) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = currentImage.name || `location_image_${Date.now()}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={fullscreen ? false : "lg"}
      fullWidth
      fullScreen={fullscreen}
      PaperProps={fullscreen ? { style: { margin: 0, height: "100vh" } } : {}}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(PRIMARY, 0.05),
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 2,
          py: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={600}>
            {currentImage?.name || title || "Location Image"}
          </Typography>
          {images.length > 1 && (
            <Chip
              label={`${currentIndex + 1} / ${images.length}`}
              size="small"
              sx={{ bgcolor: alpha(PRIMARY, 0.1), color: PRIMARY, fontWeight: 600 }}
            />
          )}
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title={fullscreen ? "Exit Fullscreen" : "Fullscreen"} arrow>
            <IconButton onClick={() => setFullscreen(!fullscreen)} size="small">
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Download" arrow>
            <IconButton onClick={handleDownload} size="small">
              <GetApp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close" arrow>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: fullscreen ? "#000" : "transparent",
          minHeight: fullscreen ? "calc(100vh - 64px)" : 500,
          position: "relative",
        }}
      >
        {isImage ? (
          <>
            <Box
              sx={{
                position: "relative",
                overflow: "auto",
                maxWidth: "100%",
                maxHeight: fullscreen ? "100vh" : "70vh",
                p: fullscreen ? 0 : 2,
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.name || "Location"}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                  maxWidth: "100%",
                  maxHeight: fullscreen ? "100vh" : "70vh",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Box>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                    boxShadow: 4,
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                    boxShadow: 4,
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </>
            )}
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <ImageIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Image Preview Not Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This file type cannot be previewed. Please download to view.
            </Typography>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleDownload}
              sx={{
                mt: 2,
                bgcolor: PRIMARY,
                "&:hover": { bgcolor: SECONDARY },
              }}
            >
              Download Image
            </Button>
          </Box>
        )}
      </DialogContent>
      {isImage && (
        <DialogActions
          sx={{
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            justifyContent: "center",
            gap: 1,
            py: 1.5,
          }}
        >
          <Tooltip title="Zoom In" arrow>
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out" arrow>
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rotate Right" arrow>
            <IconButton onClick={handleRotateRight} size="small">
              <RotateRight />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rotate Left" arrow>
            <IconButton onClick={handleRotateLeft} size="small">
              <RotateLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset" arrow>
            <IconButton onClick={handleReset} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ ml: 2, color: "text.secondary" }}>
            {Math.round(zoom * 100)}% • {rotation}°
          </Typography>
        </DialogActions>
      )}
    </Dialog>
  );
});

ImageViewerModal.displayName = "ImageViewerModal";

// ========== ENHANCED VIEW VISIT DETAILS MODAL ==========
const ViewVisitModal = React.memo(
  ({ open, onClose, visit, userRole, showSnackbar, handleViewImage, onEdit, onDelete }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeTab, setActiveTab] = useState(0);
    const [dailySummary, setDailySummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchAPI } = useAuth();

    const userRoleConfig = useMemo(() => getRoleConfig(userRole), [userRole]);
    const permissions = useMemo(() => getUserPermissions(userRole), [userRole]);

    useEffect(() => {
      if (open && visit?._id && visit?.date) {
        fetchDailySummary();
      }
    }, [open, visit?._id, visit?.date]);

    const fetchDailySummary = async () => {
      if (!visit?.date) return;

      try {
        setLoading(true);
        const response = await VisitService.getDailySummary(fetchAPI, visit.date);
        if (response?.result) {
          // Find summary for current user
          const userSummary = Array.isArray(response.result) 
            ? response.result.find(s => s.user?._id === visit.user?._id)
            : null;
          setDailySummary(userSummary);
        }
      } catch (error) {
        console.error("Error fetching daily summary:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };

    const handleEdit = () => {
      if (onEdit) {
        onEdit(visit);
      }
    };

    const handleDelete = () => {
      if (onDelete && window.confirm("Are you sure you want to delete this visit?")) {
        onDelete(visit._id);
      }
    };

    if (!visit) return null;

    const tabs = [
      {
        label: "Visitor Info",
        icon: <Person />,
        content: (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(PRIMARY, 0.1)}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.05)} 0%, ${alpha(PRIMARY, 0.02)} 100%)`,
                  borderBottom: `1px solid ${alpha(PRIMARY, 0.1)}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: 1, color: PRIMARY }}
                >
                  <Person /> Visitor Information
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY, 0.02),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {visit.user?.firstName} {visit.user?.lastName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY, 0.02),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {visit.user?.email || "Not set"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY, 0.02),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Role
                    </Typography>
                    <Chip
                      label={getRoleConfig(visit.user?.role).label}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRoleConfig(visit.user?.role).color, 0.1),
                        color: getRoleConfig(visit.user?.role).color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY, 0.02),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visit Date
                    </Typography>
                    <Typography variant="body1">
                      {safeFormatDate(visit.visitedAt || visit.createdAt, "dd MMM yyyy, hh:mm a")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY, 0.02),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Remarks
                    </Typography>
                    <Typography variant="body1">
                      {visit.remarks || "No remarks"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ),
      },
      {
        label: "Location",
        icon: <LocationOn />,
        content: (
          <Stack spacing={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(SUCCESS, 0.1)}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    background: `linear-gradient(135deg, ${alpha(SUCCESS, 0.05)} 0%, ${alpha(SUCCESS, 0.02)} 100%)`,
                    borderBottom: `1px solid ${alpha(SUCCESS, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ display: "flex", alignItems: "center", gap: 1, color: SUCCESS }}
                  >
                    <MyLocation /> Visit Location
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(PRIMARY, 0.03),
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Coordinates
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {visit.location?.lat?.toFixed(6)}° N,{" "}
                          {visit.location?.lng?.toFixed(6)}° E
                        </Typography>
                      </Box>
                      <Chip
                        label={visit.locationName || "Location"}
                        icon={<LocationCity />}
                        size="small"
                        sx={{
                          bgcolor: alpha(SUCCESS, 0.1),
                          color: SUCCESS,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(PRIMARY, 0.02),
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {visit.location?.address || "Address not available"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(PRIMARY, 0.02),
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Distance from Previous
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color={PRIMARY}>
                        {formatDistance(visit.kmFromPrevious || 0)}
                      </Typography>
                    </Box>
                    {dailySummary && (
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(INFO, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(INFO, 0.2)}`,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600} color={INFO} gutterBottom>
                          Daily Summary
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Total Visits
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {dailySummary.totalVisits || 0}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Total KM
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDistance(dailySummary.totalKm || 0)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              First Visit
                            </Typography>
                            <Typography variant="body2">
                              {dailySummary.firstVisitTime ? safeFormatTime(dailySummary.firstVisitTime) : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Last Visit
                            </Typography>
                            <Typography variant="body2">
                              {dailySummary.lastVisitTime ? safeFormatTime(dailySummary.lastVisitTime) : "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {dailySummary?.locations?.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha(PRIMARY, 0.1)}`,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.05)} 0%, ${alpha(PRIMARY, 0.02)} 100%)`,
                      borderBottom: `1px solid ${alpha(PRIMARY, 0.1)}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ display: "flex", alignItems: "center", gap: 1, color: PRIMARY }}
                    >
                      <TimelineIcon /> Today's Visit History
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Timeline>
                      {dailySummary.locations.map((location, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent
                            variant="caption"
                            color="text.secondary"
                            sx={{ flex: 0.2 }}
                          >
                            {safeFormatTime(location.visitedAt)}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot
                              sx={{
                                bgcolor: index === dailySummary.locations.length - 1 ? SUCCESS : PRIMARY,
                                boxShadow: `0 0 0 4px ${alpha(index === dailySummary.locations.length - 1 ? SUCCESS : PRIMARY, 0.2)}`,
                              }}
                            />
                            {index < dailySummary.locations.length - 1 && (
                              <TimelineConnector sx={{ bgcolor: alpha(PRIMARY, 0.2) }} />
                            )}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {location.locationName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </Typography>
                            {location.kmFromPrevious > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                📏 {formatDistance(location.kmFromPrevious)} from previous
                              </Typography>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Stack>
        ),
      },
      {
        label: "Image",
        icon: <ImageIcon />,
        content: (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(PRIMARY, 0.1)}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(PRIMARY, 0.05)} 0%, ${alpha(PRIMARY, 0.02)} 100%)`,
                  borderBottom: `1px solid ${alpha(PRIMARY, 0.1)}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: 1, color: PRIMARY }}
                >
                  <ImageIcon /> Location Image
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                {visit.photoUrl ? (
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover": {
                        "& .image-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                    onClick={() => handleViewImage(visit.photoUrl, visit.locationName)}
                  >
                    <img
                      src={visit.photoUrl}
                      alt={visit.locationName}
                      style={{
                        width: "100%",
                        maxHeight: 400,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<ZoomIn />}
                        sx={{ bgcolor: "white", color: PRIMARY }}
                      >
                        View Full Image
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <ImageIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Image Uploaded
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No image was uploaded for this visit.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ),
      },
    ];

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: PRIMARY,
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: PRIMARY,
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                }}
              >
                {visit.user?.firstName?.[0] || "V"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {visit.user?.firstName} {visit.user?.lastName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Visit Details • {visit.locationName}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              {permissions.canEdit && (
                <Tooltip title="Edit Visit">
                  <IconButton
                    onClick={handleEdit}
                    size="small"
                    sx={{ color: "white", "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              {permissions.canDelete && (
                <Tooltip title="Delete Visit">
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    sx={{ color: "white", "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  py: 1.5,
                  px: 3,
                },
                "& .Mui-selected": {
                  color: `${PRIMARY} !important`,
                },
                "& .MuiTabs-indicator": {
                  bgcolor: PRIMARY,
                  height: 3,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={tab.label}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3, maxHeight: "60vh", overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              tabs[activeTab].content
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Chip
              label={userRoleConfig.label}
              icon={userRoleConfig.icon}
              size="small"
              sx={{
                bgcolor: alpha(PRIMARY, 0.15),
                color: PRIMARY,
                fontWeight: 600,
              }}
            />
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 4,
                bgcolor: PRIMARY,
                "&:hover": { bgcolor: SECONDARY },
              }}
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
);

ViewVisitModal.displayName = "ViewVisitModal";

// ========== LOADING SKELETON ==========
const LoadingSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Grid item xs={6} sm={4} md={3} key={item}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 3 }}
          />
        </Grid>
      ))}
    </Grid>
    <Skeleton
      variant="rectangular"
      height={56}
      sx={{ borderRadius: 3, mb: 3 }}
    />
    <Skeleton
      variant="rectangular"
      height={400}
      sx={{ borderRadius: 3, mb: 2 }}
    />
  </Box>
);

// ========== MAIN COMPONENT ==========
export default function VisitorTrackingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { fetchAPI, safeFetchAPI, user, getUserRole } = useAuth();
  const userRole = getUserRole();
  const userPermissions = useMemo(
    () => getUserPermissions(userRole),
    [userRole]
  );

  // State Management
  const [period, setPeriod] = useState("This Week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Data State
  const [visitorData, setVisitorData] = useState({
    visits: [],
    summary: {
      totalVisits: 0,
      totalVisitors: 0,
      totalDistance: 0,
      totalDuration: 0,
      averageDistance: 0,
      averageDuration: 0,
      carbonFootprint: 0,
      locations: 0,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
  });

  // Stats State
  const [stats, setStats] = useState({
    overall: {
      totalVisits: 0,
      totalKm: 0,
      totalDays: 0,
      avgVisitsPerDay: 0,
      avgKmPerDay: 0,
      firstVisitDate: null,
      lastVisitDate: null,
    },
    today: {
      visits: 0,
      km: 0,
      locations: 0,
      firstVisit: null,
      lastVisit: null,
    },
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [dateFilterError, setDateFilterError] = useState("");

  // Sorting & Pagination
  const [sortConfig, setSortConfig] = useState({
    key: "visitedAt",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Modal States
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionVisit, setSelectedActionVisit] = useState(null);
  const [manualLocationDialogOpen, setManualLocationDialogOpen] = useState(false);
  const [createVisitDialogOpen, setCreateVisitDialogOpen] = useState(false);
  const [manualLocationLoading, setManualLocationLoading] = useState(false);
  const [createVisitLoading, setCreateVisitLoading] = useState(false);
  const [updateVisitLoading, setUpdateVisitLoading] = useState(false);
  const [deleteVisitLoading, setDeleteVisitLoading] = useState(false);

  // Snackbar Handler
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Fetch Visit Stats
  const fetchVisitStats = useCallback(async () => {
    try {
      const response = await VisitService.getVisitStats(fetchAPI);
      if (response?.result) {
        setStats(response.result);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [fetchAPI]);

  // Fetch Visitor Data
  const fetchVisitorData = useCallback(async (currentPage = page + 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await VisitService.getVisits(
        fetchAPI,
        currentPage,
        rowsPerPage,
        {
          ...(dateFilter.startDate && { startDate: format(dateFilter.startDate, "yyyy-MM-dd") }),
          ...(dateFilter.endDate && { endDate: format(dateFilter.endDate, "yyyy-MM-dd") }),
          ...(period !== "All" && { period: period.toLowerCase().replace(" ", "_") }),
        }
      );

      if (response?.result) {
        const visits = response.result.visits || [];
        
        // Calculate summary stats
        const totalVisits = response.result.pagination?.total || visits.length;
        const totalVisitors = new Set(visits.map((v) => v.user?._id)).size;
        const totalDistance = visits.reduce(
          (sum, visit) => sum + (visit.kmFromPrevious || 0),
          0
        );
        
        // Calculate locations count
        const locations = new Set(
          visits.map((v) => `${v.location?.lat},${v.location?.lng}`)
        ).size;

        setVisitorData({
          visits,
          summary: {
            totalVisits,
            totalVisitors,
            totalDistance,
            totalDuration: 0, // API doesn't provide duration
            averageDistance: totalVisits > 0 ? totalDistance / totalVisits : 0,
            averageDuration: 0,
            carbonFootprint: 0,
            locations,
          },
          pagination: response.result.pagination || {
            page: currentPage,
            limit: rowsPerPage,
            total: visits.length,
            pages: 1,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching visitor data:", err);
      setError(err.message || "Failed to fetch visitor data");
      showSnackbar(err.message || "Failed to fetch visitor data", "error");
    } finally {
      setLoading(false);
    }
  }, [fetchAPI, page, rowsPerPage, dateFilter, period, showSnackbar]);

  // Apply Filters
  const applyFilters = useCallback(() => {
    try {
      let filtered = [...visitorData.visits];

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (visit) =>
            (visit.locationName?.toLowerCase() || "").includes(query) ||
            (visit.user?.firstName?.toLowerCase() || "").includes(query) ||
            (visit.user?.lastName?.toLowerCase() || "").includes(query) ||
            (visit.user?.email?.toLowerCase() || "").includes(query) ||
            (visit.remarks?.toLowerCase() || "").includes(query)
        );
      }

      // Location Type filter - Note: API doesn't have location type, so we skip
      
      // Date filter - already applied at API level
      
      // Sorting
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          let aVal = a[sortConfig.key];
          let bVal = b[sortConfig.key];

          if (sortConfig.key === "visitedAt" || sortConfig.key === "createdAt") {
            aVal = aVal ? parseISO(aVal) : new Date(0);
            bVal = bVal ? parseISO(bVal) : new Date(0);
          } else if (sortConfig.key === "kmFromPrevious") {
            aVal = aVal || 0;
            bVal = bVal || 0;
          } else if (sortConfig.key === "locationName") {
            aVal = aVal?.toLowerCase() || "";
            bVal = bVal?.toLowerCase() || "";
          }

          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    } catch (err) {
      console.error("Filter error:", err);
      return visitorData.visits;
    }
  }, [
    visitorData.visits,
    searchQuery,
    sortConfig,
  ]);

  // Effects
  useEffect(() => {
    if (hasAccess(userRole)) {
      fetchVisitorData(1);
      fetchVisitStats();
    }
  }, [fetchVisitorData, fetchVisitStats, userRole]);

  useEffect(() => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const from = new Date(dateFilter.startDate);
      const to = new Date(dateFilter.endDate);
      const error = from > to ? "Start date cannot be after end date" : "";
      setDateFilterError(error);
    } else {
      setDateFilterError("");
    }
  }, [dateFilter.startDate, dateFilter.endDate]);

  // Handlers
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleViewClick = useCallback(
    async (visit) => {
      if (!visit?._id) {
        showSnackbar("Invalid visit data", "error");
        return;
      }

      try {
        // Fetch latest visit data
        const response = await VisitService.getVisitById(fetchAPI, visit._id);
        if (response?.result) {
          setSelectedVisit(response.result);
          setViewModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching visit details:", error);
        showSnackbar("Failed to fetch visit details", "error");
      }
    },
    [fetchAPI, showSnackbar]
  );

  const handleEditClick = useCallback(
    async (visit) => {
      if (!visit?._id) {
        showSnackbar("Invalid visit data", "error");
        return;
      }

      try {
        // Fetch latest visit data for editing
        const response = await VisitService.getVisitById(fetchAPI, visit._id);
        if (response?.result) {
          setSelectedVisit(response.result);
          setEditModalOpen(true);
          setViewModalOpen(false);
        }
      } catch (error) {
        console.error("Error fetching visit details for edit:", error);
        showSnackbar("Failed to fetch visit details", "error");
      }
    },
    [fetchAPI, showSnackbar]
  );

  const handleUpdateVisit = useCallback(async (formData, photo, removeCurrentPhoto) => {
    if (!selectedVisit?._id) return;

    try {
      setUpdateVisitLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('lat', formData.latitude);
      formDataToSend.append('lng', formData.longitude);
      formDataToSend.append('locationName', formData.locationName);
      formDataToSend.append('remarks', formData.remarks);
      
      if (photo) {
        formDataToSend.append('photo', photo);
      } else if (removeCurrentPhoto) {
        formDataToSend.append('removePhoto', 'true');
      }

      const response = await VisitService.updateVisit(fetchAPI, selectedVisit._id, formDataToSend);
      
      if (response?.result) {
        showSnackbar("Visit updated successfully!", "success");
        setEditModalOpen(false);
        setViewModalOpen(false);
        fetchVisitorData(page + 1);
        fetchVisitStats();
      }
    } catch (error) {
      console.error("Error updating visit:", error);
      showSnackbar(error.message || "Failed to update visit", "error");
    } finally {
      setUpdateVisitLoading(false);
    }
  }, [fetchAPI, selectedVisit, showSnackbar, fetchVisitorData, fetchVisitStats, page]);

  const handleDeleteVisit = useCallback(async (visitId) => {
    if (!visitId) return;

    try {
      setDeleteVisitLoading(true);

      const response = await VisitService.deleteVisit(fetchAPI, visitId);
      
      if (response?.success) {
        showSnackbar("Visit deleted successfully!", "success");
        setViewModalOpen(false);
        fetchVisitorData(1);
        fetchVisitStats();
      }
    } catch (error) {
      console.error("Error deleting visit:", error);
      showSnackbar(error.message || "Failed to delete visit", "error");
    } finally {
      setDeleteVisitLoading(false);
    }
  }, [fetchAPI, showSnackbar, fetchVisitorData, fetchVisitStats]);

  const handleCreateVisit = useCallback(async (formData, photo) => {
    try {
      setCreateVisitLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('lat', formData.latitude);
      formDataToSend.append('lng', formData.longitude);
      formDataToSend.append('locationName', formData.locationName);
      formDataToSend.append('remarks', formData.remarks);
      
      if (photo) {
        formDataToSend.append('photo', photo);
      }

      const response = await VisitService.createVisit(fetchAPI, formDataToSend);
      
      if (response?.result) {
        showSnackbar("Visit created successfully!", "success");
        setCreateVisitDialogOpen(false);
        fetchVisitorData(1);
        fetchVisitStats();
      }
    } catch (error) {
      console.error("Error creating visit:", error);
      showSnackbar(error.message || "Failed to create visit", "error");
    } finally {
      setCreateVisitLoading(false);
    }
  }, [fetchAPI, showSnackbar, fetchVisitorData, fetchVisitStats]);

  const handleManualLocationSubmit = useCallback(async (locationData) => {
    try {
      setManualLocationLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('lat', locationData.latitude);
      formDataToSend.append('lng', locationData.longitude);
      formDataToSend.append('locationName', locationData.locationName);
      formDataToSend.append('remarks', locationData.remarks || `Manual location - ${locationData.locationType}`);
      
      // Upload images
      if (locationData.images && locationData.images.length > 0) {
        locationData.images.forEach((image) => {
          formDataToSend.append('photo', image);
        });
      }

      const response = await VisitService.createVisit(fetchAPI, formDataToSend);
      
      if (response?.result) {
        showSnackbar("Manual location added successfully!", "success");
        setManualLocationDialogOpen(false);
        fetchVisitorData(1);
        fetchVisitStats();
      }
    } catch (error) {
      console.error("Error adding manual location:", error);
      showSnackbar(error.message || "Failed to add location", "error");
    } finally {
      setManualLocationLoading(false);
    }
  }, [fetchAPI, showSnackbar, fetchVisitorData, fetchVisitStats]);

  const handleLocationUpdate = useCallback((visitId, locationData) => {
    // This is for real-time tracking, not persisted to API
    setVisitorData((prev) => {
      const updatedVisits = prev.visits.map((visit) => {
        if (visit._id === visitId) {
          return {
            ...visit,
            currentLocation: locationData.currentLocation,
            distance: (visit.kmFromPrevious || 0) + (locationData.distance || 0),
            locationHistory: locationData.locationHistory || visit.locationHistory,
          };
        }
        return visit;
      });

      return {
        ...prev,
        visits: updatedVisits,
      };
    });
  }, []);

  const handleActionMenuOpen = useCallback((event, visit) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionVisit(visit);
  }, []);

  const handleActionMenuClose = useCallback(() => {
    setActionMenuAnchor(null);
    setSelectedActionVisit(null);
  }, []);

  const handleActionSelect = useCallback(
    (action) => {
      if (!selectedActionVisit) return;

      switch (action) {
        case "view":
          handleViewClick(selectedActionVisit);
          break;
        case "edit":
          if (userPermissions.canEdit) {
            handleEditClick(selectedActionVisit);
          }
          break;
        case "delete":
          if (userPermissions.canDelete && window.confirm("Are you sure you want to delete this visit?")) {
            handleDeleteVisit(selectedActionVisit._id);
          }
          break;
        default:
          break;
      }

      handleActionMenuClose();
    },
    [selectedActionVisit, handleViewClick, handleEditClick, handleDeleteVisit, userPermissions]
  );

  const handleViewImage = useCallback(
    (imageUrl, imageName = "Location Image") => {
      if (!imageUrl) {
        showSnackbar("No image available to view", "error");
        return;
      }
      setCurrentImageUrl(imageUrl);
      setCurrentImages([{ url: imageUrl, name: imageName }]);
      setImageViewerOpen(true);
    },
    [showSnackbar]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setLocationTypeFilter("All");
    setPeriod("This Week");
    setDateFilter({ startDate: null, endDate: null });
    setDateFilterError("");
    setSortConfig({ key: "visitedAt", direction: "desc" });
    setPage(0);
    if (showFilterPanel) setShowFilterPanel(false);
    
    // Refresh data with cleared filters
    fetchVisitorData(1);
  }, [showFilterPanel, fetchVisitorData]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage - 1);
    fetchVisitorData(newPage);
  }, [fetchVisitorData]);

  const handleRowsPerPageChange = useCallback((event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    fetchVisitorData(1);
  }, [fetchVisitorData]);

  // Memoized Computed Values
  const filteredVisits = useMemo(() => applyFilters(), [applyFilters]);

  const paginatedVisits = useMemo(() => {
    // Since API handles pagination, just return current page data
    return visitorData.visits;
  }, [visitorData.visits]);

  const totalPages = useMemo(
    () => visitorData.pagination?.pages || 1,
    [visitorData.pagination]
  );

  const summaryCards = useMemo(
    () => [
      {
        label: "Total Visits",
        value: visitorData.summary.totalVisits,
        color: PRIMARY,
        icon: <LocationOn sx={{ fontSize: 24 }} />,
        subText: "All field visits",
        gradient: "linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)",
      },
      {
        label: "Total Distance",
        value: formatDistance(visitorData.summary.totalDistance),
        color: WARNING,
        icon: <Route sx={{ fontSize: 24 }} />,
        subText: "KM traveled",
        gradient: "linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)",
      },
      {
        label: "Today's Visits",
        value: stats.today?.visits || 0,
        color: INFO,
        icon: <AccessTime sx={{ fontSize: 24 }} />,
        subText: "Visits today",
        gradient: "linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)",
      },
      {
        label: "Total Days",
        value: stats.overall?.totalDays || 0,
        color: "#607d8b",
        icon: <CalendarToday sx={{ fontSize: 24 }} />,
        subText: "Active days",
        gradient: "linear-gradient(135deg, #455a64 0%, #78909c 100%)",
      },
    ],
    [visitorData.summary, stats]
  );

  // Access Check
  if (!hasAccess(userRole)) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            p: 4,
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: alpha(ERROR, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ERROR,
              mx: "auto",
              mb: 2,
            }}
          >
            <LocationDisabled sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access the visitor tracking page.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              mt: 2,
              bgcolor: PRIMARY,
              "&:hover": { bgcolor: SECONDARY },
            }}
          >
            Go to Dashboard
          </Button>
        </Card>
      </Box>
    );
  }

  if (loading && visitorData.visits.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error && visitorData.visits.length === 0) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Card sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: alpha(ERROR, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ERROR,
              mx: "auto",
              mb: 2,
            }}
          >
            <Warning sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Error Loading Data
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => fetchVisitorData(1)}
            startIcon={<Refresh />}
            sx={{ bgcolor: PRIMARY, "&:hover": { bgcolor: SECONDARY } }}
          >
            Retry
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Modals */}
      <ImageViewerModal
        open={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageUrl={currentImageUrl}
        images={currentImages}
        title="Location Image"
      />

      <ViewVisitModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        visit={selectedVisit}
        userRole={userRole}
        showSnackbar={showSnackbar}
        handleViewImage={handleViewImage}
        onEdit={handleEditClick}
        onDelete={handleDeleteVisit}
      />

      <EditVisitDialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        visit={selectedVisit}
        onSubmit={handleUpdateVisit}
        loading={updateVisitLoading}
      />

      <CreateVisitDialog
        open={createVisitDialogOpen}
        onClose={() => setCreateVisitDialogOpen(false)}
        onSubmit={handleCreateVisit}
        loading={createVisitLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            color:"#fff",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => handleActionSelect("view")}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <Visibility fontSize="small" sx={{ color: PRIMARY }} />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        
        {userPermissions.canEdit && (
          <MenuItem
            onClick={() => handleActionSelect("edit")}
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemIcon>
              <Edit fontSize="small" sx={{ color: INFO }} />
            </ListItemIcon>
            <ListItemText primary="Edit Visit" />
          </MenuItem>
        )}
        
        {userPermissions.canDelete && (
          <MenuItem
            onClick={() => handleActionSelect("delete")}
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: ERROR }} />
            </ListItemIcon>
            <ListItemText primary="Delete Visit" />
          </MenuItem>
        )}
      </Menu>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mb: 4 }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{
                background: "black",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Visitor & Location Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track visitor movements, distances traveled, and location history in real-time
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {userPermissions.canTrackLocation && (
              <Button
                variant="contained"
                startIcon={<AddLocationAlt />}
                onClick={() => setCreateVisitDialogOpen(true)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  background: PRIMARY,
                  boxShadow: `0 4px 12px ${alpha(SUCCESS, 0.3)}`,
                }}
              >
                Create Visit
              </Button>
            )}
            {userPermissions.canAddManualLocation && (
              <Button
                variant="outlined"
                startIcon={<AddLocationAlt />}
                onClick={() => setManualLocationDialogOpen(true)}
                sx={{ borderRadius: 3, px: 3, py: 1.2 }}
              >
                Add Manual Location
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => fetchVisitorData(page + 1)}
              disabled={loading}
              sx={{ borderRadius: 3, px: 3, py: 1.2 }}
            >
              Refresh
            </Button>
            <Chip
              label={getRoleConfig(userRole).label}
              icon={getRoleConfig(userRole).icon}
              size="medium"
              sx={{
                bgcolor: alpha(PRIMARY, 0.15),
                color: PRIMARY,
                fontWeight: 600,
                borderRadius: 2,
                px: 1,
              }}
            />
          </Box>
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryCards.map((card, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    width:"272px",
                    border: `1px solid ${alpha(card.color, 0.2)}`,
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(card.color, 0.05)} 0%, ${alpha(card.color, 0.02)} 100%)`,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: card.gradient,
                    }}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(card.color, 0.2)} 0%, ${alpha(card.color, 0.1)} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: card.color,
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{ color: card.color }}
                        >
                          {card.value}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {card.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.subText}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${alpha(PRIMARY, 0.1)}`,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Top Filters Row */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <Box sx={{ width: { xs: "100%", md: 350 } }}>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Search by location, name, remarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")}>
                            <Close />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 3,
                        bgcolor: alpha(PRIMARY, 0.02),
                        "&:hover": {
                          bgcolor: alpha(PRIMARY, 0.04),
                        },
                      },
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <FormControl size="medium" sx={{ minWidth: 150 }}>
                    <InputLabel>Period</InputLabel>
                    <Select
                      value={period}
                      label="Period"
                      onChange={(e) => {
                        setPeriod(e.target.value);
                        fetchVisitorData(1);
                      }}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="Today">Today</MenuItem>
                      <MenuItem value="This Week">This Week</MenuItem>
                      <MenuItem value="This Month">This Month</MenuItem>
                      <MenuItem value="All">All Time</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<Tune />}
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                      borderWidth: 2,
                      "&:hover": { borderWidth: 2 },
                    }}
                  >
                    {showFilterPanel ? "Hide Filters" : "More Filters"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 1, px: 3, borderWidth: 2 }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>

              {/* Expanded Filter Panel */}
              <AnimatePresence>
                {showFilterPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: alpha(PRIMARY, 0.02),
                        borderRadius: 3,
                        border: `1px solid ${alpha(PRIMARY, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Date Range Filter
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="From Date"
                            value={dateFilter.startDate}
                            onChange={(date) => {
                              setDateFilter((prev) => ({ ...prev, startDate: date }));
                              fetchVisitorData(1);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "medium",
                                error: !!dateFilterError,
                                helperText: dateFilterError || " ",
                                sx: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="To Date"
                            value={dateFilter.endDate}
                            onChange={(date) => {
                              setDateFilter((prev) => ({ ...prev, endDate: date }));
                              fetchVisitorData(1);
                            }}
                            minDate={dateFilter.startDate}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "medium",
                                error: !!dateFilterError,
                                helperText: dateFilterError || " ",
                                sx: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          </CardContent>
        </Card>

        {/* Location Tracker - Only for TEAM members */}
        {userPermissions.canTrackLocation && selectedVisit && (
          <LocationTracker
            visit={selectedVisit}
            onLocationUpdate={(locationData) =>
              handleLocationUpdate(selectedVisit._id, locationData)
            }
            userRole={userRole}
            onManualLocationClick={() => setManualLocationDialogOpen(true)}
          />
        )}

        {/* Data Table */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(PRIMARY, 0.1)}`,
            overflow: "hidden",
          }}
        >
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(PRIMARY, 0.04) }}>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Visitor</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleSort("kmFromPrevious")}
                        endIcon={
                          sortConfig.key === "kmFromPrevious" && (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          )
                        }
                        sx={{
                          fontWeight: 700,
                          textTransform: "none",
                          color: "text.primary",
                        }}
                      >
                        Distance
                      </Button>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleSort("visitedAt")}
                        endIcon={
                          sortConfig.key === "visitedAt" && (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          )
                        }
                        sx={{
                          fontWeight: 700,
                          textTransform: "none",
                          color: "text.primary",
                        }}
                      >
                        Visit Date
                      </Button>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, py: 2 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 6 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton variant="text" height={40} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paginatedVisits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                bgcolor: alpha(PRIMARY, 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: PRIMARY,
                                mx: "auto",
                                mb: 2,
                              }}
                            >
                              <LocationOn sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              No Visits Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {filteredVisits.length === 0
                                ? "No visitor tracking data available"
                                : "No visits match the current filters"}
                            </Typography>
                            {userPermissions.canTrackLocation && (
                              <Button
                                variant="contained"
                                startIcon={<AddLocationAlt />}
                                onClick={() => setCreateVisitDialogOpen(true)}
                                sx={{ mt: 3, borderRadius: 3 }}
                              >
                                Create Visit
                              </Button>
                            )}
                          </Box>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedVisits.map((visit, index) => {
                      return (
                        <TableRow
                          key={visit._id}
                          hover
                          sx={{
                            "&:hover": { bgcolor: alpha(PRIMARY, 0.02) },
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onClick={() => handleViewClick(visit)}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(PRIMARY, 0.1),
                                  color: PRIMARY,
                                  fontWeight: 600,
                                  width: 44,
                                  height: 44,
                                }}
                              >
                                {visit.user?.firstName?.[0] || "V"}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {visit.user?.firstName} {visit.user?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {visit.user?.role || "Visitor"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {visit.locationName}
                              </Typography>
                              {/* REMOVED: Lat/Long display from list view */}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDistance(visit.kmFromPrevious || 0)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                              {visit.remarks || "No remarks"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {safeFormatDateOnly(visit.visitedAt, "dd MMM yyyy")}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {safeFormatTime(visit.visitedAt)}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Tooltip title="View Details" arrow>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewClick(visit);
                                  }}
                                  sx={{
                                    bgcolor: alpha(PRIMARY, 0.1),
                                    color: PRIMARY,
                                    "&:hover": { bgcolor: alpha(PRIMARY, 0.2) },
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {userPermissions.canEdit && (
                                <Tooltip title="Edit Visit" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(visit);
                                    }}
                                    sx={{
                                      bgcolor: alpha(INFO, 0.1),
                                      color: INFO,
                                      "&:hover": { bgcolor: alpha(INFO, 0.2) },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {visit.photoUrl && (
                                <Tooltip title="View Image" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewImage(visit.photoUrl, visit.locationName);
                                    }}
                                    sx={{
                                      bgcolor: alpha(SUCCESS, 0.1),
                                      color: SUCCESS,
                                      "&:hover": { bgcolor: alpha(SUCCESS, 0.2) },
                                    }}
                                  >
                                    <ImageIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {userPermissions.canTrackLocation && (
                                <Tooltip title="Track Location" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedVisit(visit);
                                    }}
                                    sx={{
                                      bgcolor: alpha(INFO, 0.1),
                                      color: INFO,
                                      "&:hover": { bgcolor: alpha(INFO, 0.2) },
                                    }}
                                  >
                                    <MyLocation fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {userPermissions.canDelete && (
                                <Tooltip title="Delete Visit" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Are you sure you want to delete this visit?")) {
                                        handleDeleteVisit(visit._id);
                                      }
                                    }}
                                    sx={{
                                      bgcolor: alpha(ERROR, 0.1),
                                      color: ERROR,
                                      "&:hover": { bgcolor: alpha(ERROR, 0.2) },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Pagination */}
          {visitorData.visits.length > 0 && (
            <Box
              sx={{
                p: 2.5,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                bgcolor: alpha(PRIMARY, 0.02),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing <strong>{(page * rowsPerPage) + 1}</strong> to{" "}
                  <strong>
                    {Math.min((page + 1) * rowsPerPage, visitorData.pagination.total)}
                  </strong>{" "}
                  of <strong>{visitorData.pagination.total}</strong> visits
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    sx={{ borderRadius: 2 }}
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option} per page
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </Card>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && visitorData.visits.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Backdrop
                open={loading}
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={60} sx={{ color: PRIMARY, mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ color: PRIMARY }}>
                  Loading Visitor Data...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please wait
                </Typography>
              </Backdrop>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </LocalizationProvider>
  );
}