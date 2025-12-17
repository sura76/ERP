import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  Tabs, Tab, Chip, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, ExpandMore as ExpandMoreIcon, SafetyCheck as SafetyCheckIcon, Report as ReportIcon } from '@mui/icons-material';

const SafetyReports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      reportedBy: 'Safety Officer John',
      date: '2023-06-15',
      safeToStart: true,
      remarks: 'All equipment checked and certified',
      status: 'closed'
    },
    {
      id: 2,
      projectId: 2,
      projectName: 'Office Complex Development',
      reportedBy: 'Safety Officer Mary',
      date: '2023-06-15',
      safeToStart: false,
      remarks: 'Scaffolding needs inspection',
      status: 'open'
    },
    {
      id: 3,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      reportedBy: 'Safety Officer John',
      date: '2023-06-14',
      safeToStart: true,
      remarks: 'Weather conditions good',
      status: 'closed'
    }
  ]);

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      type: 'near-miss',
      description: 'Worker almost hit by falling object',
      severity: 'medium',
      reportedAt: '2023-06-10',
      status: 'investigating',
      findings: 'Improper storage of materials at height'
    },
    {
      id: 2,
      projectId: 2,
      projectName: 'Office Complex Development',
      type: 'injury',
      description: 'Minor cut on hand during equipment operation',
      severity: 'low',
      reportedAt: '2023-06-08',
      status: 'closed',
      findings: 'Lack of proper PPE'
    },
    {
      id: 3,
      projectId: 3,
      projectName: 'Bridge Rehabilitation',
      type: 'hazard',
      description: 'Unstable structure detected',
      severity: 'high',
      reportedAt: '2023-06-05',
      status: 'open',
      findings: 'Immediate evacuation required'
    }
  ]);

  const [audits, setAudits] = useState([
    {
      id: 1,
      projectId: 1,
      projectName: 'Highway Construction Phase 1',
      auditor: 'EHS Manager',
      date: '2023-06-12',
      score: 85,
      findings: ['PPE compliance: 95%', 'Equipment maintenance: 80%', 'Training records: 90%']
    },
    {
      id: 2,
      projectId: 2,
      projectName: 'Office Complex Development',
      auditor: 'EHS Manager',
      date: '2023-06-10',
      score: 78,
      findings: ['PPE compliance: 85%', 'Equipment maintenance: 75%', 'Training records: 82%']
    }
  ]);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openIncidentDialog, setOpenIncidentDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [currentIncident, setCurrentIncident] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'warning';
      case 'closed': return 'success';
      case 'investigating': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const handleSafeToStart = (reportId, safeToStart) => {
    setReports(reports.map(rep => 
      rep.id === reportId ? { ...rep, safeToStart, status: safeToStart ? 'closed' : 'open' } : rep
    ));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>EHS Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Safety Reports" />
          <Tab label="Incident Reports" />
          <Tab label="Safety Audits" />
        </Tabs>
      </Box>

      {/* Safety Reports Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Daily Safety Reports</Typography>
            <Button variant="contained" startIcon={<SafetyCheckIcon />} onClick={() => setOpenReportDialog(true)}>
              New Report
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Safe to Start</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.projectName}</TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.safeToStart ? 'YES' : 'NO'} 
                        color={report.safeToStart ? 'success' : 'error'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{report.remarks}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!report.safeToStart && (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleSafeToStart(report.id, true)}
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
        </Box>
      )}

      {/* Incident Reports Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Incident Reports</Typography>
            <Button variant="contained" startIcon={<ReportIcon />} onClick={() => setOpenIncidentDialog(true)}>
              Report Incident
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Reported Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.projectName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        color={getSeverityColor(incident.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{incident.reportedAt}</TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        color={getStatusColor(incident.status)}
                        size="small"
                      />
                    </TableCell>
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

          {/* Incident Details Accordion */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Incident Details</Typography>
            {incidents.map((incident) => (
              <Accordion key={incident.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{incident.projectName} - {incident.description}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Findings:</strong> {incident.findings}</Typography>
                  <Typography sx={{ mt: 1 }}><strong>Severity:</strong> {incident.severity.toUpperCase()}</Typography>
                  <Typography><strong>Status:</strong> {incident.status.toUpperCase()}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}

      {/* Safety Audits Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Safety Audits</Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Auditor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Findings</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>{audit.projectName}</TableCell>
                    <TableCell>{audit.auditor}</TableCell>
                    <TableCell>{audit.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${audit.score}/100`} 
                        color={audit.score >= 80 ? 'success' : audit.score >= 60 ? 'warning' : 'error'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <List dense>
                        {audit.findings.map((finding, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={finding} />
                          </ListItem>
                        ))}
                      </List>
                    </TableCell>
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

      {/* Safety Report Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Daily Safety Report</DialogTitle>
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Safe to Start?</InputLabel>
              <Select defaultValue={true}>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Remarks"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenReportDialog(false)}>
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Incident Report Dialog */}
      <Dialog open={openIncidentDialog} onClose={() => setOpenIncidentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report New Incident</DialogTitle>
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
              label="Incident Type"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="near-miss">Near Miss</MenuItem>
              <MenuItem value="injury">Injury</MenuItem>
              <MenuItem value="hazard">Hazard</MenuItem>
              <MenuItem value="accident">Accident</MenuItem>
            </TextField>
            <TextField
              select
              margin="dense"
              label="Severity"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIncidentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenIncidentDialog(false)}>
            Report Incident
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SafetyReports;