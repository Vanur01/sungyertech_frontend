// pages/AttendancePage.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Stack,
  Divider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  alpha,
  InputAdornment,
  Slide,
  FormHelperText,
  LinearProgress as MuiLinearProgress,
  Skeleton,
  Badge,
  AvatarGroup,
  Menu,
  ListItemIcon,
  ListItemText,
  Backdrop,
  Breadcrumbs,
  Link,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Fade,Snackbar,Pagination,
  Zoom,
  Grow,
} from '@mui/material';

// Import Timeline components
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Clear as ClearIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  FilterList as FilterIcon,
  BarChart as ChartIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  EventAvailable as EventIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  MyLocation as MyLocationIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Info as InfoIcon,
  ArrowUpward,
  ArrowDownward,
  Close as CloseIcon,
  Tune as TuneIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  Percent as PercentIcon,
  Fingerprint as FingerprintIcon,
  MoreVert,
  Visibility,
  Clear,
  Save,
  CloudUpload,
  PhotoCamera,
  LocationOn,
  Route,
  Timeline as TimelineIcon,
  Place,
  GpsFixed,
  GpsOff,
  DirectionsWalk,
  DirectionsCar,
  TwoWheeler,
  Business,
  Home,
  Terrain,
  Speed,
  PinDrop,
  Navigation,
  NearMe,
  LocationSearching,
  LocationDisabled,
  StreetView,
  MapOutlined,
  FmdGood,
  FmdBad,
  Flag,
  Room,
  CalendarToday,
  Security,
  Verified,
  PendingActions,
  CheckCircleOutline,
  HighlightOff,
  WatchLater,
  EventBusy,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
  Print,
  Share,
  Email,
  WhatsApp,
  FileCopy,
  PictureAsPdf,
  Description,
  InsertDriveFile,
  GetApp,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Fullscreen,
  FullscreenExit,
  ArrowBack,
  ArrowForward,
  RadioButtonChecked,
  RadioButtonUnchecked,
  TripOrigin,
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
  WbSunny,
  WbCloudy,
  NightsStay,
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isToday, differenceInMinutes, startOfWeek, startOfMonth, subDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ========== CONSTANTS & CONFIGURATION ==========
const PRIMARY = '#3a5ac8';
const SECONDARY = '#2c489e';
const SUCCESS = '#4caf50';
const WARNING = '#ff9800';
const ERROR = '#f44336';
const INFO = '#2196f3';

const STATUS_CONFIG = {
  present: {
    label: 'Present',
    color: SUCCESS,
    bg: alpha(SUCCESS, 0.1),
    lightBg: alpha(SUCCESS, 0.05),
    icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
  },
  absent: {
    label: 'Absent',
    color: ERROR,
    bg: alpha(ERROR, 0.1),
    lightBg: alpha(ERROR, 0.05),
    icon: <CancelIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #c62828 0%, #f44336 100%)',
  },
  late: {
    label: 'Late',
    color: WARNING,
    bg: alpha(WARNING, 0.1),
    lightBg: alpha(WARNING, 0.05),
    icon: <TimerIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
  },
  'half-day': {
    label: 'Half Day',
    color: INFO,
    bg: alpha(INFO, 0.1),
    lightBg: alpha(INFO, 0.05),
    icon: <ScheduleIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)',
  },
  'on-leave': {
    label: 'On Leave',
    color: '#9c27b0',
    bg: alpha('#9c27b0', 0.1),
    lightBg: alpha('#9c27b0', 0.05),
    icon: <EventIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
  },
};

const ROLE_CONFIG = {
  Head_office: {
    label: 'Head Office',
    color: PRIMARY,
    bg: alpha(PRIMARY, 0.1),
    lightBg: alpha(PRIMARY, 0.05),
    icon: <Business sx={{ fontSize: 16 }} />,
    gradient: 'linear-gradient(135deg, #3a5ac8 0%, #5c7ed6 100%)',
  },
  ZSM: {
    label: 'ZSM',
    color: '#9c27b0',
    bg: alpha('#9c27b0', 0.1),
    lightBg: alpha('#9c27b0', 0.05),
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
  },
  ASM: {
    label: 'ASM',
    color: '#00bcd4',
    bg: alpha('#00bcd4', 0.1),
    lightBg: alpha('#00bcd4', 0.05),
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    gradient: 'linear-gradient(135deg, #0097a7 0%, #00bcd4 100%)',
  },
  TEAM: {
    label: 'Team Member',
    color: SUCCESS,
    bg: alpha(SUCCESS, 0.1),
    lightBg: alpha(SUCCESS, 0.05),
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
  },
};

// Transport Mode for KM Calculation (if needed)
const TRANSPORT_MODES = {
  WALKING: 'walking',
  DRIVING: 'driving',
  BICYCLING: 'bicycling',
  PUBLIC_TRANSPORT: 'public_transport',
};

const TRANSPORT_MODE_CONFIG = {
  [TRANSPORT_MODES.WALKING]: {
    label: 'Walking',
    icon: <DirectionsWalk sx={{ fontSize: 18 }} />,
    color: SUCCESS,
  },
  [TRANSPORT_MODES.BICYCLING]: {
    label: 'Bicycling',
    icon: <TwoWheeler sx={{ fontSize: 18 }} />,
    color: WARNING,
  },
  [TRANSPORT_MODES.DRIVING]: {
    label: 'Driving',
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    color: INFO,
  },
  [TRANSPORT_MODES.PUBLIC_TRANSPORT]: {
    label: 'Public Transport',
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    color: '#9c27b0',
  },
};

// ========== HELPER FUNCTIONS ==========
const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  if (!dateString) return 'Not set';
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch {
    return 'Invalid Date';
  }
};

const formatTime = (timeString, formatStr = 'hh:mm a') => {
  if (!timeString) return '--:--';
  try {
    const date = parseISO(timeString);
    return format(date, formatStr);
  } catch {
    return '--:--';
  }
};

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const calculateWorkingHours = (punchInTime, punchOutTime) => {
  if (!punchInTime || !punchOutTime) return 0;
  try {
    const inTime = parseISO(punchInTime);
    const outTime = parseISO(punchOutTime);
    return differenceInMinutes(outTime, inTime);
  } catch {
    return 0;
  }
};

const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || {
    label: 'Unknown',
    color: '#757575',
    bg: alpha('#757575', 0.1),
    lightBg: alpha('#757575', 0.05),
    icon: <InfoIcon sx={{ fontSize: 18 }} />,
    gradient: 'linear-gradient(135deg, #616161 0%, #9e9e9e 100%)',
  };
};

const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || {
    label: role || 'Unknown',
    color: '#757575',
    bg: alpha('#757575', 0.1),
    lightBg: alpha('#757575', 0.05),
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    gradient: 'linear-gradient(135deg, #616161 0%, #9e9e9e 100%)',
  };
};

const getTransportModeConfig = (mode) => {
  return TRANSPORT_MODE_CONFIG[mode] || {
    label: 'Other',
    icon: <DirectionsCar sx={{ fontSize: 18 }} />,
    color: '#757575',
  };
};

// ========== ENHANCED PUNCH IN/OUT CARD ==========
const PunchInOutCard = ({
  onPunchIn,
  onPunchOut,
  loading,
  currentStatus,
  isMobile
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const getPunchStatus = () => {
    if (!currentStatus) return 'not-punched';
    if (currentStatus.punchInTime && !currentStatus.punchOutTime) return 'punched-in';
    if (currentStatus.punchOutTime) return 'punched-out';
    return 'not-punched';
  };

  const status = getPunchStatus();
  const currentTime = format(new Date(), 'hh:mm a');
  const workingHours = currentStatus?.punchInTime && currentStatus?.punchOutTime
    ? calculateWorkingHours(currentStatus.punchInTime, currentStatus.punchOutTime)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: `linear-gradient(145deg, #ffffff 0%, ${alpha(PRIMARY, 0.02)} 100%)`,
          border: `1px solid ${alpha(PRIMARY, 0.1)}`,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: status === 'punched-in'
              ? `linear-gradient(90deg, ${SUCCESS} 0%, ${PRIMARY} 50%, ${INFO} 100%)`
              : status === 'punched-out'
              ? `linear-gradient(90deg, ${INFO} 0%, ${SUCCESS} 50%, ${WARNING} 100%)`
              : `linear-gradient(90deg, ${alpha(PRIMARY, 0.3)} 0%, ${alpha(PRIMARY, 0.1)} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    borderRadius: 3,
                    background: status === 'punched-in'
                      ? `linear-gradient(135deg, ${alpha(SUCCESS, 0.2)} 0%, ${alpha(PRIMARY, 0.1)} 100%)`
                      : status === 'punched-out'
                      ? `linear-gradient(135deg, ${alpha(INFO, 0.2)} 0%, ${alpha(PRIMARY, 0.1)} 100%)`
                      : `linear-gradient(135deg, ${alpha(PRIMARY, 0.15)} 0%, ${alpha(PRIMARY, 0.05)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: status === 'punched-in' ? SUCCESS : status === 'punched-out' ? INFO : PRIMARY,
                  }}
                >
                  {status === 'punched-in' ? (
                    <FingerprintIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                  ) : status === 'punched-out' ? (
                    <CheckCircleIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                  ) : (
                    <AccessTimeIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {status === 'punched-in' 
                      ? '📍 Currently Working' 
                      : status === 'punched-out'
                      ? '✅ Day Completed'
                      : '⏰ Ready to Start'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status === 'punched-in'
                      ? `Punched in at ${currentStatus?.punchInTime ? formatTime(currentStatus.punchInTime) : currentTime}`
                      : status === 'punched-out'
                      ? `Punched out at ${currentStatus?.punchOutTime ? formatTime(currentStatus.punchOutTime) : currentTime}`
                      : 'Start your day by punching in'}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                <Tooltip title={showDetails ? 'Hide Details' : 'Show Details'} arrow>
                  <IconButton
                    onClick={() => setShowDetails(!showDetails)}
                    sx={{
                      bgcolor: alpha(PRIMARY, 0.1),
                      '&:hover': { bgcolor: alpha(PRIMARY, 0.2) },
                      width: 44,
                      height: 44,
                    }}
                  >
                    {showDetails ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>

                {status === 'punched-in' ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={onPunchOut}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CloseIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.2,
                      background: `linear-gradient(45deg, #d32f2f 30%, #f44336 90%)`,
                      boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                    }}
                  >
                    Punch Out
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={onPunchIn}
                    disabled={loading || status === 'punched-out'}
                    startIcon={loading ? <CircularProgress size={20} /> : <FingerprintIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.2,
                      background: `linear-gradient(45deg, ${PRIMARY} 30%, ${SECONDARY} 90%)`,
                      boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${SECONDARY} 30%, ${PRIMARY} 90%)`,
                      },
                    }}
                  >
                    {status === 'punched-out' ? 'Already Punched Out' : 'Punch In'}
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Details Section */}
            <AnimatePresence>
              {showDetails && currentStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: alpha(PRIMARY, 0.03),
                      borderRadius: 3,
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr 1fr',
                        sm: 'repeat(4, 1fr)',
                      },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Punch In
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentStatus.punchInTime ? formatTime(currentStatus.punchInTime) : '--:--'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Punch Out
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentStatus.punchOutTime ? formatTime(currentStatus.punchOutTime) : '--:--'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Working Hours
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={PRIMARY}>
                        {formatDuration(workingHours)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        size="small"
                        label={currentStatus.status?.toUpperCase()}
                        sx={{
                          bgcolor: getStatusConfig(currentStatus.status).bg,
                          color: getStatusConfig(currentStatus.status).color,
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ========== ENHANCED ATTENDANCE STATS ==========
const AttendanceStats = ({ refreshTrigger }) => {
  const theme = useTheme();
  const { fetchAPI } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAPI('/attendance/stats');
      
      if (result?.success) {
        setStats(result.result || result.data);
      } else {
        throw new Error(result?.message || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  const statCards = useMemo(() => [
    {
      title: 'Present Today',
      value: stats?.totalPresent || 0,
      icon: <CheckCircleIcon />,
      color: SUCCESS,
      subText: 'On-time attendance',
      trend: stats?.presentTrend || '+5%',
      trendUp: true,
    },
    {
      title: 'Absent Today',
      value: stats?.totalAbsent || 0,
      icon: <CancelIcon />,
      color: ERROR,
      subText: 'Absences reported',
      trend: stats?.absentTrend || '-2%',
      trendUp: false,
    },
    {
      title: 'Late Arrivals',
      value: stats?.totalLate || 0,
      icon: <TimerIcon />,
      color: WARNING,
      subText: 'Late punches',
      trend: stats?.lateTrend || '+3%',
      trendUp: true,
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 0}%`,
      icon: <PercentIcon />,
      color: INFO,
      subText: 'Overall compliance',
      trend: stats?.rateTrend || '+2%',
      trendUp: true,
    },
  ], [stats]);

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Skeleton 
              variant="rectangular" 
              height={160} 
              sx={{ borderRadius: 3 }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          border: `1px solid ${alpha(ERROR, 0.2)}`,
        }}
      >
        <AlertTitle>Error Loading Statistics</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
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
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.02)} 100%)`,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.5)} 100%)`,
                }}
              />
              
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha(stat.color, 0.2)} 0%, ${alpha(stat.color, 0.1)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {stat.trendUp ? (
                        <TrendingUp sx={{ fontSize: 16, color: SUCCESS }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: ERROR }} />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.trendUp ? SUCCESS : ERROR,
                          fontWeight: 600,
                        }}
                      >
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {stat.subText}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

// ========== ATTENDANCE DETAILS MODAL ==========
const AttendanceDetailsModal = ({ open, onClose, record, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  const isAdmin = ['Head_office', 'ZSM'].includes(userRole);
  const isASM = userRole === 'ASM';
  const canEdit = isAdmin || isASM;
  const canDelete = isAdmin;

  if (!record) return null;

  const statusConfig = getStatusConfig(record.status);
  const roleConfig = getRoleConfig(record.user?.role);
  const workingHours = calculateWorkingHours(record.punchInTime, record.punchOutTime);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxHeight: '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: PRIMARY,
          color: 'white',
          py: 2,
          px: 3,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: PRIMARY,
                width: 48,
                height: 48,
                fontWeight: 700,
              }}
            >
              {record.user?.firstName?.[0] || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {record.user?.firstName} {record.user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Attendance Details • {formatDate(record.date)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            {canEdit && (
              <Tooltip title="Edit Record" arrow>
                <IconButton
                  onClick={() => {
                    onEdit(record);
                    onClose();
                  }}
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete Record" arrow>
                <IconButton
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this attendance record?')) {
                      onDelete(record._id);
                      onClose();
                    }
                  }}
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, maxHeight: '70vh', overflow: 'auto' }}>
          <Stack spacing={3}>
            {/* Employee Info Card */}
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
                  overflow: 'hidden',
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
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: PRIMARY }}
                  >
                    <PersonIcon /> Employee Information
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {record.user?.firstName} {record.user?.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {record.user?.email || 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Role
                      </Typography>
                      <Chip
                        label={roleConfig.label}
                        icon={roleConfig.icon}
                        size="small"
                        sx={{
                          bgcolor: roleConfig.bg,
                          color: roleConfig.color,
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(record.date, 'dd MMM yyyy')}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Attendance Details Card */}
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
                  overflow: 'hidden',
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
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: SUCCESS }}
                  >
                    <AccessTimeIcon /> Attendance Details
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(PRIMARY, 0.02),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Punch In
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY }}>
                          {formatTime(record.punchInTime)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(INFO, 0.02),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Punch Out
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: INFO }}>
                          {formatTime(record.punchOutTime)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(WARNING, 0.02),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Working Hours
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: WARNING }}>
                          {formatDuration(workingHours)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(statusConfig.color, 0.02),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={statusConfig.label}
                          icon={statusConfig.icon}
                          size="small"
                          sx={{
                            bgcolor: statusConfig.bg,
                            color: statusConfig.color,
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>

                  {record.notes && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Notes
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: alpha(PRIMARY, 0.02),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                          {record.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline Card (if there's location data) */}
            {record.locationUpdates && record.locationUpdates.length > 0 && (
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
                    overflow: 'hidden',
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
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: PRIMARY }}
                    >
                      <TimelineIcon /> Location Timeline
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Timeline>
                      {record.locationUpdates.map((location, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent
                            variant="caption"
                            color="text.secondary"
                            sx={{ flex: 0.2 }}
                          >
                            {formatTime(location.timestamp)}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot
                              sx={{
                                bgcolor: index === record.locationUpdates.length - 1 ? SUCCESS : PRIMARY,
                                boxShadow: `0 0 0 4px ${alpha(index === record.locationUpdates.length - 1 ? SUCCESS : PRIMARY, 0.2)}`,
                              }}
                            />
                            {index < record.locationUpdates.length - 1 && (
                              <TimelineConnector sx={{ bgcolor: alpha(PRIMARY, 0.2) }} />
                            )}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="body2" fontWeight={600}>
                              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ±{Math.round(location.accuracy)}m • {location.speed ? `${(location.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Chip
            label={roleConfig.label}
            icon={roleConfig.icon}
            size="small"
            sx={{
              bgcolor: roleConfig.bg,
              color: roleConfig.color,
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
              '&:hover': { bgcolor: SECONDARY },
            }}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// ========== CREATE/EDIT ATTENDANCE DIALOG ==========
const AttendanceFormDialog = ({ open, onClose, onSubmit, loading, initialData, mode, users }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    userId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchInTime: '',
    punchOutTime: '',
    status: 'present',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        userId: initialData.user?._id || '',
        date: initialData.date ? format(parseISO(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        punchInTime: initialData.punchInTime ? format(parseISO(initialData.punchInTime), 'HH:mm') : '',
        punchOutTime: initialData.punchOutTime ? format(parseISO(initialData.punchOutTime), 'HH:mm') : '',
        status: initialData.status || 'present',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        userId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        punchInTime: '',
        punchOutTime: '',
        status: 'present',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, mode, open]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId) newErrors.userId = 'Employee is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.punchInTime) newErrors.punchInTime = 'Punch in time is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      userId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      punchInTime: '',
      punchOutTime: '',
      status: 'present',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
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
          borderColor: 'divider',
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PRIMARY,
              }}
            >
              {mode === 'edit' ? <EditIcon sx={{ fontSize: 28 }} /> : <AddIcon sx={{ fontSize: 28 }} />}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {mode === 'edit' ? 'Edit Attendance Record' : 'Create Attendance Record'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mode === 'edit' ? 'Update attendance information' : 'Add a new attendance record'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          <FormControl fullWidth error={!!errors.userId}>
            <InputLabel>Employee *</InputLabel>
            <Select
              value={formData.userId}
              label="Employee *"
              onChange={handleInputChange('userId')}
              sx={{ borderRadius: 2 }}
            >
              {users.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                return (
                  <MenuItem key={user._id} value={user._id}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: roleConfig.bg,
                          color: roleConfig.color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {roleConfig.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                );
              })}
            </Select>
            {errors.userId && <FormHelperText>{errors.userId}</FormHelperText>}
          </FormControl>

          <DatePicker
            label="Date *"
            value={formData.date ? parseISO(`${formData.date}T00:00:00`) : null}
            onChange={(date) => setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date,
                sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } },
              },
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Punch In Time *"
                type="time"
                value={formData.punchInTime}
                onChange={handleInputChange('punchInTime')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                error={!!errors.punchInTime}
                helperText={errors.punchInTime}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Punch Out Time"
                type="time"
                value={formData.punchOutTime}
                onChange={handleInputChange('punchOutTime')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status *</InputLabel>
            <Select
              value={formData.status}
              label="Status *"
              onChange={handleInputChange('status')}
              sx={{ borderRadius: 2 }}
            >
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: config.bg,
                        color: config.color,
                      }}
                    >
                      {config.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2">{config.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {key === 'present' && 'On-time attendance'}
                        {key === 'absent' && 'No show'}
                        {key === 'late' && 'Arrived after scheduled time'}
                        {key === 'half-day' && 'Partial day attendance'}
                        {key === 'on-leave' && 'Approved leave'}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleInputChange('notes')}
            fullWidth
            placeholder="Add any additional notes..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
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
            '&:hover': { bgcolor: '#2e7d32' },
          }}
        >
          {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ========== EXPORT REPORT DIALOG ==========
const ExportReportDialog = ({ open, onClose, onExport, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reportType, setReportType] = useState('daily');
  const [formatType, setFormatType] = useState('excel');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [employeeType, setEmployeeType] = useState('all');

  const handleExport = () => {
    const params = new URLSearchParams();
    params.append('format', formatType);
    
    if (reportType === 'custom') {
      params.append('startDate', format(dateRange.start, 'yyyy-MM-dd'));
      params.append('endDate', format(dateRange.end, 'yyyy-MM-dd'));
    } else {
      const today = new Date();
      if (reportType === 'daily') {
        params.append('startDate', format(today, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      } else if (reportType === 'weekly') {
        const weekStart = startOfWeek(today);
        params.append('startDate', format(weekStart, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      } else if (reportType === 'monthly') {
        const monthStart = startOfMonth(today);
        params.append('startDate', format(monthStart, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      }
    }

    if (employeeType !== 'all') {
      params.append('employeeType', employeeType);
    }

    onExport({ formatType, queryString: params.toString() });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          borderColor: 'divider',
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PRIMARY,
              }}
            >
              <DownloadIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Export Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download attendance data in your preferred format
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Report Type
            </Typography>
            <RadioGroup
              row
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {['daily', 'weekly', 'monthly', 'custom'].map((type) => {
                const config = {
                  daily: { label: 'Daily', icon: <TodayIcon />, color: PRIMARY },
                  weekly: { label: 'Weekly', icon: <CalendarToday />, color: SUCCESS },
                  monthly: { label: 'Monthly', icon: <CalendarToday />, color: INFO },
                  custom: { label: 'Custom Range', icon: <TuneIcon />, color: WARNING },
                };
                return (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        sx={{
                          color: config[type]?.color,
                          '&.Mui-checked': { color: config[type]?.color },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {config[type]?.icon}
                        <Typography variant="body2">{config[type]?.label}</Typography>
                      </Stack>
                    }
                    sx={{
                      mr: 0,
                      p: 1,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: reportType === type ? config[type]?.color : 'divider',
                      bgcolor: reportType === type ? alpha(config[type]?.color, 0.05) : 'transparent',
                    }}
                  />
                );
              })}
            </RadioGroup>
          </Box>

          {reportType === 'custom' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(date) => setDateRange({ ...dateRange, start: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(date) => setDateRange({ ...dateRange, end: date })}
                  minDate={dateRange.start}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } },
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Employee Type
            </Typography>
            <RadioGroup
              row
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {['all', 'TEAM', 'ASM', 'ZSM', 'Head_office'].map((type) => {
                const config = type === 'all' 
                  ? { label: 'All Employees', icon: <PeopleIcon />, color: PRIMARY }
                  : getRoleConfig(type);
                return (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        sx={{
                          color: config.color,
                          '&.Mui-checked': { color: config.color },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {config.icon}
                        <Typography variant="body2">
                          {type === 'all' ? 'All Employees' : type.replace('_', ' ')}
                        </Typography>
                      </Stack>
                    }
                    sx={{
                      mr: 0,
                      p: 1,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: employeeType === type ? config.color : 'divider',
                      bgcolor: employeeType === type ? alpha(config.color, 0.05) : 'transparent',
                    }}
                  />
                );
              })}
            </RadioGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Format
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant={formatType === 'excel' ? 'contained' : 'outlined'}
                onClick={() => setFormatType('excel')}
                startIcon={<InsertDriveFile />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: formatType === 'excel' ? SUCCESS : 'transparent',
                  borderColor: SUCCESS,
                  color: formatType === 'excel' ? 'white' : SUCCESS,
                  '&:hover': { 
                    bgcolor: formatType === 'excel' ? '#2e7d32' : alpha(SUCCESS, 0.1),
                    borderColor: SUCCESS,
                  },
                }}
              >
                Excel (.xlsx)
              </Button>
              <Button
                variant={formatType === 'pdf' ? 'contained' : 'outlined'}
                onClick={() => setFormatType('pdf')}
                startIcon={<PictureAsPdf />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: formatType === 'pdf' ? ERROR : 'transparent',
                  borderColor: ERROR,
                  color: formatType === 'pdf' ? 'white' : ERROR,
                  '&:hover': { 
                    bgcolor: formatType === 'pdf' ? '#c62828' : alpha(ERROR, 0.1),
                    borderColor: ERROR,
                  },
                }}
              >
                PDF (.pdf)
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          fullWidth={isMobile}
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          sx={{
            borderRadius: 2,
            bgcolor: PRIMARY,
            '&:hover': { bgcolor: SECONDARY },
          }}
        >
          {loading ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ========== LOADING SKELETON ==========
const LoadingSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} lg={3} key={item}>
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 3, mb: 3 }} />
    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 2 }} />
  </Box>
);

// ========== MAIN ATTENDANCE PAGE ==========
export default function AttendancePage() {
  const theme = useTheme();
  const { fetchAPI, safeFetchAPI, getUserRole, user } = useAuth();
  const userRole = getUserRole();
  
  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // States
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({
    userId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchInTime: '',
    punchOutTime: '',
    status: 'present',
    notes: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Filter states
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Other states
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPunchStatus, setCurrentPunchStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionRecord, setSelectedActionRecord] = useState(null);
  
  // Role checks
  const isAdmin = ['Head_office', 'ZSM'].includes(userRole);
  const isASM = userRole === 'ASM';
  const isTeam = userRole === 'TEAM';
  const canEdit = isAdmin || isASM;
  const canDelete = isAdmin;

  // Debounce search
  const searchTimeout = useRef(null);

  // ========== API CALLS ==========

  // Fetch users for manual attendance
  const fetchUsers = useCallback(async () => {
    try {
      const result = await safeFetchAPI('/users');
      if (result?.success) {
        setUsers(result.result || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [safeFetchAPI]);

  // Check today's attendance status
  const checkTodayAttendance = useCallback(async () => {
    if (!isTeam) return;
    try {
      const result = await fetchAPI('/attendance/today');
      if (result?.success && result.result) {
        setCurrentPunchStatus(result.result);
      }
    } catch (err) {
      console.error('Error checking today attendance:', err);
    }
  }, [fetchAPI, isTeam]);

  // Fetch attendance data with filters
  const fetchAttendanceData = useCallback(async (pageNum = pagination.page) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: pagination.limit.toString()
      });

      // Status filter
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      // Date filter
      if (dateFilter.startDate) {
        params.append('startDate', format(dateFilter.startDate, 'yyyy-MM-dd'));
      }
      if (dateFilter.endDate) {
        params.append('endDate', format(dateFilter.endDate, 'yyyy-MM-dd'));
      }

      // Search query
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      // Tab filters
      const today = new Date();
      if (selectedTab === 1) { // Today
        params.append('startDate', format(today, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      } else if (selectedTab === 2) { // This Week
        const weekStart = startOfWeek(today);
        params.append('startDate', format(weekStart, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      } else if (selectedTab === 3) { // This Month
        const monthStart = startOfMonth(today);
        params.append('startDate', format(monthStart, 'yyyy-MM-dd'));
        params.append('endDate', format(today, 'yyyy-MM-dd'));
      }

      const result = await fetchAPI(`/attendance?${params.toString()}`);

      if (result?.success) {
        setAttendanceData(result.result?.records || []);
        setPagination(result.result?.pagination || {
          page: pageNum,
          limit: pagination.limit,
          total: 0,
          pages: 0
        });
      } else {
        throw new Error(result?.message || 'Failed to fetch attendance');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAPI, filterStatus, dateFilter, searchQuery, selectedTab, pagination.limit]);

  // Initial data load
  useEffect(() => {
    if (hasAccess(userRole)) {
      fetchAttendanceData(1);
    }
  }, [fetchAttendanceData, refreshTrigger, userRole]);

  // Fetch users for admin
  useEffect(() => {
    if (isAdmin || isASM) {
      fetchUsers();
    }
  }, [isAdmin, isASM, fetchUsers]);

  // Check today's attendance for team members
  useEffect(() => {
    if (isTeam) {
      checkTodayAttendance();
    }
  }, [isTeam, checkTodayAttendance, refreshTrigger]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchAttendanceData(1);
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery, fetchAttendanceData]);

  // ========== HANDLERS ==========

  // Handle punch in/out
  const handlePunchAction = async (action) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = action === 'in' ? '/attendance/punch-in' : '/attendance/punch-out';
      const result = await fetchAPI(endpoint, { method: 'POST' });

      if (result?.success) {
        setSuccess(`${action === 'in' ? 'Punched in' : 'Punched out'} successfully!`);
        setRefreshTrigger(prev => prev + 1);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result?.message || `Failed to punch ${action}`);
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Open details dialog
  const handleViewDetails = useCallback(async (record) => {
    try {
      // Fetch latest record data
      const response = await fetchAPI(`/attendance/${record._id}`);
      if (response?.success && response.result) {
        setCurrentAttendance(response.result);
        setDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching attendance details:', error);
      setError('Failed to fetch attendance details');
      setTimeout(() => setError(null), 3000);
    }
  }, [fetchAPI]);

  // Open form dialog for create/edit
  const handleOpenForm = (mode, record = null) => {
    setFormMode(mode);
    setCurrentAttendance(record);
    setFormDialogOpen(true);
  };

  // Handle form submit (create/edit)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      let response;
      if (formMode === 'edit') {
        // Format data for update API
        const updateData = {
          status: formData.status,
          notes: formData.notes
        };

        // Add manual punch times if changed
        if (formData.punchInTime && formData.date) {
          const punchInDate = new Date(formData.date);
          const [hours, minutes] = formData.punchInTime.split(':');
          punchInDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          updateData.manualPunchIn = punchInDate.toISOString();
        }

        if (formData.punchOutTime && formData.date) {
          const punchOutDate = new Date(formData.date);
          const [hours, minutes] = formData.punchOutTime.split(':');
          punchOutDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          updateData.manualPunchOut = punchOutDate.toISOString();
        }

        response = await fetchAPI(`/attendance/${currentAttendance._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        // Create new attendance
        response = await fetchAPI('/attendance/manual', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }

      if (response?.success) {
        setSuccess(`Attendance ${formMode === 'edit' ? 'updated' : 'created'} successfully!`);
        setFormDialogOpen(false);
        setRefreshTrigger(prev => prev + 1);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || `Failed to ${formMode} attendance`);
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAPI(`/attendance/${id}`, {
        method: 'DELETE'
      });

      if (response?.success) {
        setSuccess('Attendance record deleted successfully');
        setRefreshTrigger(prev => prev + 1);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || 'Failed to delete attendance');
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  // Handle export report
  const handleExportReport = async ({ formatType, queryString }) => {
    try {
      setExportLoading(true);
      
      const result = await fetchAPI(`/attendance/export?${queryString}`);
      
      if (result?.success && result.result?.downloadUrl) {
        // Open download URL in new tab
        window.open(result.result.downloadUrl, '_blank');
        setSuccess('Report exported successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result?.message || 'Failed to export report');
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setExportLoading(false);
      setReportDialogOpen(false);
    }
  };

  // Handle action menu
  const handleActionMenuOpen = (event, record) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionRecord(record);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedActionRecord(null);
  };

  const handleActionSelect = (action) => {
    if (!selectedActionRecord) return;

    switch (action) {
      case 'view':
        handleViewDetails(selectedActionRecord);
        break;
      case 'edit':
        if (canEdit) {
          handleOpenForm('edit', selectedActionRecord);
        }
        break;
      case 'delete':
        if (canDelete) {
          handleDelete(selectedActionRecord._id);
        }
        break;
      default:
        break;
    }

    handleActionMenuClose();
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
    fetchAttendanceData(newPage + 1);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    setTimeout(() => fetchAttendanceData(1), 0);
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setDateFilter({ startDate: null, endDate: null });
    setSelectedTab(0);
    setSortConfig({ key: 'date', direction: 'desc' });
    setShowFilterPanel(false);
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => setRefreshTrigger(prev => prev + 1), 0);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Access check
  const hasAccess = (userRole) => {
    return ['Head_office', 'ZSM', 'ASM', 'TEAM'].includes(userRole);
  };

  // Tabs configuration
  const tabs = [
    { label: 'All Records', icon: <Description /> },
    { label: 'Today', icon: <TodayIcon /> },
    { label: 'This Week', icon: <CalendarToday /> },
    { label: 'This Month', icon: <CalendarToday /> }
  ];

  // Access Check
  if (!hasAccess(userRole)) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            p: 4,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(ERROR, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ERROR,
              mx: 'auto',
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access the attendance page.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{
              mt: 2,
              bgcolor: PRIMARY,
              '&:hover': { bgcolor: SECONDARY },
            }}
          >
            Go to Dashboard
          </Button>
        </Card>
      </Box>
    );
  }

  if (loading && attendanceData.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        {/* Header Section */}
        <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ mb: 4 }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                gutterBottom
                sx={{
                  background: 'black',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Attendance Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage employee attendance records
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={loading}
                sx={{ borderRadius: 3, px: 3, py: 1.2 }}
              >
                Refresh
              </Button>

              {(isAdmin || isASM) && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm('create')}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.2,
                      background: PRIMARY,
                      boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.3)}`,
                    }}
                  >
                    Add Record
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => setReportDialogOpen(true)}
                    disabled={exportLoading}
                    sx={{ borderRadius: 3, px: 3, py: 1.2 }}
                  >
                    Export
                  </Button>
                </>
              )}
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

          {/* Stats Section */}
          <AttendanceStats refreshTrigger={refreshTrigger} />

          {/* Punch In/Out Section for Team members */}
          {isTeam && (
            <PunchInOutCard
              onPunchIn={() => handlePunchAction('in')}
              onPunchOut={() => handlePunchAction('out')}
              loading={loading}
              currentStatus={currentPunchStatus}
              isMobile={isMobile}
            />
          )}

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <Slide direction="down" in={!!error}>
                <Alert
                  severity="error"
                  onClose={handleCloseSnackbar}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    border: `1px solid ${alpha(ERROR, 0.2)}`,
                  }}
                  icon={<WarningIcon />}
                >
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              </Slide>
            )}
            
            {success && (
              <Slide direction="down" in={!!success}>
                <Alert
                  severity="success"
                  onClose={handleCloseSnackbar}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    border: `1px solid ${alpha(SUCCESS, 0.2)}`,
                  }}
                  icon={<CheckCircleIcon />}
                >
                  <AlertTitle>Success</AlertTitle>
                  {success}
                </Alert>
              </Slide>
            )}
          </AnimatePresence>

          {/* Main Content Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(PRIMARY, 0.1)}`,
              overflow: 'hidden',
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => {
                  setSelectedTab(newValue);
                  setPagination(prev => ({ ...prev, page: 1 }));
                  setTimeout(() => setRefreshTrigger(prev => prev + 1), 0);
                }}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons={isMobile ? 'auto' : false}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                  },
                  '& .Mui-selected': {
                    color: `${PRIMARY} !important`,
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: PRIMARY,
                    height: 3,
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab key={index} icon={tab.icon} label={tab.label} />
                ))}
              </Tabs>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', md: 'center' }}
                >
                  <Box sx={{ width: { xs: '100%', md: 350 } }}>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          bgcolor: alpha(PRIMARY, 0.02),
                          '&:hover': {
                            bgcolor: alpha(PRIMARY, 0.04),
                          },
                        },
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControl size="medium" sx={{ minWidth: 150 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filterStatus}
                        label="Status"
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setPagination(prev => ({ ...prev, page: 1 }));
                          setTimeout(() => setRefreshTrigger(prev => prev + 1), 0);
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <MenuItem key={key} value={key}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: config.color }}>{config.icon}</Box>
                              <Typography>{config.label}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      startIcon={<TuneIcon />}
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 },
                      }}
                    >
                      {showFilterPanel ? 'Hide Filters' : 'More Filters'}
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={handleClearFilters}
                      sx={{ borderRadius: 2, px: 3, borderWidth: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Stack>

                {/* Advanced Filter Panel */}
                <AnimatePresence>
                  {showFilterPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
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
                              label="Start Date"
                              value={dateFilter.startDate}
                              onChange={(date) => {
                                setDateFilter(prev => ({ ...prev, startDate: date }));
                                setPagination(prev => ({ ...prev, page: 1 }));
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'medium',
                                  sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              label="End Date"
                              value={dateFilter.endDate}
                              onChange={(date) => {
                                setDateFilter(prev => ({ ...prev, endDate: date }));
                                setPagination(prev => ({ ...prev, page: 1 }));
                              }}
                              minDate={dateFilter.startDate}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'medium',
                                  sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } },
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Filters Chips */}
                {(searchQuery || filterStatus !== 'all' || dateFilter.startDate || dateFilter.endDate) && (
                  <Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {searchQuery && (
                        <Chip
                          label={`Search: ${searchQuery}`}
                          size="small"
                          onDelete={() => setSearchQuery('')}
                          sx={{ borderRadius: 1.5 }}
                        />
                      )}
                      {filterStatus !== 'all' && (
                        <Chip
                          label={`Status: ${STATUS_CONFIG[filterStatus]?.label || filterStatus}`}
                          size="small"
                          onDelete={() => {
                            setFilterStatus('all');
                            setPagination(prev => ({ ...prev, page: 1 }));
                            setRefreshTrigger(prev => prev + 1);
                          }}
                          sx={{
                            borderRadius: 1.5,
                            bgcolor: alpha(STATUS_CONFIG[filterStatus]?.color || PRIMARY, 0.1),
                            color: STATUS_CONFIG[filterStatus]?.color || PRIMARY,
                          }}
                        />
                      )}
                      {dateFilter.startDate && (
                        <Chip
                          label={`From: ${format(dateFilter.startDate, 'dd MMM yyyy')}`}
                          size="small"
                          onDelete={() => {
                            setDateFilter(prev => ({ ...prev, startDate: null }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                            setRefreshTrigger(prev => prev + 1);
                          }}
                          sx={{ borderRadius: 1.5 }}
                        />
                      )}
                      {dateFilter.endDate && (
                        <Chip
                          label={`To: ${format(dateFilter.endDate, 'dd MMM yyyy')}`}
                          size="small"
                          onDelete={() => {
                            setDateFilter(prev => ({ ...prev, endDate: null }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                            setRefreshTrigger(prev => prev + 1);
                          }}
                          sx={{ borderRadius: 1.5 }}
                        />
                      )}
                      <Chip
                        label="Clear All"
                        size="small"
                        variant="outlined"
                        onClick={handleClearFilters}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Table */}
            <TableContainer sx={{ maxHeight: { xs: 'calc(100vh - 350px)', md: 'calc(100vh - 300px)' } }}>
              {loading && (
                <MuiLinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
              )}
              
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(PRIMARY, 0.04) }}>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleSort('user')}
                        endIcon={
                          sortConfig.key === 'user' && (
                            sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                          )
                        }
                        sx={{ fontWeight: 700, textTransform: 'none', color: 'text.primary' }}
                      >
                        Employee
                      </Button>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleSort('date')}
                        endIcon={
                          sortConfig.key === 'date' && (
                            sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                          )
                        }
                        sx={{ fontWeight: 700, textTransform: 'none', color: 'text.primary' }}
                      >
                        Date
                      </Button>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Punch In</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Punch Out</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Hours</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Status</TableCell>
                    {!isTeam && <TableCell align="center" sx={{ fontWeight: 700, py: 2 }}>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((row) => {
                      const statusConfig = getStatusConfig(row.status);
                      const roleConfig = getRoleConfig(row.user?.role);
                      const isTodayRecord = row.date && isToday(parseISO(row.date));
                      const workingHours = calculateWorkingHours(row.punchInTime, row.punchOutTime);

                      return (
                        <TableRow
                          key={row._id}
                          hover
                          sx={{
                            '&:hover': { bgcolor: alpha(PRIMARY, 0.02) },
                            bgcolor: isTodayRecord ? alpha(PRIMARY, 0.04) : 'inherit',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onClick={() => handleViewDetails(row)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: roleConfig.bg,
                                  color: roleConfig.color,
                                  fontWeight: 600,
                                  width: 44,
                                  height: 44,
                                }}
                              >
                                {row.user?.firstName?.[0] || 'A'}
                                {row.user?.lastName?.[0] || ''}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {row.user?.firstName} {row.user?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {roleConfig.label}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" fontWeight={500}>
                                {formatDate(row.date, 'dd MMM yyyy')}
                              </Typography>
                              {isTodayRecord && (
                                <Chip
                                  size="small"
                                  label="Today"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.625rem',
                                    bgcolor: alpha(PRIMARY, 0.1),
                                    color: PRIMARY,
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatTime(row.punchInTime)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatTime(row.punchOutTime)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color={PRIMARY}>
                              {formatDuration(workingHours)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              icon={statusConfig.icon}
                              size="small"
                              sx={{
                                bgcolor: statusConfig.bg,
                                color: statusConfig.color,
                                fontWeight: 600,
                                minWidth: 90,
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>
                          
                          {!isTeam && (
                            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="View Details" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(row)}
                                    sx={{
                                      bgcolor: alpha(PRIMARY, 0.1),
                                      color: PRIMARY,
                                      '&:hover': { bgcolor: alpha(PRIMARY, 0.2) },
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                {canEdit && (
                                  <Tooltip title="Edit" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenForm('edit', row)}
                                      sx={{
                                        bgcolor: alpha(INFO, 0.1),
                                        color: INFO,
                                        '&:hover': { bgcolor: alpha(INFO, 0.2) },
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {canDelete && (
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDelete(row._id)}
                                      sx={{
                                        bgcolor: alpha(ERROR, 0.1),
                                        color: ERROR,
                                        '&:hover': { bgcolor: alpha(ERROR, 0.2) },
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isTeam ? 6 : 7} align="center" sx={{ py: 6 }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(PRIMARY, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: PRIMARY,
                                mx: 'auto',
                                mb: 2,
                              }}
                            >
                              <SearchIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              No Records Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchQuery || filterStatus !== 'all' || dateFilter.startDate || dateFilter.endDate
                                ? 'Try adjusting your filters'
                                : 'No attendance data available'}
                            </Typography>
                            {(isAdmin || isASM) && (
                              <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenForm('create')}
                                sx={{ mt: 3, borderRadius: 3 }}
                              >
                                Add First Record
                              </Button>
                            )}
                          </Box>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.total > 0 && (
              <Box
                sx={{
                  p: 2.5,
                  borderTop: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  bgcolor: alpha(PRIMARY, 0.02),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing <strong>{((pagination.page - 1) * pagination.limit) + 1}</strong> to{' '}
                    <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{' '}
                    <strong>{pagination.total}</strong> entries
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={pagination.limit}
                      onChange={handleRowsPerPageChange}
                      sx={{ borderRadius: 2 }}
                    >
                      {[5, 10, 25, 50].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option} per page
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* ========== DIALOGS ========== */}

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        record={currentAttendance}
        onEdit={(record) => {
          setDetailsDialogOpen(false);
          handleOpenForm('edit', record);
        }}
        onDelete={handleDelete}
      />

      {/* Create/Edit Form Dialog */}
      <AttendanceFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        loading={loading}
        initialData={currentAttendance}
        mode={formMode}
        users={users}
      />

      {/* Export Report Dialog */}
      <ExportReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onExport={handleExportReport}
        loading={exportLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {error || success}
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => handleActionSelect('view')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <Visibility fontSize="small" sx={{ color: PRIMARY }} />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        
        {canEdit && (
          <MenuItem onClick={() => handleActionSelect('edit')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: INFO }} />
            </ListItemIcon>
            <ListItemText primary="Edit Record" />
          </MenuItem>
        )}
        
        {canDelete && (
          <MenuItem onClick={() => handleActionSelect('delete')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: ERROR }} />
            </ListItemIcon>
            <ListItemText primary="Delete Record" />
          </MenuItem>
        )}
      </Menu>

      {/* Mobile FAB */}
      {(isAdmin || isASM) && isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
            boxShadow: theme.shadows[8],
          }}
          onClick={() => handleOpenForm('create')}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && attendanceData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Backdrop
              open={loading}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={60} sx={{ color: PRIMARY, mb: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ color: PRIMARY }}>
                Loading Attendance Data...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait
              </Typography>
            </Backdrop>
          </motion.div>
        )}
      </AnimatePresence>
    </LocalizationProvider>
  );
}