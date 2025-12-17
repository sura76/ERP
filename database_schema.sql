-- CONSTRUCTION ERP DATABASE SCHEMA
-- Phase-by-Phase Implementation

-- PHASE A – CORE SYSTEM & SECURITY

-- Users table with role-based access control
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    department_id INTEGER REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL
);

-- Role-Permissions relationship
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Approval limits for financial controls
CREATE TABLE approval_limits (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    max_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    head_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE B – PROJECT MANAGEMENT

-- Projects table (core construction engine)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active', -- active, completed, on-hold, cancelled
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project assignments (users assigned to projects)
CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    role_on_project VARCHAR(100), -- Project Manager, Supervisor, etc.
    assigned_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Milestones for project tracking
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    planned_date DATE,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, completed, delayed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks within projects
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    status VARCHAR(50) DEFAULT 'not-started', -- not-started, in-progress, completed, delayed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk logs for project management
CREATE TABLE risk_logs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    risk_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    probability INTEGER CHECK (probability >= 1 AND probability <= 5), -- 1-5 scale
    impact INTEGER CHECK (impact >= 1 AND impact <= 5), -- 1-5 scale
    mitigation_plan TEXT,
    owner_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'identified', -- identified, analyzed, evaluated, treated, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE C – FINANCE & ACCOUNTING

-- Cost codes for budget tracking
CREATE TABLE cost_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100), -- labor, materials, equipment, overhead, etc.
    parent_id INTEGER REFERENCES cost_codes(id), -- for hierarchical structure
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project budgets
CREATE TABLE project_budgets (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    cost_code_id INTEGER REFERENCES cost_codes(id),
    approved_amount DECIMAL(15,2) NOT NULL,
    allocated_amount DECIMAL(15,2) DEFAULT 0,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (approved_amount - spent_amount) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, cost_code_id)
);

