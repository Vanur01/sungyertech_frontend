// components/attendance/AttendanceStats.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Chip,
  CircularProgress,Paper,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
  Avatar,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
    Cancel as CancelIcon,
  People as PeopleIcon,
  Percent as PercentIcon,
  AccessTime as AccessTimeIcon,
  GpsFixed as LocationIcon,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const AttendanceStats = ({ refreshTrigger }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { fetchAPI } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const result = await fetchAPI('/attendance/stats');
      
      if (result.success) {
        setStats(result.data || result.result);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Expose refresh function to parent
    window.statsRefresh = fetchStats;
    
    return () => {
      delete window.statsRefresh;
    };
  }, [refreshTrigger]);

  // Mock data for demo if API fails
  const mockStats = {
    totalPresent: 45,
    totalAbsent: 8,
    totalPunchIn: 38,
    attendanceRate: 84.9,
    totalLate: 5,
    averageHours: 8.2,
    locationAccuracy: 92,
    previousRate: 82.5
  };

  const displayStats = stats || mockStats;

  const statCards = [
    {
      title: 'Present Today',
      value: displayStats.totalPresent || 0,
      icon: <PresentIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.08),
      trend: displayStats.totalPresent > 40 ? 'up' : 'down',
      change: '+12%',
      subtitle: 'On-time attendance',
      progress: Math.min((displayStats.totalPresent / 50) * 100, 100),
      detailIcon: <PeopleIcon />
    },
    {
      title: 'Absent Today',
      value: displayStats.totalAbsent || 0,
      icon: <AbsentIcon />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.08),
      trend: displayStats.totalAbsent < 10 ? 'down' : 'up',
      change: '-5%',
      subtitle: 'Absences reported',
      progress: Math.min((displayStats.totalAbsent / 20) * 100, 100),
      detailIcon: <CancelIcon />
    },
    {
      title: 'Punched In',
      value: displayStats.totalPunchIn || 0,
      icon: <ScheduleIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.08),
      trend: 'up',
      change: '+8%',
      subtitle: 'Active punches',
      progress: Math.min((displayStats.totalPunchIn / 45) * 100, 100),
      detailIcon: <AccessTimeIcon />
    },
    {
      title: 'Attendance Rate',
      value: `${displayStats.attendanceRate || 0}%`,
      icon: <TrendingIcon />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.08),
      trend: (displayStats.attendanceRate || 0) > 80 ? 'up' : 'down',
      change: `${((displayStats.attendanceRate || 0) - (displayStats.previousRate || 0)).toFixed(1)}%`,
      subtitle: 'Overall compliance',
      progress: displayStats.attendanceRate || 0,
      detailIcon: <PercentIcon />
    }
  ];

  const StatCard = ({ stat, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 3,
          border: `1px solid ${alpha(stat.color, 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.02)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
            transition: 'all 0.3s ease'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {/* Background accent */}
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
        
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {stat.value}
                </Typography>
              </Box>
              
              <Avatar
                sx={{
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color,
                  width: 48,
                  height: 48,
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`
                }}
              >
                {stat.icon}
              </Avatar>
            </Box>

            {/* Trend indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {stat.trend === 'up' ? (
                <ArrowUpward sx={{ fontSize: 16, color: theme.palette.success.main }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: theme.palette.error.main }} />
              )}
              <Typography 
                variant="caption" 
                fontWeight={600}
                color={stat.trend === 'up' ? 'success.main' : 'error.main'}
              >
                {stat.change}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.subtitle}
              </Typography>
            </Box>

            {/* Progress bar */}
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(stat.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: stat.color,
                    borderRadius: 3
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {Math.round(stat.progress)}% of target
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Additional metrics row
  const additionalMetrics = [
    {
      title: 'Late Arrivals',
      value: displayStats.totalLate || 0,
      icon: <TimerIcon />,
      color: theme.palette.warning.main
    },
    {
      title: 'Avg. Hours',
      value: `${displayStats.averageHours || 0}h`,
      icon: <AccessTimeIcon />,
      color: theme.palette.info.main
    },
    {
      title: 'Location Accuracy',
      value: `${displayStats.locationAccuracy || 0}%`,
      icon: <LocationIcon />,
      color: theme.palette.success.main
    }
  ];

  return (
    <Card 
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 0.5 }}>
              Attendance Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time statistics and performance metrics
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {error && (
              <Chip
                label={error}
                color="error"
                size="small"
                sx={{ height: 32 }}
              />
            )}
            
            <Tooltip title="Refresh Statistics">
              <IconButton 
                onClick={fetchStats} 
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'rotate(180deg)',
                    transition: 'transform 0.5s ease'
                  }
                }}
                disabled={refreshing}
              >
                {refreshing ? (
                  <CircularProgress size={20} />
                ) : (
                  <RefreshIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading statistics...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Main Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((stat, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  lg={3} 
                  key={index}
                  sx={{
                    '& > div': {
                      height: '100%'
                    }
                  }}
                >
                  <StatCard stat={stat} index={index} />
                </Grid>
              ))}
            </Grid>

            {/* Additional Metrics */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
                Additional Metrics
              </Typography>
              
              <Grid container spacing={2}>
                {additionalMetrics.map((metric, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        border: `1px solid ${alpha(metric.color, 0.1)}`,
                        '&:hover': {
                          bgcolor: alpha(metric.color, 0.05),
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha(metric.color, 0.1),
                          color: metric.color
                        }}
                      >
                        {metric.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.title}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {metric.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Summary */}
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Summary:</strong> Today's attendance shows{' '}
                <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
                  {displayStats.totalPresent} employees present
                </Box>
                , with an overall attendance rate of{' '}
                <Box component="span" sx={{ color: 'warning.main', fontWeight: 600 }}>
                  {displayStats.attendanceRate || 0}%
                </Box>
                . {displayStats.totalLate > 0 ? `${displayStats.totalLate} late arrivals recorded.` : 'All employees arrived on time.'}
              </Typography>
            </Box>
          </>
        )}

        {/* Last Updated */}
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceStats;