// pages/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Snackbar,
  Paper,
  alpha,
} from "@mui/material";
import {
  BarChart,
  PieChart,
  Build,
  TrendingUp,
  Download,
  Visibility,
  Assessment,
  Close,
  CloudDownload,
  InsertDriveFile,
  Refresh,
  CheckCircle,
  Error,
  Downloading,
  People,
  ReceiptLong,
  AttachMoney,
  CalendarToday,
  Schedule,
  Info,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { format, parseISO, isValid } from "date-fns";

const PRIMARY_COLOR = "#4569ea";
const SECONDARY_COLOR = "#1a237e";

// Report configurations with API endpoints
const REPORT_CONFIGS = [
  {
    key: "leads",
    title: "Leads Report",
    description: "Lead tracking and pipeline performance",
    icon: <TrendingUp />,
    endpoint: "/report/leads",
    columns: [
      { field: "firstName", label: "First Name" },
      { field: "lastName", label: "Last Name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "status", label: "Status" },
      { field: "source", label: "Source" },
      { field: "assignedManager", label: "Assigned ASM" },
      { field: "assignedUser", label: "Assigned TEAM" },
      { field: "createdAt", label: "Created Date" },
    ],
  },
  {
    key: "installation",
    title: "Installation Report",
    description: "Installation completion metrics and progress",
    icon: <Build />,
    endpoint: "/report/installations",
    columns: [
      { field: "customerName", label: "Customer" },
      { field: "status", label: "Status" },
      { field: "installationDate", label: "Installation Date" },
      { field: "assignedTeam", label: "Assigned Team" },
      { field: "completionDate", label: "Completion Date" },
    ],
  },
  {
    key: "expenses",
    title: "Expenses Report",
    description: "Expense tracking and approval status",
    icon: <ReceiptLong />,
    endpoint: "/report/expenses",
    columns: [
      { field: "title", label: "Title" },
      { field: "amount", label: "Amount" },
      { field: "category", label: "Category" },
      { field: "status", label: "Status" },
      { field: "createdBy", label: "Created By" },
      { field: "expenseDate", label: "Expense Date" },
      { field: "approvedBy", label: "Approved By" },
    ],
  },
];

// Role-based access control
const ROLE_ACCESS = {
  Head_office: {
    canAccess: ["leads", "installation", "expenses"],
    canSeeAll: true,
  },
  ZSM: {
    canAccess: ["leads", "installation", "expenses"],
    canSeeAll: true,
  },
  ASM: {
    canAccess: ["leads", "expenses"],
    canSeeAll: false,
  },
  TEAM: {
    canAccess: ["leads", "expenses"],
    canSeeAll: false,
  },
};

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate)
      ? format(parsedDate, "MMM dd, yyyy")
      : "Invalid date";
  } catch {
    return "Invalid date";
  }
};

// View Details Modal Component
const ReportDetailsModal = ({ open, onClose, report, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data) return null;

  const formatCellValue = (value, field) => {
    if (!value) return "N/A";
    
    if (typeof value === 'object') {
      if (field === 'assignedManager' || field === 'assignedUser' || 
          field === 'createdBy' || field === 'approvedBy' || field === 'assignedTo') {
        return `${value.firstName || ''} ${value.lastName || ''}`.trim();
      }
      return JSON.stringify(value);
    }
    
    if (field.includes('Date') || field.includes('At')) {
      return formatDate(value);
    }
    
    if (field === 'amount') {
      return `₹${value}`;
    }
    
    return value;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          borderRadius: isMobile ? 0 : 3,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: PRIMARY_COLOR,
        color: "white",
        py: 2.5,
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {report?.icon && React.cloneElement(report.icon, { sx: { color: "white" } })}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {report?.title} - Details
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Showing first 10 of {data.length} records
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Assessment sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No data available for this report
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto", p: 3 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: alpha(PRIMARY_COLOR, 0.05) }}>
                    {report.columns.map((col) => (
                      <th
                        key={col.field}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: PRIMARY_COLOR,
                          borderBottom: `2px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
                          fontSize: "0.875rem",
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: index % 2 === 0 ? "white" : alpha(PRIMARY_COLOR, 0.02),
                        "&:hover": { backgroundColor: alpha(PRIMARY_COLOR, 0.05) },
                      }}
                    >
                      {report.columns.map((col) => (
                        <td key={col.field} style={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                          {formatCellValue(row[col.field], col.field)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: "grey.50", borderTop: 1, borderColor: "divider" }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 4,
            borderColor: PRIMARY_COLOR,
            color: PRIMARY_COLOR,
            "&:hover": {
              borderColor: SECONDARY_COLOR,
              bgcolor: alpha(PRIMARY_COLOR, 0.05),
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function ReportsPage() {
  const { user, fetchAPI } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const userRole = user?.role || "TEAM";
  const roleAccess = ROLE_ACCESS[userRole] || ROLE_ACCESS.TEAM;

  // State management
  const [loading, setLoading] = useState(false);
  const [reportsData, setReportsData] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [stats, setStats] = useState({});

  // Filter reports based on role access
  const accessibleReports = REPORT_CONFIGS.filter(report => 
    roleAccess.canAccess.includes(report.key)
  );

  // Fetch all reports data on component mount
  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const results = {};
      const statsData = {};

      for (const report of accessibleReports) {
        try {
          let endpoint = report.endpoint;
          
          if (!roleAccess.canSeeAll) {
            if (userRole === "ASM") {
              endpoint = `${report.endpoint}?managerId=${user._id}`;
            } else if (userRole === "TEAM") {
              endpoint = `${report.endpoint}?userId=${user._id}`;
            }
          }

          const response = await fetchAPI(endpoint);

          if (response.success) {
            const result = response.result;
            results[report.key] = result[report.key] || result.leads || result.installations || result.expenses || [];
            
            switch (report.key) {
              case "leads":
                statsData[report.key] = {
                  total: result.totalLeads || 0,
                  count: results[report.key].length || 0,
                  statuses: results[report.key].reduce((acc, lead) => {
                    const status = lead.status || "Unknown";
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                  }, {}) || {},
                };
                break;
              
              case "installation":
                statsData[report.key] = {
                  total: result.totalInstallations || 0,
                  completed: result.completed || 0,
                  pending: result.pending || 0,
                  count: results[report.key].length || 0,
                  progress: result.totalInstallations > 0 
                    ? Math.round((result.completed / result.totalInstallations) * 100)
                    : 0,
                };
                break;
              
              case "expenses":
                statsData[report.key] = {
                  total: result.totalExpenses || 0,
                  amount: `₹${result.totalAmount || 0}`,
                  count: results[report.key].length || 0,
                  statuses: results[report.key].reduce((acc, expense) => {
                    const status = expense.status || "Unknown";
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                  }, {}) || {},
                };
                break;
            }
          } else {
            results[report.key] = [];
            console.error(`Failed to fetch ${report.title}:`, response.message);
          }
        } catch (error) {
          console.error(`Error fetching ${report.title}:`, error);
          results[report.key] = [];
        }
      }

      setReportsData(results);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      showSnackbar("Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleView = (reportKey) => {
    const report = accessibleReports.find((r) => r.key === reportKey);
    setSelectedReport({
      ...report,
      data: reportsData[reportKey] || [],
    });
    setViewModalOpen(true);
  };

  const handleDownload = async (reportKey) => {
    const report = accessibleReports.find((r) => r.key === reportKey);
    const data = reportsData[reportKey] || [];

    if (data.length === 0) {
      showSnackbar("No data available to download", "warning");
      return;
    }

    setDownloadProgress((prev) => ({ ...prev, [reportKey]: 0 }));

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          const current = prev[reportKey] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [reportKey]: current + 10 };
        });
      }, 50);

      await downloadCSV(report, data);

      clearInterval(progressInterval);
      setDownloadProgress((prev) => ({ ...prev, [reportKey]: 100 }));

      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[reportKey];
          return newProgress;
        });
      }, 500);

      showSnackbar(`${report.title} downloaded successfully!`, "success");
    } catch (error) {
      console.error("Download failed:", error);
      showSnackbar(`Failed to download ${report.title}`, "error");
      setDownloadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[reportKey];
        return newProgress;
      });
    }
  };

  const downloadCSV = async (report, data) => {
    const headers = report.columns.map((col) => col.label);
    const rows = data.map((item) =>
      report.columns
        .map((col) => {
          let value = item[col.field];
          
          if (typeof value === 'object' && value !== null) {
            if (col.field === 'assignedManager' || col.field === 'assignedUser' || 
                col.field === 'createdBy' || col.field === 'approvedBy' || col.field === 'assignedTo') {
              value = `${value.firstName || ''} ${value.lastName || ''}`.trim();
            } else {
              value = JSON.stringify(value);
            }
          }
          
          if (col.field.includes('Date') || col.field.includes('At')) {
            value = formatDate(value);
          }
          
          if (col.field === 'amount') {
            value = `₹${value}`;
          }
          
          const escapedValue = String(value || "").replace(/"/g, '""');
          return value?.includes(",") ? `"${escapedValue}"` : escapedValue;
        })
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, "_")}_${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkDownload = async () => {
    setLoading(true);
    try {
      for (const report of accessibleReports) {
        if (reportsData[report.key]?.length > 0) {
          await handleDownload(report.key);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      showSnackbar("All reports downloaded successfully!", "success");
    } catch (error) {
      console.error("Bulk download failed:", error);
      showSnackbar("Failed to download all reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStats = (reportKey) => {
    const stat = stats[reportKey];
    if (!stat) return null;

    switch (reportKey) {
      case "leads":
        return (
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Total Leads</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY_COLOR }}>
                {stat.count}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {Object.entries(stat.statuses || {}).slice(0, 3).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(PRIMARY_COLOR, 0.1),
                    color: PRIMARY_COLOR,
                    fontSize: "0.7rem",
                  }}
                />
              ))}
            </Box>
          </Stack>
        );

      case "installation":
        return (
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Installations</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY_COLOR }}>
                {stat.count}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Box sx={{ flex: 1, height: 6, bgcolor: alpha(PRIMARY_COLOR, 0.1), borderRadius: 3 }}>
                <Box
                  sx={{
                    width: `${stat.progress}%`,
                    height: 6,
                    bgcolor: PRIMARY_COLOR,
                    borderRadius: 3,
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stat.completed}/{stat.total}
              </Typography>
            </Box>
          </Stack>
        );

      case "expenses":
        return (
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Total Amount</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY_COLOR }}>
                {stat.amount}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {stat.count} transactions
            </Typography>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: PRIMARY_COLOR }}
          >
            Reports Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access and download CSV reports based on your role permissions • Role: {userRole}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAllReports}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: PRIMARY_COLOR,
              color: PRIMARY_COLOR,
              "&:hover": {
                borderColor: SECONDARY_COLOR,
                bgcolor: alpha(PRIMARY_COLOR, 0.05),
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            onClick={handleBulkDownload}
            disabled={loading || Object.keys(reportsData).length === 0}
            size={isMobile ? "small" : "medium"}
            sx={{
              background: "#4569ea",
              "&:hover": {
                bgcolor: SECONDARY_COLOR,
              },
            }}
          >
            Download All
          </Button>
        </Stack>
      </Stack>

      {/* Loading State */}
      {loading && !Object.keys(reportsData).length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 12,
            flexDirection: "column",
            gap: 3,
          }}
        >
          <CircularProgress size={60} sx={{ color: PRIMARY_COLOR }} />
          <Typography variant="h6" color="text.secondary">
            Loading reports...
          </Typography>
        </Box>
      )}

      {/* Reports Grid */}
      <Grid container spacing={3}>
        {accessibleReports.map((report) => (
          <Grid item xs={12} md={4} key={report.key}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                  borderColor: PRIMARY_COLOR,
                },
              }}
            >
              {/* Download Progress */}
              {downloadProgress[report.key] > 0 &&
                downloadProgress[report.key] < 100 && (
                  <LinearProgress
                    variant="determinate"
                    value={downloadProgress[report.key]}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: alpha(PRIMARY_COLOR, 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: PRIMARY_COLOR,
                      },
                    }}
                  />
                )}

              <CardContent sx={{ p: 3 }}>
                {/* Header with Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha(PRIMARY_COLOR, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: PRIMARY_COLOR,
                    }}
                  >
                    {React.cloneElement(report.icon, { sx: { fontSize: 28 } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Stats */}
                {renderStats(report.key)}

                <Divider sx={{ my: 2 }} />

                {/* Record Count */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <InsertDriveFile sx={{ color: alpha(PRIMARY_COLOR, 0.5), fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {reportsData[report.key]?.length || 0} records • CSV format
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleDownload(report.key)}
                    disabled={
                      downloadProgress[report.key] > 0 ||
                      !reportsData[report.key]?.length
                    }
                    startIcon={<Download />}
                    sx={{
                      background: "#4569ea",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: SECONDARY_COLOR,
                      },
                      "&:disabled": {
                        bgcolor: alpha(PRIMARY_COLOR, 0.3),
                      },
                    }}
                  >
                    {downloadProgress[report.key] ? "Downloading..." : "Download"}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleView(report.key)}
                    disabled={!reportsData[report.key]?.length}
                    startIcon={<Visibility />}
                    sx={{
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: SECONDARY_COLOR,
                        bgcolor: alpha(PRIMARY_COLOR, 0.05),
                      },
                    }}
                  >
                    View
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Data State */}
      {!loading && accessibleReports.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: alpha(PRIMARY_COLOR, 0.05),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Assessment sx={{ fontSize: 60, color: alpha(PRIMARY_COLOR, 0.3) }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            No reports available for your role
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your administrator for report access.
          </Typography>
        </Box>
      )}

      {/* No Data State for accessible reports */}
      {!loading && accessibleReports.length > 0 && Object.keys(reportsData).length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: alpha(PRIMARY_COLOR, 0.05),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Info sx={{ fontSize: 60, color: alpha(PRIMARY_COLOR, 0.3) }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            No data available for reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reports will appear here once data is available.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAllReports}
            sx={{
              mt: 2,
              borderColor: PRIMARY_COLOR,
              color: PRIMARY_COLOR,
              "&:hover": {
                borderColor: SECONDARY_COLOR,
                bgcolor: alpha(PRIMARY_COLOR, 0.05),
              },
            }}
          >
            Refresh Data
          </Button>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 6,
          pt: 3,
          borderTop: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Logged in as: {user?.firstName} {user?.lastName} • Role: {userRole} • 
          Reports visible: {accessibleReports.length} • 
          Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}
        </Typography>
      </Box>

      {/* View Details Modal */}
      <ReportDetailsModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        data={selectedReport?.data || []}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: "100%",
            bgcolor: snackbar.severity === "success" ? PRIMARY_COLOR : undefined,
          }}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
            error: <Error fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}