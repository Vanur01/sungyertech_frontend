// pages/VisitorTrackingPage.jsx - Fully Responsive Version
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
  InputLabel,Fab,
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
  Drawer,
  SwipeableDrawer,
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
  Menu as MenuIcon,
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
const PRIMARY = "#4569ea";
const SECONDARY = "#1a237e";
const SUCCESS = "#4caf50";
const WARNING = "#ff9800";
const ERROR = "#f44336";
const INFO = "#2196f3";
const BG_LIGHT = "#f8fafd";

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
    gradient: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
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
    gradient: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
  },
  ZSM: {
    label: "Zone Sales Manager",
    color: PRIMARY,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
  },
  ASM: {
    label: "Area Sales Manager",
    color: PRIMARY,
    icon: <Person sx={{ fontSize: 16 }} />,
    gradient: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
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

// Safe date formatting functions
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
  createVisit: async (fetchAPI, formData) => {
    return await fetchAPI("/visit", {
      method: "POST",
      body: formData,
    });
  },

  getVisits: async (fetchAPI, page = 1, limit = 10, filters = {}) => {
    let url = `/visit?page=${page}&limit=${limit}`;
    
    if (filters.date) url += `&date=${filters.date}`;
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.userId) url += `&userId=${filters.userId}`;
    if (filters.locationType) url += `&locationType=${filters.locationType}`;
    
    return await fetchAPI(url);
  },

  getVisitById: async (fetchAPI, id) => {
    return await fetchAPI(`/visit/${id}`);
  },

  updateVisit: async (fetchAPI, id, formData) => {
    return await fetchAPI(`/visit/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  deleteVisit: async (fetchAPI, id) => {
    return await fetchAPI(`/visit/${id}`, {
      method: "DELETE",
    });
  },

  getVisitStats: async (fetchAPI) => {
    return await fetchAPI("/visit/stats");
  },

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

  getDailySummary: async (fetchAPI, date) => {
    return await fetchAPI(`/visit/daily-summary?date=${date}`);
  },
};

// ========== MOBILE VISIT CARD COMPONENT ==========
const MobileVisitCard = ({ visit, onView, onEdit, onDelete, onViewImage, canEdit, canDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(PRIMARY, 0.1)}`,
          overflow: "hidden",
          bgcolor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(PRIMARY, 0.1),
                  color: PRIMARY,
                  width: 44,
                  height: 44,
                }}
              >
                {visit.user?.firstName?.[0] || "V"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: PRIMARY }}>
                  {visit.user?.firstName} {visit.user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {visit.user?.role || "Visitor"}
                </Typography>
              </Box>
            </Box>
            {visit.kmFromPrevious > 0 && (
              <Chip
                label={formatDistance(visit.kmFromPrevious)}
                size="small"
                sx={{
                  bgcolor: alpha(WARNING, 0.1),
                  color: WARNING,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* Location Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              {visit.locationName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <AccessTime sx={{ fontSize: 14 }} />
              {safeFormatDateOnly(visit.visitedAt, "dd MMM yyyy")} • {safeFormatTime(visit.visitedAt)}
            </Typography>
          </Box>

          {/* Remarks (if available) */}
          {visit.remarks && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(PRIMARY, 0.03),
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {visit.remarks}
              </Typography>
            </Box>
          )}

          {/* Expandable Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(PRIMARY, 0.1)}` }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Latitude
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {visit.location?.lat?.toFixed(6)}° N
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Longitude
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {visit.location?.lng?.toFixed(6)}° E
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ color: PRIMARY }}
            >
              {expanded ? "Show Less" : "View Coordinates"}
            </Button>
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onView(visit)}
                  sx={{
                    bgcolor: alpha(PRIMARY, 0.1),
                    color: PRIMARY,
                    "&:hover": { bgcolor: alpha(PRIMARY, 0.2) },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>

              {visit.photoUrl && (
                <Tooltip title="View Image">
                  <IconButton
                    size="small"
                    onClick={() => onViewImage(visit.photoUrl, visit.locationName)}
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

              {canEdit && (
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(visit)}
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

              {canDelete && (
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(visit._id)}
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
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
              Capture
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
              maxHeight: 300,
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
              Use
            </Button>
            <Button
              variant="outlined"
              onClick={retake}
              startIcon={<Refresh />}
              sx={{ borderRadius: 2 }}
            >
              Retake
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

// ========== LOCATION PERMISSION DIALOG ==========
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
          background: "white",
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
                bgcolor: alpha(PRIMARY, 0.1),
                mb: 2,
              }}
            >
              <LocationOn
                sx={{
                  fontSize: 64,
                  color: PRIMARY,
                }}
              />
            </Box>
          </motion.div>
          
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Location Access Required
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
            To track your visits and calculate distances accurately, we need access to your location
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: isMobile ? 2 : 4, py: 2 }}>
          <Stack spacing={2}>
            <Grid container spacing={1}>
              {[
                {
                  icon: <GpsFixed sx={{ fontSize: 24 }} />,
                  title: "Accurate Tracking",
                  description: "Get precise location data",
                  color: PRIMARY,
                },
                {
                  icon: <Route sx={{ fontSize: 24 }} />,
                  title: "Distance Calculation",
                  description: "Auto-calculate KM traveled",
                  color: SUCCESS,
                },
                {
                  icon: <TimelineIcon sx={{ fontSize: 24 }} />,
                  title: "Visit History",
                  description: "Complete location history",
                  color: WARNING,
                },
              ].map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: alpha(item.color, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(item.color, 0.1)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(item.color, 0.1),
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                bgcolor: alpha(INFO, 0.05),
                border: `1px solid ${alpha(INFO, 0.1)}`,
              }}
              icon={<Security sx={{ color: INFO }} />}
            >
              <Typography variant="caption">
                We only track your location while you are actively using the app.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: isMobile ? 2 : 4,
            pt: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onDeny}
            size={isMobile ? "medium" : "large"}
            sx={{ borderRadius: 2 }}
          >
            Not Now
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onAllow}
            size={isMobile ? "medium" : "large"}
            startIcon={<MyLocation />}
            sx={{
              borderRadius: 2,
              bgcolor: PRIMARY,
              "&:hover": { bgcolor: SECONDARY },
            }}
          >
            Allow Access
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
            errorMsg = "Location permission denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
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
      <Dialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Take Photo
            </Typography>
            <IconButton onClick={() => setShowCamera(false)} size="small">
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: alpha(PRIMARY, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: PRIMARY,
                }}
              >
                <AddLocationAlt sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Create Visit
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Record a new field visit
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2, py: 0.5 }}>
              <Typography variant="caption">Enter coordinates or use current location</Typography>
            </Alert>

            <Button
              variant="contained"
              startIcon={gettingLocation ? <CircularProgress size={18} /> : <MyLocation />}
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              fullWidth
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: PRIMARY,
                "&:hover": { bgcolor: SECONDARY },
              }}
            >
              {gettingLocation ? "Getting Location..." : "Use Current Location"}
            </Button>

            {errors.location && (
              <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>
                <Typography variant="caption">{errors.location}</Typography>
              </Alert>
            )}

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude *"
                  value={formData.latitude}
                  onChange={handleInputChange("latitude")}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude *"
                  value={formData.longitude}
                  onChange={handleInputChange("longitude")}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Location Name *"
              value={formData.locationName}
              onChange={handleInputChange("locationName")}
              fullWidth
              size="small"
              placeholder="Enter location name"
              error={!!errors.locationName}
              helperText={errors.locationName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={handleInputChange("remarks")}
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Enter any remarks..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <Box>
              <Typography variant="caption" fontWeight={600} gutterBottom>
                Photo (Optional)
              </Typography>
              
              {!previewUrl ? (
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  fullWidth
                  size="small"
                  sx={{
                    p: 1,
                    border: `1px dashed ${alpha(PRIMARY, 0.3)}`,
                    borderRadius: 1.5,
                    color: PRIMARY,
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
                      maxHeight: 150,
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.9)",
                    }}
                    onClick={handleRemovePhoto}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth={isMobile}
            size="small"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth={isMobile}
            size="small"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              borderRadius: 1.5,
              bgcolor: SUCCESS,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
          >
            {loading ? "Creating..." : "Create"}
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
            errorMsg = "Location permission denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
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
      <Dialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Take Photo
            </Typography>
            <IconButton onClick={() => setShowCamera(false)} size="small">
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: alpha(PRIMARY, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: PRIMARY,
                }}
              >
                <EditLocationAlt sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Edit Visit
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Update visit information
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={gettingLocation ? <CircularProgress size={18} /> : <MyLocation />}
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              fullWidth
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: PRIMARY,
                "&:hover": { bgcolor: SECONDARY },
              }}
            >
              {gettingLocation ? "Getting Location..." : "Use Current Location"}
            </Button>

            {errors.location && (
              <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>
                <Typography variant="caption">{errors.location}</Typography>
              </Alert>
            )}

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude *"
                  value={formData.latitude}
                  onChange={handleInputChange("latitude")}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude *"
                  value={formData.longitude}
                  onChange={handleInputChange("longitude")}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: "0.000001" }}
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Location Name *"
              value={formData.locationName}
              onChange={handleInputChange("locationName")}
              fullWidth
              size="small"
              placeholder="Enter location name"
              error={!!errors.locationName}
              helperText={errors.locationName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={handleInputChange("remarks")}
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Enter any remarks..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <Box>
              <Typography variant="caption" fontWeight={600} gutterBottom>
                Photo
              </Typography>
              
              {!previewUrl ? (
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  fullWidth
                  size="small"
                  sx={{
                    p: 1,
                    border: `1px dashed ${alpha(PRIMARY, 0.3)}`,
                    borderRadius: 1.5,
                    color: PRIMARY,
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
                      maxHeight: 150,
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                  <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 4, right: 4 }}>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                      onClick={() => setShowCamera(true)}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                      onClick={handleRemovePhoto}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth={isMobile}
            size="small"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth={isMobile}
            size="small"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              borderRadius: 1.5,
              bgcolor: SUCCESS,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ========== IMAGE VIEWER MODAL ==========
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
    link.download = currentImage.name || `image_${Date.now()}.jpg`;
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
          py: 1,
          px: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {currentImage?.name || title || "Image"}
          </Typography>
          {images.length > 1 && (
            <Chip
              label={`${currentIndex + 1}/${images.length}`}
              size="small"
              sx={{ bgcolor: alpha(PRIMARY, 0.1), color: PRIMARY, fontWeight: 600, height: 24 }}
            />
          )}
        </Box>
        <Box display="flex" gap={0.5}>
          <IconButton onClick={() => setFullscreen(!fullscreen)} size="small">
            {fullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
          </IconButton>
          <IconButton onClick={handleDownload} size="small">
            <GetApp fontSize="small" />
          </IconButton>
          <IconButton onClick={handleClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: fullscreen ? "#000" : "transparent",
          minHeight: fullscreen ? "calc(100vh - 57px)" : 300,
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
                maxHeight: fullscreen ? "100vh" : "60vh",
                p: fullscreen ? 0 : 1,
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.name || "Location"}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease",
                  maxWidth: "100%",
                  maxHeight: fullscreen ? "100vh" : "60vh",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Box>

            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.9)",
                    boxShadow: 2,
                  }}
                  size="small"
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.9)",
                    boxShadow: 2,
                  }}
                  size="small"
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <ImageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Preview not available
            </Typography>
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
            gap: 0.5,
            py: 1,
          }}
        >
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn fontSize="small" />
          </IconButton>
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut fontSize="small" />
          </IconButton>
          <IconButton onClick={handleRotateRight} size="small">
            <RotateRight fontSize="small" />
          </IconButton>
          <IconButton onClick={handleRotateLeft} size="small">
            <RotateLeft fontSize="small" />
          </IconButton>
          <IconButton onClick={handleReset} size="small">
            <Refresh fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
            {Math.round(zoom * 100)}%
          </Typography>
        </DialogActions>
      )}
    </Dialog>
  );
});

ImageViewerModal.displayName = "ImageViewerModal";

// ========== VIEW VISIT DETAILS MODAL ==========
const ViewVisitModal = React.memo(
  ({ open, onClose, visit, userRole, showSnackbar, handleViewImage, onEdit, onDelete }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeTab, setActiveTab] = useState(0);
    const { fetchAPI } = useAuth();

    const userRoleConfig = useMemo(() => getRoleConfig(userRole), [userRole]);
    const permissions = useMemo(() => getUserPermissions(userRole), [userRole]);

    if (!visit) return null;

    const tabs = [
      {
        label: "Info",
        icon: <Person />,
        content: (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {visit.user?.firstName} {visit.user?.lastName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Chip
                    label={getRoleConfig(visit.user?.role).label}
                    size="small"
                    sx={{ bgcolor: alpha(PRIMARY, 0.1), color: PRIMARY, fontWeight: 600, height: 24 }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">
                    {safeFormatDate(visit.visitedAt, "dd MMM yyyy, hh:mm a")}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Remarks</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {visit.remarks || "No remarks"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ),
      },
      {
        label: "Location",
        icon: <LocationOn />,
        content: (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(SUCCESS, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box sx={{ p: 1, bgcolor: alpha(SUCCESS, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Location Name</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                    {visit.locationName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Latitude</Typography>
                  <Typography variant="body2">
                    {visit.location?.lat?.toFixed(6)}° N
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Longitude</Typography>
                  <Typography variant="body2">
                    {visit.location?.lng?.toFixed(6)}° E
                  </Typography>
                </Box>
                {visit.kmFromPrevious > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: alpha(WARNING, 0.05), borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Distance</Typography>
                    <Typography variant="body2" fontWeight={600} color={WARNING}>
                      {formatDistance(visit.kmFromPrevious)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        ),
      },
      {
        label: "Image",
        icon: <ImageIcon />,
        content: (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {visit.photoUrl ? (
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewImage(visit.photoUrl, visit.locationName)}
                >
                  <img
                    src={visit.photoUrl}
                    alt={visit.locationName}
                    style={{
                      width: "100%",
                      maxHeight: 250,
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <ZoomIn sx={{ fontSize: 14 }} />
                    <Typography variant="caption">View</Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ImageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No image uploaded
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ),
      },
    ];

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: PRIMARY,
            color: "white",
            py: 1.5,
            px: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: PRIMARY,
                  width: 36,
                  height: 36,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {visit.user?.firstName?.[0] || "V"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {visit.user?.firstName} {visit.user?.lastName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {visit.locationName}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={0.5}>
              {permissions.canEdit && (
                <IconButton
                  onClick={() => {
                    onEdit(visit);
                    onClose();
                  }}
                  size="small"
                  sx={{ color: "white", "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
              {permissions.canDelete && (
                <IconButton
                  onClick={() => {
                    if (window.confirm("Delete this visit?")) {
                      onDelete(visit._id);
                      onClose();
                    }
                  }}
                  size="small"
                  sx={{ color: "white", "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
              <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 48,
                  py: 1,
                  px: 2,
                  fontSize: "0.8rem",
                },
                "& .Mui-selected": {
                  color: `${PRIMARY} !important`,
                },
                "& .MuiTabs-indicator": {
                  bgcolor: PRIMARY,
                  height: 2,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 2, maxHeight: "60vh", overflow: "auto" }}>
            {tabs[activeTab].content}
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
);

ViewVisitModal.displayName = "ViewVisitModal";

// ========== LOADING SKELETON ==========
const LoadingSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={6} sm={6} md={3} key={item}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
    <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, mb: 2 }} />
    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
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

  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
      limit: isMobile ? 5 : 10,
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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
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
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);

  // Modal States
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionVisit, setSelectedActionVisit] = useState(null);
  const [createVisitDialogOpen, setCreateVisitDialogOpen] = useState(false);
  const [createVisitLoading, setCreateVisitLoading] = useState(false);
  const [updateVisitLoading, setUpdateVisitLoading] = useState(false);
  const [deleteVisitLoading, setDeleteVisitLoading] = useState(false);

  // Snackbar Handler
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Update rows per page when screen size changes
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
    setVisitorData(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        limit: isMobile ? 5 : 10
      }
    }));
  }, [isMobile]);

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
        
        const totalVisits = response.result.pagination?.total || visits.length;
        const totalVisitors = new Set(visits.map((v) => v.user?._id)).size;
        const totalDistance = visits.reduce(
          (sum, visit) => sum + (visit.kmFromPrevious || 0),
          0
        );
        
        const locations = new Set(
          visits.map((v) => `${v.location?.lat},${v.location?.lng}`)
        ).size;

        setVisitorData({
          visits,
          summary: {
            totalVisits,
            totalVisitors,
            totalDistance,
            totalDuration: 0,
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
          if (userPermissions.canDelete && window.confirm("Delete this visit?")) {
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
        showSnackbar("No image available", "error");
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
    setPeriod("This Week");
    setDateFilter({ startDate: null, endDate: null });
    setDateFilterError("");
    setSortConfig({ key: "visitedAt", direction: "desc" });
    setPage(0);
    setFilterDrawerOpen(false);
    if (showFilterPanel) setShowFilterPanel(false);
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

  // Mobile Filter Drawer
  const FilterDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      onOpen={() => setFilterDrawerOpen(true)}
      disableSwipeToOpen={false}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '80vh',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="All">All Time</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="Start Date"
            value={dateFilter.startDate}
            onChange={(date) => setDateFilter(prev => ({ ...prev, startDate: date }))}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                error: !!dateFilterError,
                helperText: dateFilterError,
              },
            }}
          />

          <DatePicker
            label="End Date"
            value={dateFilter.endDate}
            onChange={(date) => setDateFilter(prev => ({ ...prev, endDate: date }))}
            minDate={dateFilter.startDate}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => {
              setPage(0);
              fetchVisitorData(1);
              setFilterDrawerOpen(false);
            }}
            fullWidth
            size="small"
            sx={{ bgcolor: PRIMARY }}
          >
            Apply Filters
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<Clear />}
            fullWidth
            size="small"
          >
            Clear All
          </Button>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );

  // Memoized Computed Values
  const filteredVisits = useMemo(() => visitorData.visits, [visitorData.visits]);
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
      },
      {
        label: "Total Distance",
        value: formatDistance(visitorData.summary.totalDistance),
        color: WARNING,
        icon: <Route sx={{ fontSize: 24 }} />,
        subText: "KM traveled",
      },
      {
        label: "Today's Visits",
        value: stats.today?.visits || 0,
        color: INFO,
        icon: <AccessTime sx={{ fontSize: 24 }} />,
        subText: "Visits today",
      },
      {
        label: "Locations",
        value: visitorData.summary.locations,
        color: SUCCESS,
        icon: <Place sx={{ fontSize: 24 }} />,
        subText: "Unique locations",
      },
    ],
    [visitorData.summary, stats]
  );

  // Access Check
  if (!hasAccess(userRole)) {
    return (
      <Box sx={{ p: 2, textAlign: "center", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ maxWidth: 400, p: 3, borderRadius: 3 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(ERROR, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: ERROR, mx: "auto", mb: 2 }}>
            <LocationDisabled sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You don't have permission to access this page.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/dashboard")} sx={{ bgcolor: PRIMARY }}>
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
      <Box sx={{ p: 2 }}>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(ERROR, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: ERROR, mx: "auto", mb: 2 }}>
            <Warning sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Error Loading Data
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => fetchVisitorData(1)} startIcon={<Refresh />} sx={{ bgcolor: PRIMARY }}>
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
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180 } }}
      >
        <MenuItem onClick={() => handleActionSelect("view")} dense>
          <ListItemIcon><Visibility fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        {userPermissions.canEdit && (
          <MenuItem onClick={() => handleActionSelect("edit")} dense>
            <ListItemIcon><Edit fontSize="small" sx={{ color: INFO }} /></ListItemIcon>
            <ListItemText primary="Edit Visit" />
          </MenuItem>
        )}
        {userPermissions.canDelete && (
          <MenuItem onClick={() => handleActionSelect("delete")} dense>
            <ListItemIcon><Delete fontSize="small" sx={{ color: ERROR }} /></ListItemIcon>
            <ListItemText primary="Delete Visit" />
          </MenuItem>
        )}
      </Menu>

      {/* Mobile Filter Drawer */}
      <FilterDrawer />

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 1.5 : 3, minHeight: "100vh" }}>
        {/* Header */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
          <Box>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={800} sx={{ color: PRIMARY }}>
              Visitor Tracking
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Track visitor movements and location history
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {userPermissions.canTrackLocation && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddLocationAlt />}
                onClick={() => setCreateVisitDialogOpen(true)}
                sx={{ bgcolor: PRIMARY, borderRadius: 2 }}
              >
                {isMobile ? "Add" : "Create Visit"}
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={() => fetchVisitorData(page + 1)}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {isMobile ? "" : "Refresh"}
            </Button>
          </Box>
        </Stack>

        {/* Summary Cards - 2 per row on mobile */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {summaryCards.map((card, index) => (
            <Grid item xs={6} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${alpha(card.color, 0.2)}`,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(card.color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                        {card.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: card.color }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8rem" }}>
                        {card.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {card.subText}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filters */}
        <Card sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />

                {isMobile ? (
                  <IconButton
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{ bgcolor: alpha(PRIMARY, 0.1), color: PRIMARY, borderRadius: 2 }}
                  >
                    <Tune />
                  </IconButton>
                ) : (
                  <>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Period</InputLabel>
                      <Select
                        value={period}
                        label="Period"
                        onChange={(e) => setPeriod(e.target.value)}
                      >
                        <MenuItem value="Today">Today</MenuItem>
                        <MenuItem value="This Week">This Week</MenuItem>
                        <MenuItem value="This Month">This Month</MenuItem>
                        <MenuItem value="All">All</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      startIcon={<Tune />}
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      Filters
                    </Button>
                  </>
                )}
              </Box>

              {!isMobile && showFilterPanel && (
                <Box sx={{ p: 2, bgcolor: alpha(PRIMARY, 0.02), borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Date Range
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Start Date"
                        value={dateFilter.startDate}
                        onChange={(date) => setDateFilter(prev => ({ ...prev, startDate: date }))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!dateFilterError,
                            helperText: dateFilterError,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="End Date"
                        value={dateFilter.endDate}
                        onChange={(date) => setDateFilter(prev => ({ ...prev, endDate: date }))}
                        minDate={dateFilter.startDate}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setPage(0);
                          fetchVisitorData(1);
                        }}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        size="small"
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Content - Mobile Cards or Desktop Table */}
        {isMobile ? (
          <Box>
            <AnimatePresence>
              {visitorData.visits.length > 0 ? (
                visitorData.visits.map((visit) => (
                  <MobileVisitCard
                    key={visit._id}
                    visit={visit}
                    onView={handleViewClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteVisit}
                    onViewImage={handleViewImage}
                    canEdit={userPermissions.canEdit}
                    canDelete={userPermissions.canDelete}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(PRIMARY, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY, mx: "auto", mb: 2 }}>
                    <LocationOn sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    No Visits Found
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {searchQuery || dateFilter.startDate || dateFilter.endDate
                      ? "Try adjusting your filters"
                      : "No visitor data available"}
                  </Typography>
                </Box>
              )}
            </AnimatePresence>

            {/* Mobile Pagination */}
            {visitorData.visits.length > 0 && (
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                />
              </Box>
            )}
          </Box>
        ) : (
          /* Desktop Table */
          <Card sx={{ borderRadius: 2, border: `1px solid ${alpha(PRIMARY, 0.1)}` }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(PRIMARY, 0.04) }}>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Visitor</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Distance</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, py: 1.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton height={40} /></TableCell>
                      </TableRow>
                    ))
                  ) : visitorData.visits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No visits found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visitorData.visits.map((visit) => (
                      <TableRow key={visit._id} hover sx={{ cursor: "pointer" }} onClick={() => handleViewClick(visit)}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(PRIMARY, 0.1), color: PRIMARY }}>
                              {visit.user?.firstName?.[0] || "V"}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {visit.user?.firstName} {visit.user?.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{visit.locationName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color={WARNING}>
                            {formatDistance(visit.kmFromPrevious || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {safeFormatDateOnly(visit.visitedAt, "dd MMM yyyy")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {safeFormatTime(visit.visitedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewClick(visit); }}>
                              <Visibility fontSize="small" sx={{ color: PRIMARY }} />
                            </IconButton>
                            {userPermissions.canEdit && (
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(visit); }}>
                                <Edit fontSize="small" sx={{ color: INFO }} />
                              </IconButton>
                            )}
                            {visit.photoUrl && (
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewImage(visit.photoUrl, visit.locationName); }}>
                                <ImageIcon fontSize="small" sx={{ color: SUCCESS }} />
                              </IconButton>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Desktop Pagination */}
            {visitorData.visits.length > 0 && (
              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {(page * rowsPerPage) + 1} to {Math.min((page + 1) * rowsPerPage, visitorData.pagination.total)} of {visitorData.pagination.total}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Card>
        )}

        {/* Mobile FAB */}
        {isMobile && userPermissions.canTrackLocation && (
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              zIndex: 1000,
              bgcolor: PRIMARY,
            }}
            onClick={() => setCreateVisitDialogOpen(true)}
          >
            <AddLocationAlt />
          </Fab>
        )}
      </Box>
    </LocalizationProvider>
  );
}