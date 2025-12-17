import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const ProjectList = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectCode: 'PROJ-001',
      name: 'Highway Construction Phase 1',
      location: 'Downtown District',
      startDate: '2023-01-15',
      endDate: '2024-06-30',
      budget: 2500000,
      status: 'active',
      progress: 75,
      manager: 'John Smith'
    },
    {
      id: 2,
      projectCode: 'PROJ-002',
      name: 'Office Complex Development',
      location: 'Business Park',
      startDate: '2023-03-01',
      endDate: '2024-09-15',
      budget: 4200000,
      status: 'active',
      progress: 42,
      manager: 'Sarah Johnson'
    },
    {
      id: 3,
      projectCode: 'PROJ-003',
      name: 'Bridge Rehabilitation',
      location: 'Riverside Area',
      startDate: '2023-02-10',
      endDate: '2024-05-20',
      budget: 1800000,
      status: 'delayed',
      progress: 30,
      manager: 'Michael Brown'
    },
    {
      id: 4,
      projectCode: 'PROJ-004',
      name: 'Water Treatment Plant',
      location: 'Industrial Zone',
      startDate: '2023-04-05',
      endDate: '2024-11-30',
      budget: 3500000,
      status: 'planning',
      progress: 10,
      manager: 'Emily Davis'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.projectCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'completed': return 'info';
      case 'on hold': return 'secondary';
      case 'cancelled': return 'error';
      case 'planning': return 'primary';
      default: return 'default';
    }
  };

  const handleViewProject = (project) => {
    console.log('View project:', project);
    // Navigate to project detail page
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProject(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          New Project
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="Status Filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="planning">Planning</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="delayed">Delayed</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="on hold">On Hold</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
        
        <TextField
          label="Search Projects"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Code</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Timeline</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell><strong>{project.projectCode}</strong></TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.manager}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color={getStatusColor(project.status)}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Button>
                </TableCell>
                <TableCell>${project.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <div style={{ 
                        width: `${project.progress}%`, 
                        height: 10, 
                        backgroundColor: project.progress >= 75 ? '#4caf50' : project.progress >= 50 ? '#ff9800' : '#f44336',
                        borderRadius: 5
                      }} />
                    </Box>
                    <span>{project.progress}%</span>
                  </Box>
                </TableCell>
                <TableCell>
                  {project.startDate} to {project.endDate}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleViewProject(project)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditProject(project)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Project Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Project Code"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProject?.projectCode || ''}
            />
            <TextField
              margin="dense"
              label="Project Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProject?.name || ''}
            />
            <TextField
              margin="dense"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProject?.location || ''}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="dense"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue={currentProject?.startDate || ''}
              />
              <TextField
                margin="dense"
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue={currentProject?.endDate || ''}
              />
            </Box>
            <TextField
              margin="dense"
              label="Budget"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentProject?.budget || ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={currentProject?.status || 'planning'}
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on hold">On Hold</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {currentProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList;