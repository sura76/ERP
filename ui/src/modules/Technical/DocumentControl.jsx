import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText,
  TreeView, TreeItem, Collapse, ListItemIcon
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  ExpandMore as ExpandMoreIcon, 
  ChevronRight as ChevronRightIcon,
  InsertDriveFile as FileIcon,
  Folder as FolderIcon,
  Upload as UploadIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const DocumentControl = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      type: 'drawing',
      name: 'Foundation Plan v2.1',
      version: '2.1',
      filePath: '/documents/foundation_plan_v2.1.pdf',
      uploadedBy: 'Technical Manager',
      uploadedDate: '2023-06-10',
      status: 'approved',
      revisionHistory: [
        { version: '1.0', date: '2023-05-15', user: 'Designer', notes: 'Initial draft' },
        { version: '2.0', date: '2023-05-25', user: 'Reviewer', notes: 'Updated based on feedback' },
        { version: '2.1', date: '2023-06-10', user: 'Technical Manager', notes: 'Final approval' }
      ]
    },
    {
      id: 2,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      type: 'boq',
      name: 'Bill of Quantities v1.3',
      version: '1.3',
      filePath: '/documents/boq_v1.3.xlsx',
      uploadedBy: 'Quantity Surveyor',
      uploadedDate: '2023-06-05',
      status: 'pending',
      revisionHistory: [
        { version: '1.0', date: '2023-05-20', user: 'QS', notes: 'Initial BOQ' },
        { version: '1.1', date: '2023-05-22', user: 'QS', notes: 'Updated quantities' },
        { version: '1.2', date: '2023-05-28', user: 'QS', notes: 'Cost adjustments' },
        { version: '1.3', date: '2023-06-05', user: 'QS', notes: 'Final review pending' }
      ]
    },
    {
      id: 3,
      projectId: 2,
      projectName: 'Office Complex Development',
      type: 'report',
      name: 'Site Survey Report v1.0',
      version: '1.0',
      filePath: '/documents/survey_report_v1.0.pdf',
      uploadedBy: 'Surveyor',
      uploadedDate: '2023-06-01',
      status: 'approved',
      revisionHistory: [
        { version: '1.0', date: '2023-06-01', user: 'Surveyor', notes: 'Completed survey' }
      ]
    }
  ]);

  const [changeRequests, setChangeRequests] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      description: 'Change in foundation depth due to soil conditions',
      requestedBy: 'Site Engineer',
      requestedDate: '2023-06-12',
      status: 'under_review',
      impactCost: 45000,
      impactSchedule: '2 weeks',
      approvalHistory: [
        { date: '2023-06-12', user: 'Site Engineer', action: 'Submitted' },
        { date: '2023-06-13', user: 'Project Manager', action: 'Reviewed' }
      ]
    },
    {
      id: 2,
      projectId: 2,
      projectName: 'Office Complex Development',
      description: 'Change in electrical fixtures specification',
      requestedBy: 'Electrical Engineer',
      requestedDate: '2023-06-08',
      status: 'approved',
      impactCost: 12000,
      impactSchedule: '1 week',
      approvalHistory: [
        { date: '2023-06-08', user: 'Electrical Engineer', action: 'Submitted' },
        { date: '2023-06-09', user: 'Project Manager', action: 'Reviewed' },
        { date: '2023-06-10', user: 'Technical Manager', action: 'Approved' }
      ]
    }
  ]);

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openChangeRequestDialog, setOpenChangeRequestDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentChangeRequest, setCurrentChangeRequest] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'warning';
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under_review': return 'info';
      default: return 'default';
    }
  };

  const handleApproveDocument = (docId) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, status: 'approved' } : doc
    ));
  };

  const handleApproveChangeRequest = (reqId) => {
    setChangeRequests(changeRequests.map(req => 
      req.id === reqId ? { ...req, status: 'approved' } : req
    ));
  };

  const handleRejectChangeRequest = (reqId) => {
    setChangeRequests(changeRequests.map(req => 
      req.id === reqId ? { ...req, status: 'rejected' } : req
    ));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Technical & Document Control</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Document Library" />
          <Tab label="Change Requests" />
          <Tab label="Drawings & BOQs" />
        </Tabs>
      </Box>

      {/* Document Library Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Document Library</Typography>
            <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setOpenDocumentDialog(true)}>
              Upload Document
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Uploaded By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>{document.projectName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={document.type.toUpperCase()} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{document.name}</TableCell>
                    <TableCell>v{document.version}</TableCell>
                    <TableCell>{document.uploadedBy}</TableCell>
                    <TableCell>{document.uploadedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        color={getStatusColor(document.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {document.status === 'pending' && (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleApproveDocument(document.id)}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
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

          {/* Document Details Accordion */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Document Details</Typography>
            {documents.map((document) => (
              <Accordion key={document.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{document.name} (v{document.version})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Project:</strong> {document.projectName}</Typography>
                  <Typography><strong>Type:</strong> {document.type.toUpperCase()}</Typography>
                  <Typography><strong>Uploaded:</strong> {document.uploadedDate} by {document.uploadedBy}</Typography>
                  <Typography><strong>Status:</strong> {document.status.toUpperCase()}</Typography>
                  
                  <Typography variant="h7" sx={{ mt: 2, mb: 1 }}>Revision History:</Typography>
                  <List dense>
                    {document.revisionHistory.map((rev, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={`v${rev.version} - ${rev.date} - ${rev.user}`}
                          secondary={rev.notes}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}

      {/* Change Requests Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Change Requests</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenChangeRequestDialog(true)}>
              New Change Request
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Cost Impact</TableCell>
                  <TableCell>Schedule Impact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {changeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.projectName}</TableCell>
                    <TableCell>{request.description}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestedDate}</TableCell>
                    <TableCell>${request.impactCost.toLocaleString()}</TableCell>
                    <TableCell>{request.impactSchedule}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {request.status === 'under_review' && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveChangeRequest(request.id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => handleRejectChangeRequest(request.id)}
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

      {/* Drawings & BOQs Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Drawings & BOQs Management</Typography>
          
          {/* Document Tree View */}
          <Paper sx={{ p: 2 }}>
            <TreeView
              aria-label="document tree"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Highway Construction Phase 1">
                <TreeItem nodeId="2" label="Drawings">
                  <TreeItem nodeId="3" label="Foundation Plans" />
                  <TreeItem nodeId="4" label="Structural Details" />
                  <TreeItem nodeId="5" label="Electrical Layout" />
                </TreeItem>
                <TreeItem nodeId="6" label="BOQs">
                  <TreeItem nodeId="7" label="Excavation BOQ" />
                  <TreeItem nodeId="8" label="Concrete BOQ" />
                  <TreeItem nodeId="9" label="Electrical BOQ" />
                </TreeItem>
                <TreeItem nodeId="10" label="Reports">
                  <TreeItem nodeId="11" label="Site Survey" />
                  <TreeItem nodeId="12" label="Soil Test Report" />
                </TreeItem>
              </TreeItem>
              <TreeItem nodeId="13" label="Office Complex Development">
                <TreeItem nodeId="14" label="Drawings">
                  <TreeItem nodeId="15" label="Architectural Plans" />
                  <TreeItem nodeId="16" label="MEP Drawings" />
                </TreeItem>
                <TreeItem nodeId="17" label="BOQs">
                  <TreeItem nodeId="18" label="Interior BOQ" />
                  <TreeItem nodeId="19" label="Exterior BOQ" />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </Paper>
        </Box>
      )}

      {/* Document Upload Dialog */}
      <Dialog open={openDocumentDialog} onClose={() => setOpenDocumentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Document</DialogTitle>
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
              label="Document Type"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="drawing">Drawing</MenuItem>
              <MenuItem value="boq">BOQ</MenuItem>
              <MenuItem value="report">Report</MenuItem>
              <MenuItem value="specification">Specification</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Document Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Version"
              type="text"
              fullWidth
              variant="outlined"
              placeholder="e.g., 1.0"
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload File
              <input type="file" hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocumentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDocumentDialog(false)}>
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Request Dialog */}
      <Dialog open={openChangeRequestDialog} onClose={() => setOpenChangeRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Change Request</DialogTitle>
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
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="dense"
                label="Cost Impact ($)"
                type="number"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Schedule Impact"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="e.g., 2 weeks"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeRequestDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenChangeRequestDialog(false)}>
            Submit Change Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentControl;