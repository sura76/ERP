// Database seed script for Construction ERP
const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('Seeding database...');

  try {
    // Create default roles
    const roles = [
      { name: 'General Manager', description: 'Full system admin with access to all departments, projects, financials' },
      { name: 'Head Project Manager', description: 'Create/update all projects, view progress across projects' },
      { name: 'Project Manager', description: 'Full access to assigned project' },
      { name: 'Project Coordinator', description: 'Daily & weekly reports, task scheduling' },
      { name: 'Team Leader', description: 'Daily progress submissions, material requests' },
      { name: 'Finance Manager', description: 'Manage company & project finances, invoices, POs, payments' },
      { name: 'EHS Manager', description: 'View all EHS data, approve investigations & audits' },
      { name: 'EHS Officer', description: 'Daily safety reports, incident reporting' },
      { name: 'Technical Manager', description: 'Access drawings, BOQs, surveys' },
      { name: 'Worker', description: 'Basic worker access' }
    ];

    for (const role of roles) {
      await db.query(`
        INSERT INTO roles (name, description) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO NOTHING
      `, [role.name, role.description]);
    }

    console.log('Roles created successfully');

    // Create default departments
    const departments = [
      { name: 'Project Management', head_user_id: null },
      { name: 'Finance', head_user_id: null },
      { name: 'Engineering', head_user_id: null },
      { name: 'Procurement', head_user_id: null },
      { name: 'EHS', head_user_id: null },
      { name: 'HR', head_user_id: null }
    ];

    for (const dept of departments) {
      await db.query(`
        INSERT INTO departments (name, head_user_id) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO NOTHING
      `, [dept.name, dept.head_user_id]);
    }

    console.log('Departments created successfully');

    // Create default users with different roles
    const users = [
      {
        full_name: 'John Smith',
        email: 'john.smith@construction.com',
        password: 'Admin123!',
        role_name: 'General Manager',
        department_name: 'Project Management'
      },
      {
        full_name: 'Jane Doe',
        email: 'jane.doe@construction.com',
        password: 'Manager123!',
        role_name: 'Head Project Manager',
        department_name: 'Project Management'
      },
      {
        full_name: 'Mike Johnson',
        email: 'mike.johnson@construction.com',
        password: 'Project123!',
        role_name: 'Project Manager',
        department_name: 'Project Management'
      },
      {
        full_name: 'Sarah Williams',
        email: 'sarah.williams@construction.com',
        password: 'Finance123!',
        role_name: 'Finance Manager',
        department_name: 'Finance'
      },
      {
        full_name: 'Robert Brown',
        email: 'robert.brown@construction.com',
        password: 'EHS123!',
        role_name: 'EHS Manager',
        department_name: 'EHS'
      }
    ];

    for (const user of users) {
      // Get role_id
      const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [user.role_name]);
      const roleId = roleResult.rows[0].id;

      // Get department_id
      const deptResult = await db.query('SELECT id FROM departments WHERE name = $1', [user.department_name]);
      const deptId = deptResult.rows[0].id;

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      await db.query(`
        INSERT INTO users (full_name, email, password_hash, role_id, department_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [user.full_name, user.email.toLowerCase(), hashedPassword, roleId, deptId, true]);
    }

    console.log('Users created successfully');

    // Create default cost codes
    const costCodes = [
      { code: 'LAB-001', description: 'Skilled Labor', category: 'labor' },
      { code: 'LAB-002', description: 'Unskilled Labor', category: 'labor' },
      { code: 'MAT-001', description: 'Concrete', category: 'materials' },
      { code: 'MAT-002', description: 'Steel', category: 'materials' },
      { code: 'MAT-003', description: 'Wood', category: 'materials' },
      { code: 'EQP-001', description: 'Excavator', category: 'equipment' },
      { code: 'EQP-002', description: 'Crane', category: 'equipment' },
      { code: 'OVH-001', description: 'Overhead', category: 'overhead' },
      { code: 'SUB-001', description: 'Subcontractor', category: 'subcontractor' }
    ];

    for (const code of costCodes) {
      await db.query(`
        INSERT INTO cost_codes (code, description, category) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (code) DO NOTHING
      `, [code.code, code.description, code.category]);
    }

    console.log('Cost codes created successfully');

    // Create a sample project
    const projectResult = await db.query(`
      INSERT INTO projects (project_code, name, location, start_date, end_date, budget, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (project_code) DO NOTHING
      RETURNING id
    `, [
      'PROJ-001',
      'Downtown Office Complex',
      '123 Main St, City Center',
      '2023-06-01',
      '2024-12-31',
      5000000.00,
      'active',
      1  // John Smith (GM)
    ]);

    if (projectResult.rows.length > 0) {
      const projectId = projectResult.rows[0].id;

      // Assign users to the project
      await db.query(`
        INSERT INTO project_assignments (project_id, user_id, role_on_project)
        VALUES ($1, $2, $3)
      `, [projectId, 3, 'Project Manager']); // Mike Johnson as Project Manager

      await db.query(`
        INSERT INTO project_assignments (project_id, user_id, role_on_project)
        VALUES ($1, $2, $3)
      `, [projectId, 1, 'General Manager']); // John Smith as General Manager

      console.log('Sample project created successfully');
    }

    // Create sample materials
    const materials = [
      { name: 'Portland Cement 50kg', unit: 'bag', category: 'cement', unit_cost: 15.00 },
      { name: 'Reinforcement Steel 12mm', unit: 'm', category: 'steel', unit_cost: 3.50 },
      { name: 'Concrete Sand', unit: 'm3', category: 'aggregates', unit_cost: 45.00 },
      { name: 'Crushed Stone 20mm', unit: 'm3', category: 'aggregates', unit_cost: 50.00 },
      { name: 'Timber 2x4', unit: 'piece', category: 'wood', unit_cost: 8.00 }
    ];

    for (const material of materials) {
      await db.query(`
        INSERT INTO materials (name, unit, category, unit_cost)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
      `, [material.name, material.unit, material.category, material.unit_cost]);
    }

    console.log('Materials created successfully');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;