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
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
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
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isToday, differenceInMinutes, startOfWeek, startOfMonth, subDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ========== CONSTANTS & CONFIGURATION ==========
const STATUS_CONFIG = {
  present: {
    label: 'Present',
    bg: '#e8f5e9',
    color: '#2e7d32',
    lightBg: alpha('#2e7d32', 0.08),
    icon: <CheckCircleIcon sx={{ fontSize: 18 }} />
  },
  absent: {
    label: 'Absent',
    bg: '#ffebee',
    color: '#c62828',
    lightBg: alpha('#c62828', 0.08),
    icon: <CancelIcon sx={{ fontSize: 18 }} />
  },
  late: {
    label: 'Late',
    bg: '#fff3e0',
    color: '#ef6c00',
    lightBg: alpha('#ef6c00', 0.08),
    icon: <TimerIcon sx={{ fontSize: 18 }} />
  },
  'half-day': {
    label: 'Half Day',
    bg: '#e3f2fd',
    color: '#1565c0',
    lightBg: alpha('#1565c0', 0.08),
    icon: <ScheduleIcon sx={{ fontSize: 18 }} />
  },
  'on-leave': {
    label: 'On Leave',
    bg: '#f3e5f5',
    color: '#7b1fa2',
    lightBg: alpha('#7b1fa2', 0.08),
    icon: <EventIcon sx={{ fontSize: 18 }} />
  }
};

const ROLE_CONFIG = {
  Head_office: {
    label: 'Head Office',
    color: '#ff6d00',
    bg: alpha('#ff6d00', 0.08),
    icon: <PersonIcon sx={{ fontSize: 16 }} />
  },
  ZSM: {
    label: 'ZSM',
    color: '#9c27b0',
    bg: alpha('#9c27b0', 0.08),
    icon: <PersonIcon sx={{ fontSize: 16 }} />
  },
  ASM: {
    label: 'ASM',
    color: '#00bcd4',
    bg: alpha('#00bcd4', 0.08),
    icon: <PersonIcon sx={{ fontSize: 16 }} />
  },
  TEAM: {
    label: 'Team Member',
    color: '#4caf50',
    bg: alpha('#4caf50', 0.08),
    icon: <PersonIcon sx={{ fontSize: 16 }} />
  }
};

// ========== PUNCH IN/OUT CARD ==========
const PunchInOutCard = ({
  onPunchIn,
  onPunchOut,
  loading,
  currentStatus,
  isMobile
}) => {
  const theme = useTheme();

  const getPunchStatus = () => {
    if (!currentStatus) return 'not-punched';
    if (currentStatus.punchInTime && !currentStatus.punchOutTime) return 'punched-in';
    if (currentStatus.punchOutTime) return 'punched-out';
    return 'not-punched';
  };

  const status = getPunchStatus();
  const currentTime = format(new Date(), 'hh:mm a');

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        mb: 2,
        marginLeft:"25px"
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 }
                  }}
                >
                  {status === 'punched-in' ? (
                    <FingerprintIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  ) : (
                    <AccessTimeIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {status === 'punched-in' 
                      ? 'Currently Working' 
                      : status === 'punched-out'
                      ? 'Day Completed'
                      : 'Ready to Start'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status === 'punched-in'
                      ? `Punched in at ${currentStatus?.punchInTime ? format(parseISO(currentStatus.punchInTime), 'hh:mm a') : currentTime}`
                      : status === 'punched-out'
                      ? `Punched out at ${currentStatus?.punchOutTime ? format(parseISO(currentStatus.punchOutTime), 'hh:mm a') : currentTime}`
                      : 'Start your day by punching in'}
                  </Typography>
                </Box>
              </Box>

              {currentStatus && (
                <Box display="flex" gap={3} flexWrap="wrap">
                  <Box sx={{ marginRight:"30px"}}>
                    <Typography variant="caption" color="text.secondary">
                      Punch In
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {currentStatus.punchInTime 
                        ? format(parseISO(currentStatus.punchInTime), 'hh:mm a')
                        : '--:--'}
                    </Typography>
                  </Box>
                  <Box sx={{ marginRight:"30px"}}>
                    <Typography variant="caption" color="text.secondary">
                      Punch Out
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {currentStatus.punchOutTime
                        ? format(parseISO(currentStatus.punchOutTime), 'hh:mm a')
                        : '--:--'}
                    </Typography>
                  </Box>
                  <Box sx={{ marginRight:"30px"}}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      size="small"
                      label={currentStatus.status?.toUpperCase()}
                      sx={{
                        bgcolor: STATUS_CONFIG[currentStatus.status]?.lightBg,
                        color: STATUS_CONFIG[currentStatus.status]?.color,
                        fontWeight: 600,
                        height: 24,
                        marginLeft:"10px"
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Button
                variant="contained"
                onClick={onPunchIn}
                disabled={loading || status === 'punched-in'}
                fullWidth
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <MyLocationIcon />}
                sx={{ borderRadius: 2 }}
              >
                {status === 'punched-in' ? 'Already Punched In' : 'Punch In'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={onPunchOut}
                disabled={loading || status !== 'punched-in'}
                fullWidth
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Punch Out
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ========== ATTENDANCE STATS ==========
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

  const statCards = [
    {
      title: 'Present Today',
      value: stats?.totalPresent || 0,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
      subtitle: 'On-time attendance',
      progress: stats?.totalPresent ? (stats.totalPresent / (stats.totalEmployees || 1)) * 100 : 0
    },
    {
      title: 'Absent Today',
      value: stats?.totalAbsent || 0,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
      subtitle: 'Absences reported',
      progress: stats?.totalAbsent ? (stats.totalAbsent / (stats.totalEmployees || 1)) * 100 : 0
    },
    {
      title: 'Late Arrivals',
      value: stats?.totalLate || 0,
      icon: <TimerIcon />,
      color: theme.palette.warning.main,
      subtitle: 'Late punches',
      progress: stats?.totalLate ? (stats.totalLate / (stats.totalEmployees || 1)) * 100 : 0
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 0}%`,
      icon: <PercentIcon />,
      color: theme.palette.info.main,
      subtitle: 'Overall compliance',
      progress: stats?.attendanceRate || 0
    }
  ];

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 , marginLeft: "25px" }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.02)} 100%)`,
              position: 'relative',
              overflow: 'hidden',
              width: "277px"
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 4,
                background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.5)} 100%)`
              }}
            />
            
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      width: 42,
                      height: 42
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>

                <Box>
                  <MuiLinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(stat.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [actionType, setActionType] = useState('create');
  const [formData, setFormData] = useState({
    userId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchInTime: '',
    punchOutTime: '',
    status: 'present',
    notes: '',
    manualPunchIn: '',
    manualPunchOut: ''
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
  
  // Role checks
  const isAdmin = ['Head_office', 'ZSM'].includes(userRole);
  const isASM = userRole === 'ASM';
  const isTeam = userRole === 'TEAM';

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
    fetchAttendanceData(1);
  }, [fetchAttendanceData, refreshTrigger]);

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

  // Open dialog for CRUD operations
  const handleOpenDialog = (type, attendance = null) => {
    setActionType(type);
    setCurrentAttendance(attendance);
    setValidationErrors({});

    if (type === 'edit' && attendance) {
      setFormData({
        userId: attendance.user?._id || '',
        date: attendance.date ? format(parseISO(attendance.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        punchInTime: attendance.punchInTime ? format(parseISO(attendance.punchInTime), 'HH:mm') : '',
        punchOutTime: attendance.punchOutTime ? format(parseISO(attendance.punchOutTime), 'HH:mm') : '',
        status: attendance.status || 'present',
        notes: attendance.notes || '',
        manualPunchIn: attendance.punchInTime || '',
        manualPunchOut: attendance.punchOutTime || ''
      });
    } else if (type === 'create') {
      setFormData({
        userId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        punchInTime: '',
        punchOutTime: '',
        status: 'present',
        notes: '',
        manualPunchIn: '',
        manualPunchOut: ''
      });
    }

    setDialogOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.userId) {
      errors.userId = 'Employee is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if (!formData.punchInTime) {
      errors.punchInTime = 'Punch in time is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (actionType !== 'delete' && !validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (actionType === 'delete') {
        await fetchAPI(`/attendance/${currentAttendance._id}`, {
          method: 'DELETE'
        });
        setSuccess('Attendance record deleted successfully');
      } else if (actionType === 'edit') {
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

        await fetchAPI(`/attendance/${currentAttendance._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        setSuccess('Attendance updated successfully');
      } else if (actionType === 'create' && (isAdmin || isASM)) {
        await fetchAPI('/attendance/manual', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess('Attendance created successfully');
      }

      setDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle export report
  const handleExportReport = async ({ formatType, queryString }) => {
    try {
      setExportLoading(true);
      
      const result = await fetchAPI(`/attendance/export?${queryString}`);
      
      if (result?.success && result.result?.downloadUrl) {
        // Open download URL in new tab
        window.open(result.result.downloadUrl, '_blank');
        setSuccess(`Report exported successfully!`);
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
    // Note: Sorting is handled client-side for now
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

  // ========== UTILITY FUNCTIONS ==========

  // Get status config
  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || {
      label: 'Unknown',
      bg: '#f5f5f5',
      color: '#616161',
      lightBg: alpha('#616161', 0.08),
      icon: <InfoIcon sx={{ fontSize: 18 }} />
    };
  };

  // Get role config
  const getRoleConfig = (role) => {
    return ROLE_CONFIG[role] || {
      label: 'Unknown',
      color: '#757575',
      bg: alpha('#757575', 0.08),
      icon: <PersonIcon sx={{ fontSize: 16 }} />
    };
  };

  // Calculate working hours
  const calculateWorkingHours = (punchInTime, punchOutTime) => {
    if (!punchInTime || !punchOutTime) return '00:00';
    try {
      const inTime = parseISO(punchInTime);
      const outTime = parseISO(punchOutTime);
      const minutes = differenceInMinutes(outTime, inTime);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    } catch {
      return '00:00';
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  // Format time for display
  const formatDisplayTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      return format(parseISO(timeString), 'hh:mm a');
    } catch {
      return '--:--';
    }
  };

  // ========== RENDER FUNCTIONS ==========

  // Render action buttons
  const renderActionButtons = (row) => {
    if (isTeam) return null;

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog('edit', row)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>

        {isAdmin && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleOpenDialog('delete', row)}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
              }}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  // Tabs configuration
  const tabs = [
    { label: 'All Records', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: 2,
            mb: 3,
            marginLeft: "25px"
          }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={700}
                sx={{ mb: 0.5 }}
              >
                Attendance Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage employee attendance records
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={loading}
                size={isMobile ? 'small' : 'medium'}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>

              {(isAdmin || isASM) && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('create')}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Record
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => setReportDialogOpen(true)}
                    size={isMobile ? 'small' : 'medium'}
                    disabled={exportLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Export
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* Stats Section */}
          <AttendanceStats refreshTrigger={refreshTrigger} />
        </Box>

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
                onClose={() => setError(null)}
                sx={{ mb: 2, borderRadius: 2 }}
                icon={<WarningIcon />}
              >
                {error}
              </Alert>
            </Slide>
          )}
          
          {success && (
            <Slide direction="down" in={!!success}>
              <Alert
                severity="success"
                onClose={() => setSuccess(null)}
                sx={{ mb: 2, borderRadius: 2 }}
                icon={<CheckCircleIcon />}
              >
                {success}
              </Alert>
            </Slide>
          )}
        </AnimatePresence>

        {/* Main Content Card */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' , marginLeft:"25px" }}>
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
                  minHeight: 48,
                  fontWeight: 600,
                  textTransform: 'none'
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', md: 'center' }}
              >
                <Box sx={{ width: { xs: '100%', md: 300 } }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearchQuery('')}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
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
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                      <MenuItem value="half-day">Half Day</MenuItem>
                      <MenuItem value="on-leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    sx={{ borderRadius: 2, display: { xs: 'none', sm: 'flex' } }}
                  >
                    {showFilterPanel ? 'Hide' : 'Filters'}
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
                    transition={{ duration: 0.2 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Date Range
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Start Date"
                            value={dateFilter.startDate}
                            onChange={(newValue) => {
                              setDateFilter(prev => ({ ...prev, startDate: newValue }));
                              setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth size="small" sx={{ borderRadius: 2 }} />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="End Date"
                            value={dateFilter.endDate}
                            onChange={(newValue) => {
                              setDateFilter(prev => ({ ...prev, endDate: newValue }));
                              setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            minDate={dateFilter.startDate}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth size="small" sx={{ borderRadius: 2 }} />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleClearFilters}
                          sx={{ borderRadius: 2 }}
                        >
                          Clear All
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setShowFilterPanel(false);
                            setRefreshTrigger(prev => prev + 1);
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          Apply
                        </Button>
                      </Stack>
                    </Paper>
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
                        sx={{ borderRadius: 1.5 }}
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
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Button
                      size="small"
                      onClick={() => handleSort('user')}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                      endIcon={sortConfig.key === 'user' && (
                        sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                      )}
                    >
                      Employee
                    </Button>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Button
                      size="small"
                      onClick={() => handleSort('date')}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                      endIcon={sortConfig.key === 'date' && (
                        sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                      )}
                    >
                      Date
                    </Button>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>Punch In</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>Punch Out</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>Hours</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>Status</TableCell>
                  {!isTeam && <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((row) => {
                    const statusConfig = getStatusConfig(row.status);
                    const roleConfig = getRoleConfig(row.user?.role);
                    const isTodayRecord = row.date && isToday(parseISO(row.date));

                    return (
                      <TableRow
                        key={row._id}
                        hover
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                          bgcolor: isTodayRecord ? alpha(theme.palette.primary.main, 0.04) : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: roleConfig.bg,
                                color: roleConfig.color,
                                fontSize: '0.875rem',
                                fontWeight: 600
                              }}
                            >
                              {row.user?.firstName?.charAt(0)}
                              {row.user?.lastName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {row.user?.firstName} {row.user?.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.user?.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              {formatDisplayDate(row.date)}
                            </Typography>
                            {isTodayRecord && (
                              <Chip
                                size="small"
                                label="Today"
                                sx={{
                                  height: 20,
                                  fontSize: '0.625rem',
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  fontWeight: 600
                                }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDisplayTime(row.punchInTime)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDisplayTime(row.punchOutTime)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {row.workingHours ? `${Math.floor(row.workingHours / 60)}h ${row.workingHours % 60}m` : '00:00'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            icon={statusConfig.icon}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.lightBg,
                              color: statusConfig.color,
                              fontWeight: 600,
                              minWidth: 90,
                              borderRadius: 1.5
                            }}
                          />
                        </TableCell>
                        
                        {!isTeam && (
                          <TableCell>
                            {renderActionButtons(row)}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={isTeam ? 6 : 7} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No records found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchQuery || filterStatus !== 'all' || dateFilter.startDate || dateFilter.endDate
                            ? 'Try adjusting your filters'
                            : 'No attendance data available'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.total > 0 && (
            <Box sx={{ 
              p: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </Typography>
              
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  '.MuiTablePagination-select': { borderRadius: 1.5 },
                  '.MuiTablePagination-actions': { ml: 1 }
                }}
              />
            </Box>
          )}
        </Card>
      </Box>

      {/* ========== DIALOGS ========== */}

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>
              {actionType === 'create' ? 'Add Attendance Record' : 
               actionType === 'edit' ? 'Edit Attendance' : 
               'Delete Attendance'}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {actionType === 'delete' ? (
            <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
              Are you sure you want to delete this attendance record? This action cannot be undone.
            </Alert>
          ) : (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <FormControl fullWidth error={!!validationErrors.userId} disabled={actionType === 'edit'}>
                <InputLabel>Employee *</InputLabel>
                <Select
                  value={formData.userId}
                  label="Employee *"
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.role})
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.userId && (
                  <FormHelperText>{validationErrors.userId}</FormHelperText>
                )}
              </FormControl>

              <DatePicker
                label="Date *"
                value={formData.date ? parseISO(`${formData.date}T00:00:00`) : null}
                onChange={(date) => setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!validationErrors.date}
                    helperText={validationErrors.date}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />

              <TextField
                label="Punch In Time *"
                type="time"
                value={formData.punchInTime}
                onChange={(e) => setFormData({ ...formData, punchInTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                error={!!validationErrors.punchInTime}
                helperText={validationErrors.punchInTime}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Punch Out Time"
                type="time"
                value={formData.punchOutTime}
                onChange={(e) => setFormData({ ...formData, punchOutTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <FormControl fullWidth error={!!validationErrors.status}>
                <InputLabel>Status *</InputLabel>
                <Select
                  value={formData.status}
                  label="Status *"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="half-day">Half Day</MenuItem>
                  <MenuItem value="on-leave">On Leave</MenuItem>
                </Select>
                {validationErrors.status && (
                  <FormHelperText>{validationErrors.status}</FormHelperText>
                )}
              </FormControl>

              <TextField
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={actionType === 'delete' ? 'error' : 'primary'}
            disabled={loading}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {loading ? 'Processing...' : 
             actionType === 'delete' ? 'Delete' : 
             actionType === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Report Dialog */}
      <ExportReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onExport={handleExportReport}
        loading={exportLoading}
      />

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
            boxShadow: theme.shadows[8]
          }}
          onClick={() => handleOpenDialog('create')}
        >
          <AddIcon />
        </Fab>
      )}
    </LocalizationProvider>
  );
}

// ========== EXPORT REPORT DIALOG ==========
const ExportReportDialog = ({ open, onClose, onExport, loading }) => {
  const theme = useTheme();
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
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <DownloadIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Export Report
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Download attendance data in your preferred format
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Report Type
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {['daily', 'weekly', 'monthly', 'custom'].map((type) => (
                <Chip
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  onClick={() => setReportType(type)}
                  color={reportType === type ? 'primary' : 'default'}
                  variant={reportType === type ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 1.5, textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
          </Box>

          {reportType === 'custom' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(date) => setDateRange({ ...dateRange, start: date })}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(date) => setDateRange({ ...dateRange, end: date })}
                  minDate={dateRange.start}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  )}
                />
              </Grid>
            </Grid>
          )}

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Employee Type
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {['all', 'TEAM', 'ASM', 'ZSM', 'Head_office'].map((type) => (
                <Chip
                  key={type}
                  label={type === 'all' ? 'All Employees' : type.replace('_', ' ')}
                  onClick={() => setEmployeeType(type)}
                  color={employeeType === type ? 'primary' : 'default'}
                  variant={employeeType === type ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 1.5, textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Format
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant={formatType === 'excel' ? 'contained' : 'outlined'}
                onClick={() => setFormatType('excel')}
                sx={{ 
                  borderRadius: 2, 
                  flex: 1,
                  bgcolor: formatType === 'excel' ? 'success.main' : 'transparent',
                  '&:hover': { bgcolor: formatType === 'excel' ? 'success.dark' : 'action.hover' }
                }}
              >
                Excel (.xlsx)
              </Button>
              <Button
                variant={formatType === 'pdf' ? 'contained' : 'outlined'}
                onClick={() => setFormatType('pdf')}
                sx={{ 
                  borderRadius: 2, 
                  flex: 1,
                  bgcolor: formatType === 'pdf' ? 'error.main' : 'transparent',
                  '&:hover': { bgcolor: formatType === 'pdf' ? 'error.dark' : 'action.hover' }
                }}
              >
                PDF (.pdf)
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          disabled={loading}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {loading ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};