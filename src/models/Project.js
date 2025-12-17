const db = require('../config/db');

class Project {
  constructor(projectData) {
    this.id = projectData.id;
    this.project_code = projectData.project_code;
    this.name = projectData.name;
    this.location = projectData.location;
    this.start_date = projectData.start_date;
    this.end_date = projectData.end_date;
    this.budget = projectData.budget;
    this.status = projectData.status;
    this.created_by = projectData.created_by;
  }

  // Create a new project
  static async create(projectData) {
    try {
      const query = `
        INSERT INTO projects (project_code, name, location, start_date, end_date, budget, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, project_code, name, location, start_date, end_date, budget, status, created_by, created_at
      `;

      const values = [
        projectData.project_code,
        projectData.name,
        projectData.location,
        projectData.start_date,
        projectData.end_date,
        projectData.budget,
        projectData.status || 'active',
        projectData.created_by
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error(`Project with code ${projectData.project_code} already exists`);
      }
      throw new Error(`Error creating project: ${error.message}`);
    }
  }

  // Find project by ID
  static async findById(projectId) {
    try {
      const query = `
        SELECT p.*, u.full_name as created_by_name
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.id = $1
      `;
      const result = await db.query(query, [projectId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding project by ID: ${error.message}`);
    }
  }

  // Update project
  static async update(projectId, updateData) {
    try {
      let query = 'UPDATE projects SET ';
      const values = [];
      let paramCount = 1;
      const allowedFields = ['name', 'location', 'start_date', 'end_date', 'budget', 'status'];

      const updateFields = [];

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(updateData[field]);
          paramCount++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      query += updateFields.join(', ');
      query += ` WHERE id = $${paramCount} RETURNING id, project_code, name, location, start_date, end_date, budget, status, updated_at`;
      values.push(projectId);

      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Project not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  // Delete project (soft delete by changing status)
  static async deactivate(projectId) {
    try {
      const query = 'UPDATE projects SET status = \'cancelled\' WHERE id = $1 RETURNING id';
      const result = await db.query(query, [projectId]);
      
      if (result.rows.length === 0) {
        throw new Error('Project not found');
      }

      return { success: true, projectId: result.rows[0].id };
    } catch (error) {
      throw new Error(`Error deactivating project: ${error.message}`);
    }
  }

  // Get all projects with pagination and filtering
  static async getAll(page = 1, limit = 10, filters = {}) {
    try {
      let query = `
        SELECT p.*, u.full_name as created_by_name,
               (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
               (SELECT COUNT(*) FROM expenses WHERE project_id = p.id) as expense_count,
               (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE project_id = p.id) as total_spent
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE 1=1
      `;
      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.status) {
        query += ` AND p.status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }

      if (filters.location) {
        query += ` AND p.location ILIKE $${paramCount}`;
        values.push(`%${filters.location}%`);
        paramCount++;
      }

      if (filters.created_by) {
        query += ` AND p.created_by = $${paramCount}`;
        values.push(filters.created_by);
        paramCount++;
      }

      if (filters.search) {
        query += ` AND (p.name ILIKE $${paramCount} OR p.project_code ILIKE $${paramCount})`;
        values.push(`%${filters.search}%`);
        paramCount++;
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, (page - 1) * limit);

      const result = await db.query(query, values);

      // Get total count for pagination
      const countQuery = 'SELECT COUNT(*) FROM projects WHERE 1=1';
      const countValues = [];
      let countParamCount = 1;

      if (filters.status) {
        countQuery += ` AND status = $${countParamCount}`;
        countValues.push(filters.status);
        countParamCount++;
      }

      if (filters.location) {
        countQuery += ` AND location ILIKE $${countParamCount}`;
        countValues.push(`%${filters.location}%`);
        countParamCount++;
      }

      if (filters.created_by) {
        countQuery += ` AND created_by = $${countParamCount}`;
        countValues.push(filters.created_by);
        countParamCount++;
      }

      if (filters.search) {
        countQuery += ` AND (name ILIKE $${countParamCount} OR project_code ILIKE $${countParamCount})`;
        countValues.push(`%${filters.search}%`);
        countParamCount++;
      }

      const countResult = await db.query(countQuery, countValues);

      return {
        projects: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting projects: ${error.message}`);
    }
  }

  // Get project progress summary
  static async getProjectSummary(projectId) {
    try {
      const projectQuery = `
        SELECT p.*, u.full_name as created_by_name
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.id = $1
      `;
      const projectResult = await db.query(projectQuery, [projectId]);

      if (projectResult.rows.length === 0) {
        return null;
      }

      const project = projectResult.rows[0];

      // Calculate progress metrics
      const metricsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM tasks WHERE project_id = $1) as total_tasks,
          (SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND status = 'completed') as completed_tasks,
          (SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND status = 'in-progress') as in_progress_tasks,
          (SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND status = 'delayed') as delayed_tasks,
          (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE project_id = $1) as total_spent,
          (SELECT COALESCE(SUM(approved_amount), 0) FROM project_budgets WHERE project_id = $1) as total_budget,
          (SELECT COUNT(*) FROM incidents WHERE project_id = $1) as incident_count,
          (SELECT COUNT(*) FROM documents WHERE project_id = $1) as document_count
      `;
      const metricsResult = await db.query(metricsQuery, [projectId]);

      return {
        ...project,
        progress_metrics: metricsResult.rows[0]
      };
    } catch (error) {
      throw new Error(`Error getting project summary: ${error.message}`);
    }
  }

  // Assign user to project
  static async assignUserToProject(projectId, userId, roleOnProject) {
    try {
      const query = `
        INSERT INTO project_assignments (project_id, user_id, role_on_project)
        VALUES ($1, $2, $3)
        ON CONFLICT (project_id, user_id) DO UPDATE SET role_on_project = $3, assigned_date = CURRENT_DATE
        RETURNING id, project_id, user_id, role_on_project, assigned_date
      `;

      const values = [projectId, userId, roleOnProject];
      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error assigning user to project: ${error.message}`);
    }
  }

  // Remove user from project
  static async removeUserFromProject(projectId, userId) {
    try {
      const query = 'DELETE FROM project_assignments WHERE project_id = $1 AND user_id = $2 RETURNING id';
      const result = await db.query(query, [projectId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User assignment not found');
      }

      return { success: true, deleted_assignment_id: result.rows[0].id };
    } catch (error) {
      throw new Error(`Error removing user from project: ${error.message}`);
    }
  }

  // Get project team members
  static async getProjectTeam(projectId) {
    try {
      const query = `
        SELECT pa.*, u.full_name, u.email, r.name as role_name
        FROM project_assignments pa
        JOIN users u ON pa.user_id = u.id
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE pa.project_id = $1
        ORDER BY pa.assigned_date DESC
      `;
      const result = await db.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting project team: ${error.message}`);
    }
  }
}

module.exports = Project;