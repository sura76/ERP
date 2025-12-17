import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

const BudgetManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      costCode: 'LABOR-001',
      costDescription: 'Skilled Labor',
      approvedAmount: 850000,
      spentAmount: 650000,
      remaining: 200000,
      status: 'active'
    },
    {
      id: 2,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      costCode: 'MAT-001',
      costDescription: 'Concrete Materials',
      approvedAmount: 450000,
      spentAmount: 380000,
      remaining: 70000,
      status: 'active'
    },
    {
      id: 3,
      projectId: 2,
      projectName: 'Office Complex Development',
      costCode: 'EQP-001',
      costDescription: 'Excavation Equipment',
      approvedAmount: 120000,
      spentAmount: 120000,
      remaining: 0,
      status: 'completed'
    },
    {
      id: 4,
      projectId: 2,
      projectName: 'Office Complex Development',
      costCode: 'LABOR-002',
      costDescription: 'General Labor',
      approvedAmount: 950000,
      spentAmount: 750000,
      remaining: 200000,
      status: 'active'
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      costCode: 'MAT-001',
      description: 'Steel Reinforcement',
      amount: 45000,
      submittedBy: 'John Smith',
      submittedDate: '2023-06-15',
      status: 'pending',
      approvedBy: null
    },
    {
      id: 2,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      costCode: 'EQP-002',
      description: 'Crane Rental',
      amount: 12000,
      submittedBy: 'Mike Johnson',
      submittedDate: '2023-06-10',
      status: 'approved',
      approvedBy: 'Sarah Wilson'
    },
    {
      id: 3,
      projectId: 2,
      projectName: 'Office Complex Development',
      costCode: 'LABOR-002',
      description: 'Overtime Pay',
      amount: 8500,
      submittedBy: 'David Brown',
      submittedDate: '2023-06-12',
      status: 'rejected',
      approvedBy: 'Sarah Wilson'
    }
  ]);

  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentExpense, setCurrentExpense] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleApproveExpense = (expenseId) => {
    setExpenses(expenses.map(exp => 
      exp.id === expenseId ? { ...exp, status: 'approved', approvedBy: 'Current User' } : exp
    ));
  };

  const handleRejectExpense = (expenseId) => {
    setExpenses(expenses.map(exp => 
      exp.id === expenseId ? { ...exp, status: 'rejected', approvedBy: 'Current User' } : exp
    ));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Finance Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Budget Management" />
          <Tab label="Expense Tracking" />
          <Tab label="Payment Processing" />
        </Tabs>
      </Box>

      {/* Budget Management Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Project Budgets</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenBudgetDialog(true)}>
              New Budget
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Cost Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Approved Amount</TableCell>
                  <TableCell>Spent Amount</TableCell>
                  <TableCell>Remaining</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.projectName}</TableCell>
                    <TableCell><Chip label={budget.costCode} size="small" /></TableCell>
                    <TableCell>{budget.costDescription}</TableCell>
                    <TableCell>${budget.approvedAmount.toLocaleString()}</TableCell>
                    <TableCell>${budget.spentAmount.toLocaleString()}</TableCell>
                    <TableCell>${budget.remaining.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                        color={getStatusColor(budget.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Expense Tracking Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Expense Submissions</Typography>
            <Button variant="contained" startIcon={<ReceiptIcon />} onClick={() => setOpenExpenseDialog(true)}>
              Submit Expense
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.projectName}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.submittedBy}</TableCell>
                    <TableCell>{expense.submittedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        color={getStatusColor(expense.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {expense.status === 'pending' && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveExpense(expense.id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => handleRejectExpense(expense.id)}
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

      {/* Payment Processing Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Payment Processing</Typography>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Payment processing module coming soon...</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This module handles vendor payments, invoice processing, and payment approvals.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Budget Creation/Edit Dialog */}
      <Dialog open={openBudgetDialog} onClose={() => setOpenBudgetDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentBudget ? 'Edit Budget' : 'Create New Budget'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              margin="dense"
              label="Project"
              fullWidth
              variant="outlined"
              defaultValue={currentBudget?.projectId || ''}
            >
              <MenuItem value={1}>Highway Construction Phase 1</MenuItem>
              <MenuItem value={2}>Office Complex Development</MenuItem>
              <MenuItem value={3}>Bridge Rehabilitation</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Cost Code"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentBudget?.costCode || ''}
            />
            <TextField
              margin="dense"
              label="Cost Description"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentBudget?.costDescription || ''}
            />
            <TextField
              margin="dense"
              label="Approved Amount"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentBudget?.approvedAmount || ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudgetDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenBudgetDialog(false)}>
            {currentBudget ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expense Submission Dialog */}
      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Expense</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
              select
              margin="dense"
              label="Cost Code"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="LABOR-001">Skilled Labor</MenuItem>
              <MenuItem value="MAT-001">Materials</MenuItem>
              <MenuItem value="EQP-001">Equipment</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Receipt Number"
              type="text"
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenExpenseDialog(false)}>
            Submit Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetManagement;