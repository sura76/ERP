const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.full_name = userData.full_name;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.role_id = userData.role_id;
    this.department_id = userData.department_id;
    this.is_active = userData.is_active;
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const query = `
        INSERT INTO users (full_name, email, password_hash, role_id, department_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, full_name, email, role_id, department_id, is_active, created_at
      `;

      const values = [
        userData.full_name,
        userData.email.toLowerCase(),
        hashedPassword,
        userData.role_id,
        userData.department_id || null,
        userData.is_active !== undefined ? userData.is_active : true
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await db.query(query, [email.toLowerCase()]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const query = 'SELECT id, full_name, email, role_id, department_id, is_active, created_at, updated_at FROM users WHERE id = $1';
      const result = await db.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  // Update user
  static async update(userId, updateData) {
    try {
      let query = 'UPDATE users SET ';
      const values = [];
      let paramCount = 1;
      const allowedFields = ['full_name', 'email', 'role_id', 'department_id', 'is_active'];

      const updateFields = [];

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(updateData[field]);
          paramCount++;
        }
      }

      if (updateData.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
        updateFields.push(`password_hash = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      query += updateFields.join(', ');
      query += ` WHERE id = $${paramCount} RETURNING id, full_name, email, role_id, department_id, is_active, updated_at`;
      values.push(userId);

      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user (soft delete by deactivating)
  static async deactivate(userId) {
    try {
      const query = 'UPDATE users SET is_active = false WHERE id = $1 RETURNING id';
      const result = await db.query(query, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return { success: true, userId: result.rows[0].id };
    } catch (error) {
      throw new Error(`Error deactivating user: ${error.message}`);
    }
  }

  // Get all users with pagination
  static async getAll(page = 1, limit = 10, filters = {}) {
    try {
      let query = 'SELECT id, full_name, email, role_id, department_id, is_active, created_at FROM users WHERE 1=1';
      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.active !== undefined) {
        query += ` AND is_active = $${paramCount}`;
        values.push(filters.active);
        paramCount++;
      }

      if (filters.role_id) {
        query += ` AND role_id = $${paramCount}`;
        values.push(filters.role_id);
        paramCount++;
      }

      if (filters.department_id) {
        query += ` AND department_id = $${paramCount}`;
        values.push(filters.department_id);
        paramCount++;
      }

      if (filters.search) {
        query += ` AND (full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
        values.push(`%${filters.search}%`);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, (page - 1) * limit);

      const result = await db.query(query, values);

      // Get total count for pagination
      const countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
      const countValues = [];
      let countParamCount = 1;

      if (filters.active !== undefined) {
        query += ` AND is_active = $${countParamCount}`;
        countValues.push(filters.active);
        countParamCount++;
      }

      if (filters.role_id) {
        query += ` AND role_id = $${countParamCount}`;
        countValues.push(filters.role_id);
        countParamCount++;
      }

      if (filters.department_id) {
        query += ` AND department_id = $${countParamCount}`;
        countValues.push(filters.department_id);
        countParamCount++;
      }

      if (filters.search) {
        query += ` AND (full_name ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
        countValues.push(`%${filters.search}%`);
        countParamCount++;
      }

      const countResult = await db.query(countQuery, countValues);

      return {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  // Compare password
  static async comparePassword(inputPassword, hashedPassword) {
    try {
      return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error comparing passwords: ${error.message}`);
    }
  }
}

module.exports = User;