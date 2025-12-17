import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip, Avatar, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Clear as ClearIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

const MaterialRequests = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [requests, setRequests] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      requestedBy: 'Mike Johnson',
      requestedDate: '2023-06-15',
      status: 'pending',
      items: [
        { material: 'Steel Reinforcement Bars', quantity: 500, unit: 'pieces' },
        { material: 'Cement Bags', quantity: 100, unit: 'bags' }
      ]
    },
    {
      id: 2,
      projectId: 2,
      projectName: 'Office Complex Development',
      requestedBy: 'David Brown',
      requestedDate: '2023-06-14',
      status: 'approved',
      items: [
        { material: 'Concrete Blocks', quantity: 2000, unit: 'pieces' },
        { material: 'Sand', quantity: 50, unit: 'tons' }
      ]
    },
    {
      id: 3,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      requestedBy: 'Sarah Wilson',
      requestedDate: '2023-06-12',
      status: 'rejected',
      items: [
        { material: 'Asphalt', quantity: 100, unit: 'tons' }
      ]
    },
    {
      id: 4,
      projectId: 3,
      projectName: 'Bridge Rehabilitation',
      requestedBy: 'Robert Davis',
      requestedDate: '2023-06-10',
      status: 'pending',
      items: [
        { material: 'Paint', quantity: 50, unit: 'gallons' },
        { material: 'Safety Nets', quantity: 20, unit: 'pieces' },
        { material: 'Steel Plates', quantity: 15, unit: 'pieces' }
      ]
    }
  ]);

  const [vendors, setVendors] = useState([
    { id: 1, name: 'ABC Construction Materials', contact: 'John Doe', phone: '(555) 123-4567', email: 'john@abc.com', taxNumber: 'TAX-12345' },
    { id: 2, name: 'XYZ Steel Suppliers', contact: 'Jane Smith', phone: '(555) 987-6543', email: 'jane@xyz.com', taxNumber: 'TAX-67890' },
    { id: 3, name: 'Global Cement Co.', contact: 'Mike Johnson', phone: '(555) 456-7890', email: 'mike@globalcement.com', taxNumber: 'TAX-11111' }
  ]);

  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openVendorDialog, setOpenVendorDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [currentVendor, setCurrentVendor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'delivered': return 'info';
      default: return 'default';
    }
  };

  const handleApproveRequest = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
  };

  const handleRejectRequest = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleAddItem = () => {
    // Logic to add an item to the request
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Procurement Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Material Requests" />
          <Tab label="Purchase Orders" />
          <Tab label="Vendor Management" />
        </Tabs>
      </Box>

      {/* Material Requests Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Material Requests</Typography>
            <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => setOpenRequestDialog(true)}>
              New Request
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell><Chip label={`REQ-${request.id}`} size="small" /></TableCell>
                    <TableCell>{request.projectName}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      {request.items.map((item, index) => (
                        <div key={index}>{item.material}: {item.quantity} {item.unit}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveRequest(request.id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => handleRejectRequest(request.id)}
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

      {/* Purchase Orders Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Purchase Orders</Typography>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Purchase Order management module coming soon...</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This module handles purchase orders, vendor selection, and order tracking.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Vendor Management Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Vendor Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenVendorDialog(true)}>
              Add Vendor
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Tax Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell><strong>{vendor.name}</strong></TableCell>
                    <TableCell>{vendor.contact}</TableCell>
                    <TableCell>
                      <div>{vendor.phone}</div>
                      <div>{vendor.email}</div>
                    </TableCell>
                    <TableCell>{vendor.taxNumber}</TableCell>
                    <TableCell align="right">
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

      {/* Material Request Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Material Request</DialogTitle>
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
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Request Items:</Typography>
            <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  select
                  margin="dense"
                  label="Material"
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="steel">Steel Reinforcement Bars</MenuItem>
                  <MenuItem value="cement">Cement Bags</MenuItem>
                  <MenuItem value="concrete">Concrete Blocks</MenuItem>
                  <MenuItem value="sand">Sand</MenuItem>
                </TextField>
                <TextField
                  margin="dense"
                  label="Quantity"
                  type="number"
                  size="small"
                  sx={{ width: 100 }}
                />
                <TextField
                  margin="dense"
                  label="Unit"
                  size="small"
                  sx={{ width: 100 }}
                />
              </Box>
              <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem}>
                Add Item
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenRequestDialog(false)}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vendor Management Dialog */}
      <Dialog open={openVendorDialog} onClose={() => setOpenVendorDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Vendor Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Contact Person"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Phone"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Tax Number"
              type="text"
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVendorDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenVendorDialog(false)}>
            Add Vendor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialRequests;