'use client'

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  Grid,
  Button,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import { 
  GetApp as DownloadIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

// Mock data (replace with API data)
const mockSubscriptionHistory = [
  { 
    id: 1, 
    name: "Basic", 
    date: "2025-01-01", 
    duration: "1 month", 
    price: "$99",
    status: "Expired",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2025-001",
    features: ["5 Job Posts", "50 Resume Views", "Basic Support"]
  },
  { 
    id: 2, 
    name: "Premium", 
    date: "2025-03-01", 
    duration: "3 months", 
    price: "$249",
    status: "Active",
    paymentMethod: "Credit Card", 
    invoiceId: "INV-2025-002",
    features: ["50 Job Posts", "500 Resume Views", "Priority Support", "Analytics"]
  },
  { 
    id: 3, 
    name: "Basic", 
    date: "2024-10-15", 
    duration: "1 month", 
    price: "$99",
    status: "Expired",
    paymentMethod: "PayPal",
    invoiceId: "INV-2024-045",
    features: ["5 Job Posts", "50 Resume Views", "Basic Support"]
  },
];

// Calculate summary stats
const totalSpent = mockSubscriptionHistory.reduce((sum, sub) => sum + parseInt(sub.price.replace('$', '')), 0);
const activeSubscription = mockSubscriptionHistory.find(sub => sub.status === "Active");
const totalSubscriptions = mockSubscriptionHistory.length;

const SubscriptionHistory: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bgcolor: "#D1FAE5", color: "#065F46" };
      case "Expired":
        return { bgcolor: "#FEE2E2", color: "#991B1B" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Premium":
        return "#F59E0B";
      case "Basic":
        return "#6B7280";
      default:
        return "#4F46E5";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: "#4F46E5", width: 48, height: 48 }}>
          <HistoryIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
            Subscription History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your subscription plans and billing history
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: "#10B981", mx: "auto", mb: 2, width: 56, height: 56 }}>
              <AttachMoneyIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
              ${totalSpent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Spent
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: "#4F46E5", mx: "auto", mb: 2, width: 56, height: 56 }}>
              <TrendingUpIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
              {totalSubscriptions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Plans
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: "#F59E0B", mx: "auto", mb: 2, width: 56, height: 56 }}>
              <StarIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
              {activeSubscription?.name || "None"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Plan
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: "#EF4444", mx: "auto", mb: 2, width: 56, height: 56 }}>
              <CalendarIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
              {mockSubscriptionHistory.filter(sub => sub.status === "Expired").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expired Plans
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Active Plan Alert */}
      {activeSubscription && (
        <Alert 
          icon={<CheckCircleIcon />}
          severity="success" 
          sx={{ 
            borderRadius: 2,
            "& .MuiAlert-message": { width: "100%" }
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                You have an active {activeSubscription.name} plan
              </Typography>
              <Typography variant="body2">
                Purchased on {activeSubscription.date} • {activeSubscription.duration} duration
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              Manage Plan
            </Button>
          </Box>
        </Alert>
      )}

      {/* Subscription History Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ReceiptIcon sx={{ color: "#4F46E5" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1F2937" }}>
                Billing History
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderColor: "#4F46E5", color: "#4F46E5" }}
            >
              Export All
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                {["Plan Details", "Purchase Info", "Payment", "Status", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      px: 3,
                      py: 2,
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mockSubscriptionHistory.map((sub, index) => (
                <TableRow 
                  key={sub.id}
                  sx={{ 
                    "&:hover": { bgcolor: "#F8FAFC" },
                    borderBottom: index === mockSubscriptionHistory.length - 1 ? "none" : "1px solid #E2E8F0"
                  }}
                >
                  <TableCell sx={{ px: 3, py: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${getPlanColor(sub.name)}20`, 
                          color: getPlanColor(sub.name),
                          width: 40,
                          height: 40
                        }}
                      >
                        <StarIcon />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: "bold", color: "#1F2937" }}>
                          {sub.name} Plan
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                          {sub.duration} • Invoice #{sub.invoiceId}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                          {sub.features.slice(0, 2).map((feature, idx) => (
                            <Chip 
                              key={idx}
                              label={feature} 
                              size="small" 
                              sx={{ fontSize: 10, height: 20, bgcolor: "#F1F5F9", color: "#475569" }}
                            />
                          ))}
                          {sub.features.length > 2 && (
                            <Chip 
                              label={`+${sub.features.length - 2} more`} 
                              size="small" 
                              sx={{ fontSize: 10, height: 20, bgcolor: "#E0E7FF", color: "#4338CA" }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ px: 3, py: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                      <Typography sx={{ fontSize: 14, color: "#1F2937" }}>
                        {sub.date}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                      {sub.duration} subscription
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: 3, py: 3 }}>
                    <Box>
                      <Typography sx={{ fontSize: 16, fontWeight: "bold", color: "#1F2937", mb: 1 }}>
                        {sub.price}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CreditCardIcon sx={{ fontSize: 14, color: "#6B7280" }} />
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                          {sub.paymentMethod}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ px: 3, py: 3 }}>
                    <Chip
                      label={sub.status}
                      sx={{
                        ...getStatusColor(sub.status),
                        fontWeight: "medium",
                        fontSize: 12,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ px: 3, py: 3 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton 
                        sx={{ 
                          color: "#4F46E5", 
                          bgcolor: "#EEF2FF",
                          "&:hover": { bgcolor: "#E0E7FF" },
                          width: 36,
                          height: 36
                        }}
                        title="Download Invoice"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        sx={{ 
                          color: "#059669", 
                          bgcolor: "#ECFDF5",
                          "&:hover": { bgcolor: "#D1FAE5" },
                          width: 36,
                          height: 36
                        }}
                        title="View Details"
                      >
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Empty State or Additional Info */}
      {mockSubscriptionHistory.length === 0 && (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Avatar sx={{ bgcolor: "#F3F4F6", mx: "auto", mb: 3, width: 80, height: 80 }}>
            <HistoryIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
          </Avatar>
          <Typography variant="h6" sx={{ color: "#374151", mb: 1 }}>
            No Subscription History
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't purchased any subscription plans yet.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: "#4F46E5" }}>
            Browse Plans
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default SubscriptionHistory;