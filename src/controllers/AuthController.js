const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { full_name, email, password, role_id, department_id } = req.body;

      // Validate required fields
      if (!full_name || !email || !password || !role_id) {
        return res.status(400).json({ 
          error: 'Full name, email, password, and role ID are required' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        });
      }

      // Create new user
      const newUser = await User.create({
        full_name,
        email,
        password,
        role_id,
        department_id
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          role_id: newUser.role_id,
          department_id: newUser.department_id
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Registration failed',
        details: error.message 
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({ 
          error: 'Account is deactivated. Contact administrator.' 
        });
      }

      // Compare password
      const isValidPassword = await User.comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      // Get role name for the response
      const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [user.role_id]);
      const roleName = roleResult.rows[0]?.name || 'Unknown';

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role_id: user.role_id,
          role_name: roleName,
          department_id: user.department_id
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        details: error.message 
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      // req.user is populated by the authentication middleware
      const user = req.user;

      // Get role name
      const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [user.role_id]);
      const roleName = roleResult.rows[0]?.name || 'Unknown';

      // Get department name if department_id exists
      let departmentName = null;
      if (user.department_id) {
        const deptResult = await db.query('SELECT name FROM departments WHERE id = $1', [user.department_id]);
        departmentName = deptResult.rows[0]?.name || null;
      }

      res.status(200).json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role_id: user.role_id,
          role_name: roleName,
          department_id: user.department_id,
          department_name: departmentName,
          is_active: user.is_active,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve profile',
        details: error.message 
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { full_name, email } = req.body;

      // Only allow updating name and email for profile
      const updateData = {};
      if (full_name) updateData.full_name = full_name;
      if (email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          error: 'At least one field (full_name or email) must be provided for update' 
        });
      }

      // If email is being updated, check if it already exists for another user
      if (updateData.email) {
        const existingUser = await User.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ 
            error: 'Email already in use by another user' 
          });
        }
      }

      const updatedUser = await User.update(userId, updateData);

      // Get role name
      const roleResult = await db.query('SELECT name FROM roles WHERE id = $1', [updatedUser.role_id]);
      const roleName = roleResult.rows[0]?.name || 'Unknown';

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          full_name: updatedUser.full_name,
          email: updatedUser.email,
          role_id: updatedUser.role_id,
          role_name: roleName,
          department_id: updatedUser.department_id,
          is_active: updatedUser.is_active,
          updated_at: updatedUser.updated_at
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        error: 'Failed to update profile',
        details: error.message 
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({ 
          error: 'Current password and new password are required' 
        });
      }

      // Get current user to verify current password
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      // Verify current password
      const isValidCurrentPassword = await User.comparePassword(current_password, user.password_hash);
      if (!isValidCurrentPassword) {
        return res.status(401).json({ 
          error: 'Current password is incorrect' 
        });
      }

      // Update password
      await User.update(userId, { password: new_password });

      res.status(200).json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ 
        error: 'Failed to change password',
        details: error.message 
      });
    }
  }

  // Forgot password (placeholder - implement with email service)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required' 
        });
      }

      // In a real implementation, you would:
      // 1. Check if user exists
      // 2. Generate reset token
      // 3. Send email with reset link
      // 4. Store token in database with expiration

      res.status(200).json({
        message: 'Password reset instructions sent to your email (implementation pending)'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ 
        error: 'Failed to process password reset request',
        details: error.message 
      });
    }
  }
}

module.exports = AuthController;