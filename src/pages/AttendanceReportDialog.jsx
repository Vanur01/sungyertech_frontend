// components/attendance/AttendanceReportDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Alert,
  Paper,
  Stack,Avatar,Checkbox,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Description as PDFIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PictureAsPdfIcon,
  InsertChart as ChartIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  CalendarToday,
  FilterList,
  Group,
  Description
} from '@mui/icons-material';
import { format } from 'date-fns';

const AttendanceReportDialog = ({ open, onClose, onExport }) => {
  const theme = useTheme();
  const [reportType, setReportType] = useState('daily');
  const [formatType, setFormatType] = useState('excel');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [employeeType, setEmployeeType] = useState('all');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(false);

  const handleExport = () => {
    let type = '';
    
    switch (reportType) {
      case 'daily':
        type = 'today';
        break;
      case 'weekly':
        type = 'week';
        break;
      case 'monthly':
        type = 'month';
        break;
      case 'custom':
        type = `custom?start=${format(dateRange.start, 'yyyy-MM-dd')}&end=${format(dateRange.end, 'yyyy-MM-dd')}`;
        break;
      default:
        type = 'today';
    }
    
    const options = {
      type,
      format: formatType,
      employeeType,
      includeDetails,
      includeLocation
    };
    
    onExport(options);
    onClose();
  };

  const reportTypes = [
    { value: 'daily', label: 'Daily Report', icon: '📅', description: 'Today\'s attendance summary' },
    { value: 'weekly', label: 'Weekly Report', icon: '📆', description: 'This week\'s attendance overview' },
    { value: 'monthly', label: 'Monthly Report', icon: '🗓️', description: 'Monthly attendance analytics' },
    { value: 'custom', label: 'Custom Range', icon: '📊', description: 'Select specific dates' }
  ];

  const employeeTypes = [
    { value: 'all', label: 'All Employees', count: 50 },
    { value: 'team', label: 'Team Members', count: 35 },
    { value: 'asm', label: 'ASM', count: 8 },
    { value: 'zsm', label: 'ZSM', count: 5 },
    { value: 'head_office', label: 'Head Office', count: 2 }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            }}
          >
            <ChartIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div" fontWeight={700}>
              Export Attendance Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate detailed attendance reports in multiple formats
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Report Type Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList fontSize="small" />
              Select Report Type
            </Typography>
            <Grid container spacing={2}>
              {reportTypes.map((type) => (
                <Grid item xs={12} sm={6} key={type.value}>
                  <Paper
                    elevation={0}
                    onClick={() => setReportType(type.value)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${reportType === type.value ? theme.palette.primary.main : theme.palette.divider}`,
                      bgcolor: reportType === type.value ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }
                    }}
                  >
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h4">{type.icon}</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {type.label}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Date Range for Custom Reports */}
          {reportType === 'custom' && (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  Select Date Range
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={dateRange.start}
                        onChange={(date) => setDateRange({ ...dateRange, start: date })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={dateRange.end}
                        onChange={(date) => setDateRange({ ...dateRange, end: date })}
                        minDate={dateRange.start}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Employee Filter */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Group fontSize="small" />
              Filter by Employee Type
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {employeeTypes.map((emp) => (
                <Chip
                  key={emp.value}
                  label={`${emp.label} (${emp.count})`}
                  onClick={() => setEmployeeType(emp.value)}
                  color={employeeType === emp.value ? 'primary' : 'default'}
                  variant={employeeType === emp.value ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          </Grid>

          {/* Report Options */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description fontSize="small" />
              Report Options
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeDetails}
                      onChange={(e) => setIncludeDetails(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Include detailed breakdown"
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  Shows individual employee records
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeLocation}
                      onChange={(e) => setIncludeLocation(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Include location data"
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  Adds GPS coordinates to report
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Export Format */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Export Format
            </Typography>
            <RadioGroup
              row
              value={formatType}
              onChange={(e) => setFormatType(e.target.value)}
              sx={{ gap: 2 }}
            >
              <Paper
                elevation={0}
                onClick={() => setFormatType('excel')}
                sx={{
                  p: 2,
                  flex: 1,
                  borderRadius: 2,
                  border: `2px solid ${formatType === 'excel' ? theme.palette.success.main : theme.palette.divider}`,
                  bgcolor: formatType === 'excel' ? alpha(theme.palette.success.main, 0.05) : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: formatType === 'excel' ? 'success.main' : 'grey.300', color: 'white' }}>
                    <ExcelIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      Excel (.xlsx)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Best for data analysis
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                onClick={() => setFormatType('pdf')}
                sx={{
                  p: 2,
                  flex: 1,
                  borderRadius: 2,
                  border: `2px solid ${formatType === 'pdf' ? theme.palette.error.main : theme.palette.divider}`,
                  bgcolor: formatType === 'pdf' ? alpha(theme.palette.error.main, 0.05) : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: formatType === 'pdf' ? 'error.main' : 'grey.300', color: 'white' }}>
                    <PictureAsPdfIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      PDF (.pdf)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Best for printing and sharing
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </RadioGroup>
          </Grid>

          {/* Information Alert */}
          <Grid item xs={12}>
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Typography variant="body2">
                The report will include attendance details, punch times, status summary, and selected filters.
                {includeLocation && ' Location coordinates will be included for security verification.'}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ borderRadius: 2, px: 4 }}
        >
          Generate Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceReportDialog;