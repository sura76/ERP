# Construction ERP UI System

## Overview
This UI system implements a role-based, modular, field-ready interface for the Construction ERP system. It follows the design principles of being desktop-first for Head Office and mobile-first for Site users, with fast data entry and offline-friendly patterns for field roles.

## UI Design Principles
- Role-based UI (users only see what they are allowed to see)
- Desktop-first for Head Office, mobile-first for Site
- Fast data entry (minimal clicks)
- Offline-friendly patterns for field roles
- Audit-visible actions (approve, reject, comment)
- Consistent components across modules

## Global UI Structure
- Top Bar: Company name, Project switcher, Notifications, User profile
- Left Sidebar: Dashboard, Projects, Finance, Procurement, HR, EHS, Technical Docs, Reports, Admin
- Main Content Area: Page content

## Tech Stack
- Frontend: React + TypeScript
- UI Kit: Material-UI (MUI)
- Charts: Recharts
- State: React Query + Redux Toolkit
- Forms: React Hook Form
- Auth: JWT with route guards

## Component System
Reusable components defined once, used everywhere:
- Buttons: Primary / Approve / Reject / Danger
- Status badges: Pending, Approved, Rejected
- Tables: Sort, filter, export
- Forms: Validation, autosave
- Modals: Approval, confirmation
- Charts: Line, bar, donut

## Role-Based Dashboards

### General Manager Dashboard
- Company-wide KPIs
- Total active projects
- Budget vs actual (chart)
- Pending approvals
- Safety summary

### Head Project Manager Dashboard
- All projects status cards
- Schedule delays
- Budget warnings
- Risk heatmap

### Finance Dashboard
- Cash flow
- Outstanding invoices
- PO approvals
- Budget overruns

### Project Manager Dashboard
- Project progress %
- Tasks due today
- Material requests
- Timesheets awaiting approval
- Safety status

### EHS Manager Dashboard
- Incident trends
- Safe-to-Start compliance
- Audit scores
- Open investigations

## Core UI Modules & Screens

### Project Management UI
- Project List Page (Card or table view with filters)
- Project Detail (Tabs: Overview, Schedule, Tasks, Budget, Risks, Team, Documents, Reports)
- Gantt View (Drag & drop tasks, visual delays, dependencies)

### Finance UI
- Budget Setup Screen (Editable grid with approval button)
- Expenses Submission (Simple form with receipt attachment)
- Approval Screen (Compare requested vs budget with approve/reject options)

### Procurement & Inventory UI
- Material Request Form (Mobile-friendly with quick selection)
- PO Management (Vendor selection with auto-total calculation)
- Vendor Management (Contact info, tax numbers)

### HR & Timesheet UI
- Daily Timesheet (Field optimized with one-click submit)
- Supervisor Approval (Batch approve with anomaly highlighting)

### EHS UI
- Daily Safety Report (Safe-to-Start toggle with checklist and photo upload)
- Incident Report (Type, severity, description with auto-notification)

### Technical & Document Control UI
- Document Library (Folder + tag system with version history)
- Change Request Screen (Description, cost impact, schedule impact)

### Reporting & KPI UI
- Report Builder (Select project, date range, metrics)
- Export to PDF/Excel

## Mobile UI Features
- One-hand usage optimization
- Offline draft saving
- Camera integration for photos
- Fast sync when online
- Field-optimized forms

## Notification Center
- Approval requests
- Overdue tasks
- Budget alerts
- Safety alerts

## Security & Permissions
- Role-based visibility (users only see allowed modules)
- Approval workflows with audit trail
- Financial approval limits by role
- Action logging for all changes

## Responsive Design
- Desktop: Full sidebar navigation with all modules
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation or hamburger menu
- Field forms optimized for mobile use

## Implementation Details

### Main Layout Component
The MainLayout component provides the global structure with:
- Responsive sidebar that adapts to screen size
- Role-based menu items that only show accessible modules
- Top bar with notifications and user profile

### Dashboard Component
The Dashboard component provides role-specific KPIs and charts:
- General Manager: Company-wide metrics
- Finance Manager: Financial metrics
- Project Manager: Project-specific metrics
- EHS Manager: Safety metrics

### Module Components
Each module follows a consistent pattern:
- Tabbed interfaces for related functions
- Responsive tables with filtering and search
- Action buttons for common operations
- Approval workflows with status tracking

### Data Management
- All forms include validation
- Tables support sorting, filtering, and export
- Charts update in real-time
- Audit trails for all changes

## Development Guidelines
1. All components should be responsive
2. Follow Material Design principles
3. Use consistent color coding for statuses
4. Implement proper error handling
5. Include loading states for async operations
6. Ensure accessibility compliance
7. Optimize for mobile field use
8. Include proper role-based access controls

## Testing Considerations
- Cross-browser compatibility
- Mobile responsiveness
- Performance with large datasets
- Offline functionality for field use
- Security validation
- Accessibility compliance
- Cross-device synchronization