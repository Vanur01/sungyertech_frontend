// components/attendance/PunchInOutCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
  Paper,
  Divider,
  Fade,
  Zoom,
  alpha,
  useTheme
} from '@mui/material';
import {
  Login as PunchInIcon,
  Logout as PunchOutIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  CheckCircle as SuccessIcon,
  AccessTime,
  Today,
  MyLocation,
  DoneAll,
  ErrorOutline,
  Timer as TimerIcon,
  GpsFixed as GpsFixedIcon,
  LocationOff as LocationOffIcon,
  LockClock as LockClockIcon
} from '@mui/icons-material';
import { format, differenceInMinutes } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const PunchInOutCard = ({ 
  onPunchIn, 
  onPunchOut, 
  loading, 
  locationError, 
  currentStatus,
  locationPermissionGranted,
  onRequestLocationPermission 
}) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastPunch, setLastPunch] = useState(null);
  const [punchStatus, setPunchStatus] = useState('out');
  const [isPulsing, setIsPulsing] = useState(false);
  const [workingHours, setWorkingHours] = useState('00:00');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check last punch status
  useEffect(() => {
    const savedPunch = localStorage.getItem('lastPunch');
    if (savedPunch) {
      setLastPunch(JSON.parse(savedPunch));
      setPunchStatus('in');
    }
    
    if (currentStatus?.punchInTime) {
      const punchData = {
        time: currentStatus.punchInTime,
        type: 'in'
      };
      setLastPunch(punchData);
      setPunchStatus('in');
      
      // Calculate working hours if punched in
      if (currentStatus.punchInTime) {
        const interval = setInterval(() => {
          const now = new Date();
          const start = new Date(currentStatus.punchInTime);
          const diffMs = now - start;
          const diffHrs = Math.floor(diffMs / 3600000);
          const diffMins = Math.floor((diffMs % 3600000) / 60000);
          setWorkingHours(`${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`);
        }, 60000); // Update every minute
        return () => clearInterval(interval);
      }
    }
  }, [currentStatus]);

  // Pulsing effect for active status
  useEffect(() => {
    if (punchStatus === 'in') {
      const pulse = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 2000);
      return () => clearInterval(pulse);
    }
  }, [punchStatus]);

  const handlePunchIn = async () => {
    if (!locationPermissionGranted) {
      onRequestLocationPermission();
      return;
    }
    
    const result = await onPunchIn();
    if (result) {
      const punchData = {
        time: new Date().toISOString(),
        type: 'in'
      };
      localStorage.setItem('lastPunch', JSON.stringify(punchData));
      setLastPunch(punchData);
      setPunchStatus('in');
    }
  };

  const handlePunchOut = async () => {
    const result = await onPunchOut();
    if (result) {
      localStorage.removeItem('lastPunch');
      setLastPunch(null);
      setPunchStatus('out');
      setWorkingHours('00:00');
      setIsPulsing(false);
    }
  };

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        overflow: 'visible',
        position: 'relative',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left Column - Time & Info */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="text.primary">
                    Attendance Punch
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mark your attendance with real-time location tracking
                  </Typography>
                </Box>
              </Box>

              {/* Time Display */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  }}
                />
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AccessTime sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        CURRENT TIME
                      </Typography>
                      <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mt: 0.5 }}>
                        {format(currentTime, 'hh:mm:ss')}
                        <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          {format(currentTime, 'a')}
                        </Typography>
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Today sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {/* Status Indicators */}
              <Stack spacing={2}>
                <AnimatePresence>
                  {lastPunch && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Chip
                          icon={<SuccessIcon />}
                          label={
                            <Typography variant="body2" fontWeight={500}>
                              Punched in at {format(new Date(lastPunch.time), 'hh:mm a')}
                            </Typography>
                          }
                          color="success"
                          sx={{
                            height: 40,
                            borderRadius: 2,
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            '& .MuiChip-icon': {
                              color: 'success.dark',
                              fontSize: 20,
                            }
                          }}
                        />
                        
                        {punchStatus === 'in' && (
                          <Chip
                            icon={<TimerIcon />}
                            label={
                              <Typography variant="body2" fontWeight={500}>
                                Working: {workingHours}
                              </Typography>
                            }
                            color="info"
                            sx={{
                              height: 40,
                              borderRadius: 2,
                              bgcolor: 'info.light',
                              color: 'info.dark',
                              '& .MuiChip-icon': {
                                color: 'info.dark',
                                fontSize: 20,
                              }
                            }}
                          />
                        )}
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Location Status */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: locationPermissionGranted ? 'success.lighter' : 'warning.lighter',
                    border: '1px solid',
                    borderColor: locationPermissionGranted ? 'success.light' : 'warning.light',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {locationPermissionGranted ? (
                      <GpsFixedIcon sx={{ color: 'success.main' }} />
                    ) : (
                      <LocationOffIcon sx={{ color: 'warning.main' }} />
                    )}
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        LOCATION STATUS
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {locationPermissionGranted ? 'Location tracking active' : 'Location permission required'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>

              {/* Location Error Alert */}
              {locationError && (
                <Fade in={!!locationError}>
                  <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'error.light',
                      bgcolor: 'error.lighter',
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {locationError}
                    </Typography>
                  </Alert>
                </Fade>
              )}
            </Stack>
          </Grid>

          {/* Right Column - Punch Buttons */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {/* Status Indicator */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: punchStatus === 'in' ? 'success.lighter' : 'grey.100',
                  border: '2px solid',
                  borderColor: punchStatus === 'in' ? 'success.light' : 'grey.300',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: punchStatus === 'in' 
                      ? 'radial-gradient(circle at 30% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 70%)'
                      : 'none',
                  }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      CURRENT STATUS
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color={punchStatus === 'in' ? 'success.dark' : 'text.primary'}>
                      {punchStatus === 'in' ? 'CLOCKED IN' : 'CLOCKED OUT'}
                    </Typography>
                  </Box>
                  {punchStatus === 'in' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: isPulsing ? 'success.main' : 'success.light',
                        boxShadow: `0 0 0 ${isPulsing ? '12px' : '0px'} rgba(76, 175, 80, 0.3)`,
                        transition: 'all 0.6s ease',
                      }}
                    />
                  )}
                </Stack>
              </Paper>

              {/* Punch Buttons */}
              <Stack spacing={2}>
                <Zoom in={!loading}>
                  <Button
                    variant={punchStatus === 'out' ? 'contained' : 'outlined'}
                    color="success"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PunchInIcon />}
                    onClick={handlePunchIn}
                    disabled={loading || punchStatus === 'in'}
                    sx={{
                      height: 56,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: punchStatus === 'out' ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none',
                      '&:hover': {
                        boxShadow: punchStatus === 'out' ? '0 6px 16px rgba(76, 175, 80, 0.4)' : 'none',
                        transform: punchStatus === 'out' ? 'translateY(-1px)' : 'none',
                      },
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {loading ? 'Processing...' : 'Punch In'}
                  </Button>
                </Zoom>

                <Zoom in={!loading} style={{ transitionDelay: '100ms' }}>
                  <Button
                    variant={punchStatus === 'in' ? 'contained' : 'outlined'}
                    color="error"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PunchOutIcon />}
                    onClick={handlePunchOut}
                    disabled={loading || punchStatus === 'out'}
                    sx={{
                      height: 56,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: punchStatus === 'in' ? '0 4px 12px rgba(244, 67, 54, 0.3)' : 'none',
                      '&:hover': {
                        boxShadow: punchStatus === 'in' ? '0 6px 16px rgba(244, 67, 54, 0.4)' : 'none',
                        transform: punchStatus === 'in' ? 'translateY(-1px)' : 'none',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {loading ? 'Processing...' : 'Punch Out'}
                  </Button>
                </Zoom>
              </Stack>

              {/* Location Requirement */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: locationPermissionGranted ? 'success.light' : 'warning.light',
                    }}
                  >
                    <MyLocation sx={{ color: locationPermissionGranted ? 'success.dark' : 'warning.dark' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      Location Required
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {locationPermissionGranted 
                        ? 'Location services are active'
                        : 'Enable location to punch in/out'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Help Text */}
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.6 }}>
                <LocationIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                Location services must be enabled for accurate attendance tracking
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PunchInOutCard;