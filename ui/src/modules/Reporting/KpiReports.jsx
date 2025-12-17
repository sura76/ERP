import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip, Grid, Card, CardContent, CardHeader,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from '@mui/material';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Timeline as TimelineIcon, Assessment as AssessmentIcon, Print as PrintIcon, PictureAsPdf as PdfIcon, PictureInPictureAlt as ExcelIcon } from '@mui/icons-material';

const KpiReports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Project Progress Report',
      type: 'progress',
      generatedBy: 'System',
      generatedDate: '2023-06-15',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Financial Summary Report',
      type: 'finance',
      generatedBy: 'System',
      generatedDate: '2023-06-15',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Safety Performance Report',
      type: 'safety',
      generatedBy: 'System',
      generatedDate: '2023-06-14',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Resource Utilization Report',
      type: 'resource',
      generatedBy: 'System',
      generatedDate: '2023-06-13',
      status: 'completed'
    }
  ]);

  const [kpis, setKpis] = useState([
    { id: 1, name: 'Project Completion Rate', category: 'Progress', currentValue: 72, targetValue: 75, unit: '%' },
    { id: 2, name: 'Budget Utilization', category: 'Finance', currentValue: 68, targetValue: 70, unit: '%' },
    { id: 3, name: 'Safety Incidents', category: 'Safety', currentValue: 3, targetValue: 0, unit: 'incidents' },
    { id: 4, name: 'Resource Efficiency', category: 'Operations', currentValue: 85, targetValue: 90, unit: '%' },
    { id: 5, name: 'On-time Delivery', category: 'Operations', currentValue: 92, targetValue: 95, unit: '%' }
  ]);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // Sample chart data
  const projectProgressData = [
    { name: 'Project A', planned: 80, actual: 75 },
    { name: 'Project B', planned: 60, actual: 65 },
    { name: 'Project C', planned: 90, actual: 70 },
    { name: 'Project D', planned: 45, actual: 50 },
  ];

  const budgetData = [
    { name: 'Jan', budget: 400000, spent: 240000 },
    { name: 'Feb', budget: 300000, spent: 139800 },
    { name: 'Mar', budget: 200000, spent: 180000 },
    { name: 'Apr', budget: 278000, spent: 200000 },
    { name: 'May', budget: 189000, spent: 218100 },
    { name: 'Jun', budget: 239000, spent: 250000 },
  ];

  const safetyData = [
    { name: 'Jan', incidents: 3 },
    { name: 'Feb', incidents: 2 },
    { name: 'Mar', incidents: 1 },
    { name: 'Apr', incidents: 0 },
    { name: 'May', incidents: 1 },
    { name: 'Jun', incidents: 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Reporting & Dashboards</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="KPI Dashboard" />
          <Tab label="Report Builder" />
          <Tab label="Generated Reports" />
        </Tabs>
      </Box>

      {/* KPI Dashboard Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Key Performance Indicators</Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {kpis.map((kpi) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={kpi.id}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">{kpi.category}</Typography>
                    <Typography variant="h6">{kpi.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {kpi.currentValue}{kpi.unit}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1, 
                          color: kpi.currentValue <= kpi.targetValue ? 'success.main' : 'error.main' 
                        }}
                      >
                        {kpi.currentValue <= kpi.targetValue ? '✓' : '✗'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Target: {kpi.targetValue}{kpi.unit}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>Project Progress vs Planned</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <RechartsBarChart data={projectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="planned" fill="#8884d8" name="Planned %" />
                    <Bar dataKey="actual" fill="#82ca9d" name="Actual %" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>Budget Utilization</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Spent', value: 68 },
                        { name: 'Remaining', value: 32 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell key="spent" fill="#ff4444" />
                      <Cell key="remaining" fill="#44ff44" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>Monthly Budget vs Actual</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget" />
                    <Line type="monotone" dataKey="spent" stroke="#82ca9d" name="Spent" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>Safety Incidents Trend</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={safetyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="incidents" stroke="#ff4444" fill="#ff8888" name="Incidents" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Report Builder Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Report Builder</Typography>
          
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Report Type"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <MenuItem value="progress">Project Progress</MenuItem>
                  <MenuItem value="finance">Financial Summary</MenuItem>
                  <MenuItem value="safety">Safety Performance</MenuItem>
                  <MenuItem value="resource">Resource Utilization</MenuItem>
                  <MenuItem value="compliance">Compliance Report</MenuItem>
                </TextField>
                
                <TextField
                  select
                  label="Project"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <MenuItem value="all">All Projects</MenuItem>
                  <MenuItem value={1}>Highway Construction Phase 1</MenuItem>
                  <MenuItem value={2}>Office Complex Development</MenuItem>
                  <MenuItem value={3}>Bridge Rehabilitation</MenuItem>
                </TextField>
                
                <TextField
                  label="Date Range"
                  type="text"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="Select date range"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Selected Metrics:</Typography>
                <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, minHeight: 150 }}>
                  <Typography variant="body2" color="textSecondary">Select metrics to include in the report</Typography>
                </Box>
                <Button variant="outlined" sx={{ mt: 2 }}>Add Metric</Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button variant="contained" startIcon={<AssessmentIcon />} sx={{ mr: 2 }}>
                Generate Report
              </Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>
                Preview
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Generated Reports Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Generated Reports</Typography>
            <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setOpenReportDialog(true)}>
              New Report
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Generated By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small">
                        <PdfIcon />
                      </IconButton>
                      <IconButton color="primary" size="small">
                        <ExcelIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Report Generation Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              margin="dense"
              label="Report Type"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="progress">Project Progress Report</MenuItem>
              <MenuItem value="finance">Financial Summary Report</MenuItem>
              <MenuItem value="safety">Safety Performance Report</MenuItem>
              <MenuItem value="resource">Resource Utilization Report</MenuItem>
              <MenuItem value="compliance">Compliance Report</MenuItem>
            </TextField>
            <TextField
              select
              margin="dense"
              label="Project"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="all">All Projects</MenuItem>
              <MenuItem value={1}>Highway Construction Phase 1</MenuItem>
              <MenuItem value={2}>Office Complex Development</MenuItem>
              <MenuItem value={3}>Bridge Rehabilitation</MenuItem>
            </TextField>
            <TextField
              label="Report Name"
              type="text"
              fullWidth
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Date Range"
              type="text"
              fullWidth
              variant="outlined"
              margin="dense"
              placeholder="Select date range"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setOpenReportDialog(false)}>
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KpiReports;