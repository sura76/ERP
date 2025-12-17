const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    
    // Get user from database
    const userResult = await db.query('SELECT id, full_name, email, role_id, is_active FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      return res.status(401).json({ error: 'Invalid token - user not found or inactive' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Authorization middleware - check specific permissions
const authorizePermission = (module, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if user has the required permission
      const permissionCheck = await db.query(`
        SELECT p.id 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN users u ON u.role_id = rp.role_id
        WHERE u.id = $1 AND p.module = $2 AND p.action = $3
      `, [req.user.id, module, action]);

      if (permissionCheck.rows.length === 0) {
        return res.status(403).json({ 
          error: `Insufficient permissions. Required: ${module}.${action}`,
          userRole: req.user.role_id
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};

// Authorization middleware - check specific role
const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get role name to compare
      const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [req.user.role_id]);
      
      if (!roleResult.rows.length || !allowedRoles.includes(roleResult.rows[0].name)) {
        return res.status(403).json({ 
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          userRole: roleResult.rows[0]?.name || 'Unknown'
        });
      }

      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      return res.status(500).json({ error: 'Role authorization check failed' });
    }
  };
};

// Check project access for the current user
const authorizeProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if user has access to this project (either directly assigned or through role)
    const projectAssignment = await db.query(`
      SELECT pa.id 
      FROM project_assignments pa
      WHERE pa.project_id = $1 AND pa.user_id = $2
    `, [projectId, req.user.id]);

    // Also allow Head Office roles to access all projects
    const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [req.user.role_id]);
    const roleName = roleResult.rows[0]?.name;

    const headOfficeRoles = ['General Manager', 'Head Project Manager', 'Finance Manager', 'Technical Manager', 'EHS Manager'];
    
    if (projectAssignment.rows.length === 0 && !headOfficeRoles.includes(roleName)) {
      return res.status(403).json({ 
        error: 'Access denied to this project',
        projectId: projectId
      });
    }

    next();
  } catch (error) {
    console.error('Project authorization error:', error);
    return res.status(500).json({ error: 'Project authorization check failed' });
  }
};

module.exports = {
  authenticateToken,
  authorizePermission,
  authorizeRole,
  authorizeProjectAccess
};