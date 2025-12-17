import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { Card, CardContent, CardHeader } from '@mui/material';
import { PieChart, BarChart, Timeline, DonutLarge } from '@mui/icons-material';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ userRole }) => {
  // Mock data for different dashboards
  const getDashboardData = (role) => {
    switch(role) {
      case 'gm':
        return {
          title: 'General Manager Dashboard',
          kpis: [
            { name: 'Active Projects', value: 12, change: '+2' },
            { name: 'Total Budget', value: '$4.2M', change: '+5%' },
            { name: 'Safety Incidents', value: 3, change: '-2' },
            { name: 'Pending Approvals', value: 7, change: '0' }
          ],
          chartData: [
            { name: 'Project A', budget: 400000, spent: 320000 },
            { name: 'Project B', budget: 300000, spent: 280000 },
            { name: 'Project C', budget: 500000, spent: 410000 },
            { name: 'Project D', budget: 250000, spent: 180000 },
          ],
          pieData: [
            { name: 'Completed', value: 45 },
            { name: 'In Progress', value: 35 },
            { name: 'Delayed', value: 15 },
            { name: 'On Hold', value: 5 }
          ]
        };
      case 'finance_manager':
        return {
          title: 'Finance Dashboard',
          kpis: [
            { name: 'Cash Flow', value: '$1.2M', change: '+$0.3M' },
            { name: 'Outstanding Invoices', value: '$850K', change: '+$50K' },
            { name: 'Budget Variance', value: '-2.3%', change: '-0.5%' },
            { name: 'Pending Approvals', value: 12, change: '0' }
          ],
          chartData: [
            { name: 'Jan', income: 400000, expenses: 240000 },
            { name: 'Feb', income: 300000, expenses: 139800 },
            { name: 'Mar', income: 200000, expenses: 180000 },
            { name: 'Apr', income: 278000, expenses: 200000 },
            { name: 'May', income: 189000, expenses: 218100 },
            { name: 'Jun', income: 239000, expenses: 250000 },
          ],
          pieData: [
            { name: 'Materials', value: 45 },
            { name: 'Labor', value: 30 },
            { name: 'Equipment', value: 15 },
            { name: 'Other', value: 10 }
          ]
        };
      case 'project_manager':
        return {
          title: 'Project Manager Dashboard',
          kpis: [
            { name: 'My Projects', value: 3, change: '0' },
            { name: 'Avg. Progress', value: '68%', change: '+5%' },
            { name: 'Tasks Today', value: 12, change: '+3' },
            { name: 'Pending Approvals', value: 4, change: '0' }
          ],
          chartData: [
            { name: 'Planning', tasks: 12, completed: 10 },
            { name: 'Execution', tasks: 25, completed: 18 },
            { name: 'Quality', tasks: 8, completed: 6 },
            { name: 'Closeout', tasks: 5, completed: 2 },
          ],
          pieData: [
            { name: 'On Track', value: 60 },
            { name: 'At Risk', value: 25 },
            { name: 'Delayed', value: 15 }
          ]
        };
      case 'ehs_manager':
        return {
          title: 'EHS Manager Dashboard',
          kpis: [
            { name: 'Safety Score', value: '94%', change: '+2%' },
            { name: 'Incidents', value: 1, change: '-1' },
            { name: 'Audits', value: 8, change: '0' },
            { name: 'Training Completed', value: '87%', change: '+3%' }
          ],
          chartData: [
            { name: 'Jan', incidents: 3 },
            { name: 'Feb', incidents: 2 },
            { name: 'Mar', incidents: 1 },
            { name: 'Apr', incidents: 0 },
            { name: 'May', incidents: 1 },
            { name: 'Jun', incidents: 0 },
          ],
          pieData: [
            { name: 'Safe', value: 87 },
            { name: 'Minor Issues', value: 8 },
            { name: 'Major Issues', value: 3 },
            { name: 'Critical', value: 2 }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          kpis: [
            { name: 'My Items', value: 0, change: '0' },
            { name: 'Pending', value: 0, change: '0' },
            { name: 'Completed', value: 0, change: '0' },
            { name: 'Alerts', value: 0, change: '0' }
          ],
          chartData: [],
          pieData: []
        };
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const { title, kpis, chartData, pieData } = getDashboardData(userRole);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">{kpi.name}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{kpi.value}</Typography>
              <Typography variant="body2" color="success.main">{kpi.change}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Performance Overview</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0] || {}).filter(key => key !== 'name').map((key, idx) => (
                  <Bar key={idx} dataKey={key} fill={COLORS[idx % COLORS.length]} />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;