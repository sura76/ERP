import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProjectList from './modules/ProjectManagement/ProjectList';
import BudgetManagement from './modules/Finance/BudgetManagement';
import MaterialRequests from './modules/Procurement/MaterialRequests';
import SafetyReports from './modules/EHS/SafetyReports';
import TimesheetManagement from './modules/HR/TimesheetManagement';
import DocumentControl from './modules/Technical/DocumentControl';
import KpiReports from './modules/Reporting/KpiReports';

const App = () => {
  const [userRole, setUserRole] = useState('project_manager'); // Default role
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Role-based permissions
  const hasPermission = (module) => {
    const permissions = {
      gm: ['dashboard', 'projects', 'finance', 'procurement', 'hr', 'ehs', 'technical', 'reports'],
      head_project_manager: ['dashboard', 'projects', 'finance', 'procurement', 'hr', 'ehs', 'reports'],
      project_manager: ['dashboard', 'projects', 'finance', 'procurement', 'hr', 'ehs'],
      finance_manager: ['dashboard', 'finance', 'reports'],
      procurement_manager: ['dashboard', 'procurement', 'reports'],
      hr_manager: ['dashboard', 'hr', 'reports'],
      ehs_manager: ['dashboard', 'ehs', 'reports'],
      technical_manager: ['dashboard', 'technical', 'reports'],
      team_leader: ['dashboard', 'projects', 'hr'],
      ehs_officer: ['dashboard', 'ehs'],
      project_coordinator: ['dashboard', 'projects']
    };

    return permissions[userRole]?.includes(module) || false;
  };

  // Render the current page based on the selected page and user role
  const renderPage = () => {
    if (!hasPermission(currentPage)) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this module.</p>
        </div>
      );
    }

    switch(currentPage) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'projects':
        return <ProjectList />;
      case 'finance':
        return <BudgetManagement />;
      case 'procurement':
        return <MaterialRequests />;
      case 'hr':
        return <TimesheetManagement />;
      case 'ehs':
        return <SafetyReports />;
      case 'technical':
        return <DocumentControl />;
      case 'reports':
        return <KpiReports />;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <MainLayout userRole={userRole}>
      {renderPage()}
    </MainLayout>
  );
};

export default App;