# CONSTRUCTION ERP SYSTEM - ARCHITECTURE OVERVIEW

## 🏗️ SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONSTRUCTION ERP                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   FRONTEND      │  │   BACKEND       │  │   DATABASE      │            │
│  │   (Conceptual)  │  │   (Node.js)     │  │   (PostgreSQL)  │            │
│  │                 │  │                 │  │                 │            │
│  │ • React.js      │  │ • Express.js    │  │ • 30+ Tables    │            │
│  │ • Responsive    │  │ • JWT Auth      │  │ • Relations     │            │
│  │ • Mobile-Friendly│ │ • Middleware    │  │ • Indexes       │            │
│  │ • Material-UI   │  │ • Validation    │  │ • Triggers      │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYER                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │ AUTHENTICATION  │  │ AUTHORIZATION   │  │ AUDIT LOGGING   │            │
│  │ • JWT Tokens    │  │ • RBAC          │  │ • All Actions   │            │
│  │ • Bcrypt Hash   │  │ • Permissions   │  │ • Who/What/When │            │
│  │ • Sessions      │  │ • Approvals     │  │ • Financial     │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CORE MODULES                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │PROJECT MGMT │ │ FINANCE &   │ │ PROCUREMENT │ │    HR &     │         │
│  │ • Projects  │ │ ACCOUNTING  │ │  & INVENTORY│ │  WORKFORCE  │         │
│  │ • Tasks     │ │ • Budgets   │ │ • Materials │ │ • Employees │         │
│  │ • Milestones│ │ • Expenses  │ │ • Vendors   │ │ • Timesheets│         │
│  │ • Risks     │ │ • Invoices  │ │ • Equipment │ │ • Leave     │         │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │     EHS     │ │ TECHNICAL & │ │  REPORTING  │ │ WORKFLOW &  │         │
│  │ SAFETY MGMT │ │ DOCUMENT CTL│ │  & DASHBOARDS│ │ NOTIFICATIONS │       │
│  │ • Safety Rep│ │ • Drawings  │ │ • KPIs      │ │ • Approvals │         │
│  │ • Incidents │ │ • Versions  │ │ • Dashboards│ │ • Alerts    │         │
│  │ • Audits    │ │ • Changes   │ │ • Export    │ │ • Escalation│         │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🏛️ USER ROLE HIERARCHY

```
                    HEAD OFFICE LEVEL
                 ┌─────────────────────┐
                 │   General Manager   │ ← Full system access
                 └─────────────────────┘
                           │
                 ┌─────────────────────┐
                 │Head Project Manager │ ← Cross-project oversight
                 └─────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Department  │ │  Department  │ │  Department  │
│    Heads     │ │    Heads     │ │    Heads     │
│ (Finance,    │ │ (Technical,  │ │ (EHS, etc.)  │
│  Engineering,│ │  Procurement,│ │              │
│  etc.)       │ │  etc.)       │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │                  │                  │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Project       │ │Project       │ │Project       │
│Manager       │ │Manager       │ │Manager       │
└──────────────┘ └──────────────┘ └──────────────┘
        │                  │                  │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Project       │ │Team Leaders/ │ │EHS Officers  │
│Coordinators  │ │Supervisors   │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │                  │                  │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Workers       │ │Workers       │ │Workers       │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 📊 DATABASE RELATIONSHIP DIAGRAM

```
USERS ──────┬─── ROLES ─── PERMISSIONS
│           │               ▲
│           └─── ROLE_PERMISSIONS
│
├─── DEPARTMENTS
│
└─── PROJECT_ASSIGNMENTS ─── PROJECTS
    │                         │
    │                         ├─── MILESTONES
    │                         ├─── TASKS
    │                         ├─── RISK_LOGS
    │                         ├─── PROJECT_BUDGETS ─── COST_CODES
    │                         │
    └─── EXPENSES ───┬─── VENDORS
                     ├─── INVOICES
                     └─── PURCHASE_ORDERS ─── PO_ITEMS
                     └─── PAYMENTS

MATERIALS ───┬─── INVENTORY
             ├─── MATERIAL_REQUESTS ─── MATERIAL_REQUEST_ITEMS
             └─── EQUIPMENT ─── EQUIPMENT_USAGE

EMPLOYEES ─── TIMESHEETS
│
└─── LEAVES

SAFETY_REPORTS
│
├─── INCIDENTS
└─── SAFETY_AUDITS
└─── SAFETY_TRAINING

DOCUMENTS ───┬─── DRAWING_REVISIONS
             └─── CHANGE_REQUESTS

KPI_DEFINITIONS ─── KPI_VALUES
```

## 🔐 SECURITY FLOW

1. **User Authentication**
   - User provides credentials
   - Password verification with bcrypt
   - JWT token generation
   - Session management

2. **Role-Based Authorization**
   - Token validation
   - Role verification
   - Permission checking
   - Access control enforcement

3. **Project-Based Access**
   - Project assignment validation
   - Head office role override
   - Cross-project access control

4. **Financial Controls**
   - Approval limit validation
   - Multi-level approval workflows
   - Budget constraint enforcement
   - Audit trail creation

## 🚀 API FLOW EXAMPLE

### Creating a Project
```
Client → Auth Middleware → Permission Check → Project Controller → Database
  ↓           ↓                  ↓                   ↓              ↓
Request   Token Valid?      Authorized?        Process Data    Insert Record
  ↓           ↓                  ↓                   ↓              ↓
Response ← Validation ← Authorization ← Business Logic ← Transaction
```

### Expense Approval Workflow
```
1. Employee submits expense → Status: Draft
2. Supervisor reviews → Status: Submitted  
3. Finance Manager approves → Status: Approved
4. Payment processed → Status: Paid
5. Audit log created for compliance
```

## 📈 REPORTING & DASHBOARDS

### Role-Based Dashboards
- **GM/HPM**: Company-wide KPIs, financial overview, project portfolio
- **Project Manager**: Project-specific metrics, team performance, budget status
- **Finance Manager**: Financial KPIs, cash flow, vendor management
- **EHS Manager**: Safety metrics, incident trends, compliance status

### KPI Tracking
- Financial: Budget variance, cost per project, ROI
- Safety: Incident rates, audit scores, training compliance
- Productivity: Task completion, resource utilization
- Quality: Defect rates, rework costs, customer satisfaction

## 🔄 WORKFLOW AUTOMATION

### Approval Chains
- Expense approvals based on amount and role
- Purchase order approvals
- Change request reviews
- Safety incident escalation

### Notifications
- Email alerts for approvals needed
- In-app notifications for updates
- Escalation reminders
- Status change alerts

## 🔧 TECHNICAL SPECIFICATIONS

### Backend Stack
- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with refresh tokens
- **Validation**: Express-validator, Joi
- **File Upload**: Multer with size limits
- **Security**: Helmet, CORS, rate limiting

### Database Features
- **Relationships**: Foreign key constraints
- **Performance**: Indexed queries
- **Audit**: Comprehensive logging
- **Security**: Role-based access
- **Integrity**: Transaction management

### Security Measures
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role and permission checks
- **Input Validation**: Sanitization and validation
- **Rate Limiting**: Prevents abuse
- **Encryption**: Password hashing with bcrypt
- **Compliance**: GDPR-ready data handling

This Construction ERP system provides a complete, scalable, and secure solution for construction companies managing multiple projects with complex organizational structures and compliance requirements.