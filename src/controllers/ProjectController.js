const Project = require('../models/Project');
const db = require('../config/db');

class ProjectController {
  // Create a new project
  static async create(req, res) {
    try {
      const { project_code, name, location, start_date, end_date, budget, status } = req.body;

      // Validate required fields
      if (!project_code || !name) {
        return res.status(400).json({ 
          error: 'Project code and name are required' 
        });
      }

      // Create project data
      const projectData = {
        project_code,
        name,
        location: location || null,
        start_date: start_date || null,
        end_date: end_date || null,
        budget: budget ? parseFloat(budget) : null,
        status: status || 'active',
        created_by: req.user.id
      };

      // Create new project
      const newProject = await Project.create(projectData);

      // Automatically assign the creator as the project manager
      await Project.assignUserToProject(newProject.id, req.user.id, 'Project Manager');

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ 
        error: 'Failed to create project',
        details: error.message 
      });
    }
  }

  // Get all projects
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status, location, search } = req.query;

      // Build filters object
      const filters = {};
      if (status) filters.status = status;
      if (location) filters.location = location;
      if (search) filters.search = search;

      // For Head Office roles, they can see all projects
      // For project-specific roles, we might want to filter differently
      const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [req.user.role_id]);
      const roleName = roleResult.rows[0]?.name;

      // If not a Head Office role, limit to projects the user is assigned to
      if (!['General Manager', 'Head Project Manager', 'Finance Manager', 'Technical Manager', 'EHS Manager'].includes(roleName)) {
        // In this case, we'd need to modify the Project model to filter by user assignments
        // For now, we'll just pass the user ID as a filter if needed
        filters.created_by = req.user.id;
      }

      const result = await Project.getAll(parseInt(page), parseInt(limit), filters);

      res.status(200).json({
        projects: result.projects,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve projects',
        details: error.message 
      });
    }
  }

  // Get project by ID
  static async getById(req, res) {
    try {
      const projectId = req.params.id;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ 
          error: 'Project not found' 
        });
      }

      res.status(200).json({
        project
      });
    } catch (error) {
      console.error('Get project by ID error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve project',
        details: error.message 
      });
    }
  }

  // Update project
  static async update(req, res) {
    try {
      const projectId = req.params.id;
      const updateData = {};

      // Only allow specific fields to be updated
      const allowedFields = ['name', 'location', 'start_date', 'end_date', 'budget', 'status'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          error: 'No valid fields provided for update' 
        });
      }

      // Convert budget to number if provided
      if (updateData.budget) {
        updateData.budget = parseFloat(updateData.budget);
      }

      const updatedProject = await Project.update(projectId, updateData);

      res.status(200).json({
        message: 'Project updated successfully',
        project: updatedProject
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ 
        error: 'Failed to update project',
        details: error.message 
      });
    }
  }

  // Deactivate project
  static async deactivate(req, res) {
    try {
      const projectId = req.params.id;

      const result = await Project.deactivate(projectId);

      res.status(200).json({
        message: 'Project deactivated successfully',
        ...result
      });
    } catch (error) {
      console.error('Deactivate project error:', error);
      res.status(500).json({ 
        error: 'Failed to deactivate project',
        details: error.message 
      });
    }
  }

  // Get project summary
  static async getSummary(req, res) {
    try {
      const projectId = req.params.id;

      const summary = await Project.getProjectSummary(projectId);

      if (!summary) {
        return res.status(404).json({ 
          error: 'Project not found' 
        });
      }

      res.status(200).json({
        summary
      });
    } catch (error) {
      console.error('Get project summary error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve project summary',
        details: error.message 
      });
    }
  }

  // Get project team
  static async getProjectTeam(req, res) {
    try {
      const projectId = req.params.id;

      const team = await Project.getProjectTeam(projectId);

      res.status(200).json({
        team
      });
    } catch (error) {
      console.error('Get project team error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve project team',
        details: error.message 
      });
    }
  }

  // Assign user to project
  static async assignUserToProject(req, res) {
    try {
      const projectId = req.params.id;
      const { userId, role_on_project } = req.body;

      if (!userId || !role_on_project) {
        return res.status(400).json({ 
          error: 'User ID and role on project are required' 
        });
      }

      // Verify that the user exists
      const userResult = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      const assignment = await Project.assignUserToProject(projectId, userId, role_on_project);

      res.status(200).json({
        message: 'User assigned to project successfully',
        assignment
      });
    } catch (error) {
      console.error('Assign user to project error:', error);
      res.status(500).json({ 
        error: 'Failed to assign user to project',
        details: error.message 
      });
    }
  }

  // Remove user from project
  static async removeUserFromProject(req, res) {
    try {
      const projectId = req.params.id;
      const userId = req.params.userId;

      const result = await Project.removeUserFromProject(projectId, userId);

      res.status(200).json({
        message: 'User removed from project successfully',
        ...result
      });
    } catch (error) {
      console.error('Remove user from project error:', error);
      res.status(500).json({ 
        error: 'Failed to remove user from project',
        details: error.message 
      });
    }
  }
}

module.exports = ProjectController;