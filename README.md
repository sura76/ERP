# Construction ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for construction companies with multi-project support, role-based access control, and real-time tracking capabilities.

## 🏗️ System Overview

This Construction ERP system is designed to manage all aspects of construction projects from initiation to closeout. It provides:

- **Multi-project support** for construction companies managing multiple sites
- **Head office + multiple sites** architecture
- **Role-based access control** with approval hierarchies
- **Financial transparency** with budget tracking and cost control
- **Real-time project tracking** with progress monitoring
- **Audit-ready reporting** with comprehensive logs
- **Web + mobile-friendly** access

## 🏛️ User Roles & Permissions

The system implements strict Role-Based Access Control (RBAC) with approval hierarchies:

### Head Office Roles
- **General Manager**: Full system admin with access to all departments, projects, financials
- **Head Project Manager**: Create/update all projects, view progress across projects
- **Department Heads**: Manage department projects & resources
- **Finance Manager**: Manage company & project finances, invoices, POs, payments
- **Technical Manager**: Access drawings, BOQs, surveys
- **EHS Manager**: View all EHS data, approve investigations & audits

### Project/Site Roles
- **Project Manager**: Full access to assigned project
- **Project Coordinator**: Daily & weekly reports, task scheduling
- **Team Leaders/Supervisors**: Daily progress submissions, material requests
- **EHS Officer**: Daily safety reports, incident reporting

## 📦 Core ERP Modules

### 1. Project Management
- Project lifecycle management (initiation → closeout)
- WBS & milestones tracking
- Gantt scheduling
- Progress % tracking
- Delays & risk logs

### 2. Finance & Accounting
- Budgets (project & company)
- Cost codes management
- Invoices & payments processing
- Purchase orders management
- Expense claims with approval workflows
- Financial reports (P&L, cash flow)

### 3. Procurement & Inventory
- Material requests processing
- Vendor management
- Stock tracking
- GRN & issue notes
- Equipment allocation

### 4. HR & Workforce
- Employee profiles management
- Site assignments
- Timesheets tracking
- Payroll export
- Leave tracking

### 5. EHS (Safety Management)
- Daily safety logs
- Incident reporting
- Audit checklists
- Safety KPIs
- Compliance records

### 6. Technical & Document Control
- Drawings & BOQ uploads
- Version control
- Approval logs
- Change requests (variation orders)

### 7. Reporting & Dashboards
- Role-based dashboards
- Real-time KPIs
- Export to PDF/Excel
- Audit trails

### 8. Workflow & Notifications
- Approval chains
- Email/in-app alerts
- Escalation rules

## 🏗️ System Architecture

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with role-based permissions
- **File Storage**: Local + cloud-ready (AWS S3 compatible)

### Frontend (Conceptual)
- **Framework**: React.js with responsive design
- **State Management**: Redux/Context API
- **UI Components**: Material-UI or Ant Design

### API Structure
- RESTful API design
- Versioned endpoints (e.g., `/api/v1/projects`)
- Comprehensive error handling
- Input validation & sanitization

## 🛡️ Security & Compliance

- Role-based permissions with fine-grained access control
- Financial approval limits by role
- Comprehensive audit logs (who did what & when)
- Secure authentication with JWT tokens
- Input validation & sanitization
- Data encryption at rest and in transit
- Regular data backups

## 📊 Database Schema

The system uses a comprehensive PostgreSQL database schema with:

- 30+ interconnected tables
- Foreign key relationships for data integrity
- Audit logging for compliance
- Proper indexing for performance
- Generated columns for calculated fields

Key tables include:
- `users`, `roles`, `permissions` for access control
- `projects`, `tasks`, `milestones` for project management
- `expenses`, `purchase_orders`, `invoices` for finance
- `materials`, `inventory`, `vendors` for procurement
- `employees`, `timesheets`, `leaves` for HR
- `safety_reports`, `incidents`, `safety_audits` for EHS
- `documents`, `change_requests` for document control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd construction-erp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create database and run migrations
psql -U postgres -c "CREATE DATABASE construction_erp;"
# Apply the database schema from database_schema.sql
psql -U postgres -d construction_erp -f database_schema.sql
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🧪 Testing & Quality Assurance

The system includes comprehensive testing:
- Unit tests for all models and services
- Integration tests for API endpoints
- User acceptance tests (UAT)
- Edge-case scenario testing
- Permission-based test matrix

## 📈 Sample Data & Demo Mode

The system includes scripts to generate:
- Sample projects with realistic data
- Sample users per role
- Demo financial data
- Fake vendors & materials
- Demo safety incidents

## 🚀 Production Deployment

### Requirements
- Production PostgreSQL database
- SSL certificate for HTTPS
- Reverse proxy (Nginx)
- Process manager (PM2)
- Backup strategy

### Deployment Steps
1. Set up production environment
2. Configure database connection
3. Run database migrations
4. Build frontend assets
5. Start the application with PM2
6. Configure Nginx reverse proxy

## 📋 API Documentation

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Common Endpoints

#### Projects
- `GET /api/projects` - Get all projects (with pagination)
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Deactivate project

#### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Finance
- `GET /api/finance/expenses` - Get expenses
- `POST /api/finance/expenses` - Create expense
- `GET /api/finance/budgets` - Get project budgets
- `POST /api/finance/purchase-orders` - Create PO

## 🔧 Future Enhancements

- Mobile application (React Native)
- Advanced reporting with data visualization
- Integration with accounting software (QuickBooks, SAP)
- IoT integration for equipment monitoring
- AI-powered risk prediction
- Advanced project scheduling algorithms
- BIM integration
- Real-time collaboration tools

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions to improve the Construction ERP system. Please read our contributing guidelines for details on our code of conduct and the process for submitting pull requests.

## 🐛 Issues & Support

If you encounter any issues or have questions, please open an issue in the repository. We also provide commercial support options for enterprise deployments.