-- Expenses tracking
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    cost_code_id INTEGER REFERENCES cost_codes(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    submitted_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, rejected, paid
    expense_date DATE DEFAULT CURRENT_DATE,
    receipt_file_path VARCHAR(500),
    vendor_name VARCHAR(255),
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount + tax_amount) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vendors/suppliers
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info JSONB, -- {phone, email, address}
    tax_number VARCHAR(100),
    payment_terms VARCHAR(100), -- net 30, net 60, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, blacklisted
    credit_limit DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase orders
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INTEGER REFERENCES vendors(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, partially-received, received, closed
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase order items
CREATE TABLE po_items (
    id SERIAL PRIMARY KEY,
    po_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materials(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' -- pending, partially-received, received
);

-- Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    po_id INTEGER REFERENCES purchase_orders(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id),
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, overdue, disputed
    issued_date DATE DEFAULT CURRENT_DATE,
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    notes TEXT,
    attachment_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    paid_amount DECIMAL(15,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    method VARCHAR(50) NOT NULL, -- bank-transfer, check, cash, credit-card
    reference_number VARCHAR(100),
    notes TEXT,
    processed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE D – PROCUREMENT & INVENTORY

-- Materials catalog
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- kg, m, m2, m3, piece, etc.
    category VARCHAR(100),
    supplier_id INTEGER REFERENCES vendors(id),
    unit_cost DECIMAL(10,2),
    min_stock_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory tracking
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(10,2) DEFAULT 0,
    available_quantity DECIMAL(10,2) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    location VARCHAR(255),
    last_updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material requests
CREATE TABLE material_requests (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, fulfilled
    priority VARCHAR(20) DEFAULT 'medium',
    approved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material request items
CREATE TABLE material_request_items (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES material_requests(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materials(id),
    requested_quantity DECIMAL(10,2) NOT NULL,
    approved_quantity DECIMAL(10,2),
    fulfilled_quantity DECIMAL(10,2) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(15,2) GENERATED ALWAYS AS (requested_quantity * unit_cost) STORED
);

-- Equipment tracking
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    current_value DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'available', -- available, in-use, maintenance, retired
    location VARCHAR(255),
    assigned_project_id INTEGER REFERENCES projects(id),
    assigned_to INTEGER REFERENCES users(id),
    maintenance_schedule JSONB, -- {frequency, last_service, next_service}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Equipment usage logs
CREATE TABLE equipment_usage (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    operator_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    hours_used DECIMAL(6,2) GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/3600) STORED,
    fuel_consumption DECIMAL(8,2),
    operating_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE E – HR & WORKFORCE

-- Employee profiles
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    position VARCHAR(100),
    department_id INTEGER REFERENCES departments(id),
    manager_id INTEGER REFERENCES users(id),
    salary DECIMAL(12,2),
    hire_date DATE,
    termination_date DATE,
    employment_status VARCHAR(50) DEFAULT 'active', -- active, terminated, on-leave
    emergency_contact JSONB, -- {name, phone, relationship}
    bank_details JSONB, -- {account_no, bank_name, routing_no}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timesheets
CREATE TABLE timesheets (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours_worked DECIMAL(4,2) NOT NULL CHECK (hours_worked >= 0 AND hours_worked <= 24),
    task_description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, approved, rejected, paid
    submitted_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

-- Leave management
CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    type VARCHAR(50) NOT NULL, -- annual, sick, maternity, unpaid
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    reason TEXT,
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE F – EHS (SAFETY)

-- Daily safety reports
CREATE TABLE safety_reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(id),
    date DATE DEFAULT CURRENT_DATE,
    safe_to_start BOOLEAN DEFAULT TRUE,
    weather_conditions VARCHAR(100),
    safety_meeting_conducted BOOLEAN DEFAULT FALSE,
    attendees_count INTEGER,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incidents tracking
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(id),
    type VARCHAR(100) NOT NULL, -- accident, injury, near-miss, property-damage
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- minor, moderate, major, catastrophic
    date_occurred TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    affected_personnel TEXT, -- comma-separated list of involved people
    immediate_actions_taken TEXT,
    root_cause_analysis TEXT,
    corrective_actions TEXT,
    status VARCHAR(50) DEFAULT 'open', -- open, under-investigation, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safety audits
CREATE TABLE safety_audits (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    auditor_id INTEGER REFERENCES users(id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    findings TEXT,
    recommendations TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    audit_date DATE DEFAULT CURRENT_DATE,
    next_audit_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safety training records
CREATE TABLE safety_training (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    training_topic VARCHAR(255) NOT NULL,
    trainer VARCHAR(255),
    training_date DATE,
    expiry_date DATE,
    certificate_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'valid', -- valid, expired, expiring-soon
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE G – TECHNICAL & DOCUMENT CONTROL

-- Documents (drawings, BOQs, reports)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- drawing, boq, report, specification, contract
    version VARCHAR(20) DEFAULT '1.0',
    revision VARCHAR(20),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER, -- in bytes
    uploaded_by INTEGER REFERENCES users(id),
    approval_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    description TEXT,
    tags TEXT[], -- array of tags for search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Change requests (variations)
CREATE TABLE change_requests (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requested_by INTEGER REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under-review, approved, rejected, implemented
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    impact_scope TEXT, -- description of what will be impacted
    impact_cost DECIMAL(15,2), -- estimated cost impact
    impact_schedule INTEGER, -- estimated days impact on schedule
    implementation_date DATE,
    approved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drawing revisions
CREATE TABLE drawing_revisions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    revision_number VARCHAR(20) NOT NULL,
    revision_reason TEXT,
    revised_by INTEGER REFERENCES users(id),
    revision_date DATE DEFAULT CURRENT_DATE,
    file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHASE H – REPORTING & DASHBOARDS

-- KPI definitions
CREATE TABLE kpi_definitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- financial, safety, productivity, quality
    description TEXT,
    formula TEXT, -- how to calculate
    target_value DECIMAL(10,2),
    frequency VARCHAR(50), -- daily, weekly, monthly, quarterly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KPI values (historical data)
CREATE TABLE kpi_values (
    id SERIAL PRIMARY KEY,
    kpi_id INTEGER REFERENCES kpi_definitions(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    value DECIMAL(10,2) NOT NULL,
    calculated_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports generation
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- project-status, financial-summary, safety-report, etc.
    generated_by INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    report_data JSONB, -- the actual report content
    format VARCHAR(10), -- pdf, excel, csv
    file_path VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE

-- Common lookup indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_expenses_project_id ON expenses(project_id);
CREATE INDEX idx_expenses_submitted_by ON expenses(submitted_by);
CREATE INDEX idx_invoices_vendor_id ON invoices(vendor_id);
CREATE INDEX idx_inventory_material_id ON inventory(material_id);
CREATE INDEX idx_timesheets_employee_id ON timesheets(employee_id);
CREATE INDEX idx_timesheets_project_id ON timesheets(project_id);
CREATE INDEX idx_timesheets_date ON timesheets(date);
CREATE INDEX idx_incidents_project_id ON incidents(project_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_change_requests_project_id ON change_requests(project_id);

-- TRIGGERS FOR AUDIT LOGGING

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON timesheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();