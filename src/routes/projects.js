const express = require('express');
const ProjectController = require('../controllers/ProjectController');
const { authenticateToken, authorizePermission, authorizeRole, authorizeProjectAccess } = require('../middleware/auth');

const router = express.Router();

// Public route for health check (will be protected in real implementation)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Projects service is running' });
});

// Project routes - all require authentication
router.use(authenticateToken);

// Create project (only for Project Managers, Head Project Managers, General Managers)
router.post('/', 
  authorizeRole('Project Manager', 'Head Project Manager', 'General Manager'),
  ProjectController.create
);

// Get all projects (accessible to all authenticated users with project view permission)
router.get('/', 
  authorizePermission('project', 'view'),
  ProjectController.getAll
);

// Get project by ID
router.get('/:id', 
  authorizeProjectAccess,
  ProjectController.getById
);

// Update project
router.put('/:id', 
  authorizeProjectAccess,
  authorizePermission('project', 'edit'),
  ProjectController.update
);

// Delete/deactivate project
router.delete('/:id', 
  authorizeProjectAccess,
  authorizePermission('project', 'delete'),
  ProjectController.deactivate
);

// Get project summary
router.get('/:id/summary', 
  authorizeProjectAccess,
  ProjectController.getSummary
);

// Project team management
router.get('/:id/team', 
  authorizeProjectAccess,
  ProjectController.getProjectTeam
);

router.post('/:id/assign-user', 
  authorizeProjectAccess,
  authorizePermission('project', 'assign_user'),
  ProjectController.assignUserToProject
);

router.delete('/:id/remove-user/:userId', 
  authorizeProjectAccess,
  authorizePermission('project', 'remove_user'),
  ProjectController.removeUserFromProject
);

module.exports = router;