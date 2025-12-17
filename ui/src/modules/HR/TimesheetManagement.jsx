import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip, Accordion, AccordionSummary, AccordionDetails, Grid
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, ExpandMore as ExpandMoreIcon, AccessTime as AccessTimeIcon, Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';

const TimesheetManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timesheets, setTimesheets] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Smith',
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      date: '2023-06-15',
      hoursWorked: 8,
      task: 'Excavation work',
      status: 'pending',
      approvedBy: null
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Sarah Johnson',
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      date: '2023-06-15',
      hoursWorked: 8,
      task: 'Concrete pouring',
      status: 'approved',
      approvedBy: 'Project Manager'
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Mike Brown',
      projectId: 2,
      projectName: 'Office Complex Development',
      date: '2023-06-15',
      hoursWorked: 6,
      task: 'Electrical installation',
      status: 'rejected',
      approvedBy: 'Supervisor'
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: 'Emily Davis',
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      date: '2023-06-14',
      hoursWorked: 8,
      task: 'Safety inspection',
      status: 'approved',
      approvedBy: 'Safety Officer'
    }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Smith', position: 'Excavation Operator', department: 'Operations', hireDate: '2022-03-15' },
    { id: 2, name: 'Sarah Johnson', position: 'Concrete Technician', department: 'Construction', hireDate: '2021-08-20' },
    { id: 3, name: 'Mike Brown', position: 'Electrician', department: 'Electrical', hireDate: '2020-11-10' },
    { id: 4, name: 'Emily Davis', position: 'Safety Officer', department: 'EHS', hireDate: '2022-01-05' },
    { id: 5, name: 'Robert Wilson', position: 'Project Engineer', department: 'Engineering', hireDate: '2019-06-12' }
  ]);

  const [openTimesheetDialog, setOpenTimesheetDialog] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [currentTimesheet, setCurrentTimesheet] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleApproveTimesheet = (timesheetId) => {
    setTimesheets(timesheets.map(ts => 
      ts.id === timesheetId ? { ...ts, status: 'approved', approvedBy: 'Current User' } : ts
    ));
  };

  const handleRejectTimesheet = (timesheetId) => {
    setTimesheets(timesheets.map(ts => 
      ts.id === timesheetId ? { ...ts, status: 'rejected', approvedBy: 'Current User' } : ts
    ));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>HR Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Timesheet Management" />
          <Tab label="Employee Records" />
          <Tab label="Leave Management" />
        </Tabs>
      </Box>

      {/* Timesheet Management Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Timesheet Management</Typography>
            <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => setOpenTimesheetDialog(true)}>
              Submit Timesheet
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>{timesheet.employeeName}</TableCell>
                    <TableCell>{timesheet.projectName}</TableCell>
                    <TableCell>{timesheet.date}</TableCell>
                    <TableCell>{timesheet.hoursWorked} hours</TableCell>
                    <TableCell>{timesheet.task}</TableCell>
                    <TableCell>
                      <Chip 
                        label={timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                        color={getStatusColor(timesheet.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{timesheet.approvedBy || '-'}</TableCell>
                    <TableCell align="right">
                      {timesheet.status === 'pending' && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveTimesheet(timesheet.id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => handleRejectTimesheet(timesheet.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Employee Records Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Employee Records</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenEmployeeDialog(true)}>
              Add Employee
            </Button>
          </Box>

          <Grid container spacing={3}>
            {employees.map((employee) => (
              <Grid item xs={12} sm={6} md={4} key={employee.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6">{employee.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{employee.position}</Typography>
                  <Typography variant="body2" color="textSecondary">{employee.department}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Hire Date: {employee.hireDate}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Leave Management Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Leave Management</Typography>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Leave management module coming soon...</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This module handles employee leave requests, approvals, and tracking.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Timesheet Submission Dialog */}
      <Dialog open={openTimesheetDialog} onClose={() => setOpenTimesheetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Timesheet</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              margin="dense"
              label="Employee"
              fullWidth
              variant="outlined"
            >
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Project"
              fullWidth
              variant="outlined"
            >
              <MenuItem value={1}>Highway Construction Phase 1</MenuItem>
              <MenuItem value={2}>Office Complex Development</MenuItem>
              <MenuItem value={3}>Bridge Rehabilitation</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Hours Worked"
              type="number"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Task Performed"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimesheetDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenTimesheetDialog(false)}>
            Submit Timesheet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Management Dialog */}
      <Dialog open={openEmployeeDialog} onClose={() => setOpenEmployeeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Position"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              select
              margin="dense"
              label="Department"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="operations">Operations</MenuItem>
              <MenuItem value="construction">Construction</MenuItem>
              <MenuItem value="electrical">Electrical</MenuItem>
              <MenuItem value="plumbing">Plumbing</MenuItem>
              <MenuItem value="engineering">Engineering</MenuItem>
              <MenuItem value="ehs">EHS</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Hire Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Salary"
              type="number"
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmployeeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenEmployeeDialog(false)}>
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimesheetManagement;