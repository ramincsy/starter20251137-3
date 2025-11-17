import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = join(__dirname, 'employees.db');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 60 * 1000 }, // 30 minutes
  })
);

// Database connection
let db = null;

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware for Super Admin only
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }
  next();
};

// Helper function to log activity
const logActivity = async (
  admin_id,
  admin_username,
  action_type,
  entity_type,
  entity_id,
  entity_name,
  description,
  old_value = null,
  new_value = null,
  status = 'success'
) => {
  try {
    await db.run(
      `INSERT INTO activity_logs (admin_id, admin_username, action_type, entity_type, entity_id, entity_name, description, old_value, new_value, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [admin_id, admin_username, action_type, entity_type, entity_id, entity_name, description, old_value, new_value, status]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

async function initializeDatabase() {
  try {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');

    // Create Companies table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_en TEXT NOT NULL UNIQUE,
        name_fa TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Admins table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'admin',
        company_id INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
      );
    `);

    // Create Employees table (updated with company_id)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER,
        name_en TEXT NOT NULL,
        name_fa TEXT NOT NULL,
        title_en TEXT,
        title_fa TEXT,
        dept_en TEXT,
        dept_fa TEXT,
        extension TEXT NOT NULL,
        mobile TEXT,
        email TEXT,
        photo TEXT,
        icon TEXT DEFAULT 'unknown',
        visible INTEGER DEFAULT 1,
        show_mobile INTEGER DEFAULT 1,
        show_email INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      );
    `);

    // Create Activity Log table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        admin_username TEXT NOT NULL,
        action_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id INTEGER,
        entity_name TEXT,
        description TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        status TEXT DEFAULT 'success',
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
      );
    `);

    // Check if admins table is empty, if so insert Super Admin
    const adminCount = await db.get('SELECT COUNT(*) as count FROM admins');
    if (adminCount.count === 0) {
      const hashedPassword = await bcryptjs.hash('admin123', 10);
      await db.run(
        `INSERT INTO admins (username, password_hash, email, role, is_active) 
         VALUES (?, ?, ?, ?, ?)`,
        ['admin', hashedPassword, 'admin@system.local', 'super_admin', 1]
      );
      console.log('✓ Super Admin created (username: admin, password: admin123)');
    }

    // Check if companies table is empty
    const companyCount = await db.get('SELECT COUNT(*) as count FROM companies');
    if (companyCount.count === 0) {
      // Insert 7 companies
      const companies = [
        { name_en: 'AFA Steel', name_fa: 'فولاد آفا' },
        { name_en: 'AFA Trading', name_fa: 'تجارت آفا' },
        { name_en: 'AFA Logistics', name_fa: 'لجستیک آفا' },
        { name_en: 'AFA Engineering', name_fa: 'مهندسی آفا' },
        { name_en: 'AFA Technology', name_fa: 'فناوری آفا' },
        { name_en: 'AFA Finance', name_fa: 'مالی آفا' },
        { name_en: 'AFA HR', name_fa: 'منابع انسانی آفا' },
      ];

      for (const company of companies) {
        await db.run(
          `INSERT INTO companies (name_en, name_fa) VALUES (?, ?)`,
          [company.name_en, company.name_fa]
        );
      }
      console.log('✓ 7 Companies created');
    }

    console.log('✓ Database initialized successfully');

    // Migrate: Add missing columns if they don't exist
    try {
      await db.exec('ALTER TABLE employees ADD COLUMN show_mobile INTEGER DEFAULT 1;').catch(() => {});
      await db.exec('ALTER TABLE employees ADD COLUMN show_email INTEGER DEFAULT 1;').catch(() => {});
      console.log('✓ Database columns migrated');
    } catch (err) {
      console.log('ℹ Columns may already exist:', err.message);
    }

  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
    process.exit(1);
  }
}


// ============ AUTHENTICATION ROUTES ============

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password required' });
    }

    const admin = await db.get(
      'SELECT * FROM admins WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // verify password
    const passwordMatch = await bcryptjs.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const admin = await db.get('SELECT * FROM admins WHERE id = ?', [
      req.user.id,
    ]);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      company_id: admin.company_id,
    });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Failed to get auth info' });
  }
});

// POST /api/auth/logout (Optional - Client-side handles token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ============ COMPANIES ROUTES ============

// GET all companies
app.get('/api/companies', authenticateToken, async (req, res) => {
  try {
    const companies = await db.all('SELECT * FROM companies ORDER BY id ASC');
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET single company
app.get('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    const company = await db.get('SELECT * FROM companies WHERE id = ?', [
      req.params.id,
    ]);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error('Error fetching company:', err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// POST create company (Super Admin only)
app.post('/api/companies', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name_en, name_fa } = req.body;

    if (!name_en || !name_fa) {
      return res.status(400).json({ error: 'name_en and name_fa required' });
    }

    const result = await db.run(
      'INSERT INTO companies (name_en, name_fa) VALUES (?, ?)',
      [name_en, name_fa]
    );

    res.status(201).json({
      id: result.lastID,
      name_en,
      name_fa,
    });
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// PUT update company (Super Admin only)
app.put(
  '/api/companies/:id',
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { name_en, name_fa } = req.body;

      if (!name_en || !name_fa) {
        return res
          .status(400)
          .json({ error: 'name_en and name_fa required' });
      }

      await db.run(
        'UPDATE companies SET name_en = ?, name_fa = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name_en, name_fa, req.params.id]
      );

      const company = await db.get('SELECT * FROM companies WHERE id = ?', [
        req.params.id,
      ]);

      res.json(company);
    } catch (err) {
      console.error('Error updating company:', err);
      res.status(500).json({ error: 'Failed to update company' });
    }
  }
);

// DELETE company (Super Admin only)
app.delete(
  '/api/companies/:id',
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      await db.run('DELETE FROM companies WHERE id = ?', [req.params.id]);
      res.json({ message: 'Company deleted' });
    } catch (err) {
      console.error('Error deleting company:', err);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  }
);

// ============ EMPLOYEES ROUTES ============

// GET all employees (Public - only visible)
app.get('/api/employees', async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT e.id, e.company_id, c.name_en as company_name_en, c.name_fa as company_name_fa, e.name_en, e.name_fa, e.title_en, e.title_fa, 
            e.dept_en, e.dept_fa, e.extension, e.mobile, e.email, e.photo, e.icon, e.visible, e.show_mobile, e.show_email 
       FROM employees e
       LEFT JOIN companies c ON e.company_id = c.id
       WHERE e.visible = 1 
       ORDER BY e.id ASC`
    );

      const employees = rows.map((row) => ({
      id: row.id,
      company_id: row.company_id,
        company: { en: row.company_name_en || '', fa: row.company_name_fa || '' },
      name: { en: row.name_en || '', fa: row.name_fa || '' },
      title: { en: row.title_en || '', fa: row.title_fa || '' },
      department: { en: row.dept_en || '', fa: row.dept_fa || '' },
      extension: row.extension || '',
      mobile: row.mobile || '',
      email: row.email || '',
      photo: row.photo || '',
      gender: row.icon || 'unknown',
      visible: row.visible,
      show_mobile: typeof row.show_mobile === 'number' ? row.show_mobile : (row.show_mobile ? Number(row.show_mobile) : 1),
      show_email: typeof row.show_email === 'number' ? row.show_email : (row.show_email ? Number(row.show_email) : 1),
    }));

    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET all employees for admin (including hidden)
app.get('/api/admin/employees', authenticateToken, async (req, res) => {
  try {
    const { company_id } = req.query;
    let query = `SELECT e.id, e.company_id, c.name_en as company_name_en, c.name_fa as company_name_fa, e.name_en, e.name_fa, e.title_en, e.title_fa, 
    e.dept_en, e.dept_fa, e.extension, e.mobile, e.email, e.photo, e.icon, e.visible, e.show_mobile, e.show_email 
  FROM employees e
  LEFT JOIN companies c ON e.company_id = c.id`;
    let params = [];

    if (company_id) {
      query += ' WHERE e.company_id = ?';
      params.push(company_id);
    }

    query += ' ORDER BY e.id ASC';

    const rows = await db.all(query, params);

    const employees = rows.map((row) => ({
      id: row.id,
      company_id: row.company_id,
      company: { en: row.company_name_en || '', fa: row.company_name_fa || '' },
      name: { en: row.name_en || '', fa: row.name_fa || '' },
      title: { en: row.title_en || '', fa: row.title_fa || '' },
      department: { en: row.dept_en || '', fa: row.dept_fa || '' },
      extension: row.extension || '',
      mobile: row.mobile || '',
      email: row.email || '',
      photo: row.photo || '',
      gender: row.icon || 'unknown',
      visible: row.visible,
      show_mobile: typeof row.show_mobile === 'number' ? row.show_mobile : (row.show_mobile ? Number(row.show_mobile) : 1),
      show_email: typeof row.show_email === 'number' ? row.show_email : (row.show_email ? Number(row.show_email) : 1),
    }));

    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET single employee (Public - only visible)
app.get('/api/employees/:id', async (req, res) => {
  try {
    const row = await db.get(
      `SELECT e.id, e.company_id, c.name_en as company_name_en, c.name_fa as company_name_fa, e.name_en, e.name_fa, e.title_en, e.title_fa, 
              e.dept_en, e.dept_fa, e.extension, e.mobile, e.email, e.photo, e.icon, e.visible, e.show_mobile, e.show_email 
       FROM employees e
       LEFT JOIN companies c ON e.company_id = c.id
       WHERE e.id = ? AND e.visible = 1`,
      [req.params.id]
    );

    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = {
      id: row.id,
      company_id: row.company_id,
      company_name: row.company_name,
      name: { en: row.name_en || '', fa: row.name_fa || '' },
      title: { en: row.title_en || '', fa: row.title_fa || '' },
      department: { en: row.dept_en || '', fa: row.dept_fa || '' },
      extension: row.extension || '',
      mobile: row.mobile || '',
      email: row.email || '',
      photo: row.photo || '',
      gender: row.icon || 'unknown',
      visible: row.visible,
      show_mobile: typeof row.show_mobile === 'number' ? row.show_mobile : (row.show_mobile ? Number(row.show_mobile) : 1),
      show_email: typeof row.show_email === 'number' ? row.show_email : (row.show_email ? Number(row.show_email) : 1),
    };

    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// POST create employee
app.post('/api/admin/employees', authenticateToken, async (req, res) => {
  try {
    const {
      company_id,
      name_en,
      name_fa,
      title_en,
      title_fa,
      dept_en,
      dept_fa,
      extension,
      mobile,
      email,
      photo,
      icon,
    } = req.body;

    if (!name_en || !name_fa || !extension) {
      return res
        .status(400)
        .json({ error: 'name_en, name_fa, and extension required' });
    }

    const result = await db.run(
      `INSERT INTO employees (company_id, name_en, name_fa, title_en, title_fa, dept_en, dept_fa, extension, mobile, email, photo, icon, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        company_id,
        name_en,
        name_fa,
        title_en,
        title_fa,
        dept_en,
        dept_fa,
        extension,
        mobile,
        email,
        photo,
        icon || 'unknown',
      ]
    );

    // Log activity
    await logActivity(
      req.user.id,
      req.user.username,
      'CREATE',
      'employee',
      result.lastID,
      name_fa || name_en,
      `کاربر "${name_fa || name_en}" اضافه شد`
    );

    res.status(201).json({
      id: result.lastID,
      company_id,
      name_en,
      name_fa,
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT update employee
app.put('/api/admin/employees/:id', authenticateToken, async (req, res) => {
  try {
    const {
      company_id,
      name_en,
      name_fa,
      title_en,
      title_fa,
      dept_en,
      dept_fa,
      extension,
      mobile,
      email,
      photo,
      icon,
    } = req.body;

    await db.run(
      `UPDATE employees 
       SET company_id = ?, name_en = ?, name_fa = ?, title_en = ?, title_fa = ?, 
           dept_en = ?, dept_fa = ?, extension = ?, mobile = ?, email = ?, photo = ?, 
           icon = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        company_id,
        name_en,
        name_fa,
        title_en,
        title_fa,
        dept_en,
        dept_fa,
        extension,
        mobile,
        email,
        photo,
        icon || 'unknown',
        req.params.id,
      ]
    );

    const employee = await db.get('SELECT * FROM employees WHERE id = ?', [
      req.params.id,
    ]);

    res.json(employee);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE employee
app.delete('/api/admin/employees/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await db.get(
      'SELECT name_fa, name_en FROM employees WHERE id = ?',
      [req.params.id]
    );

    await db.run('DELETE FROM employees WHERE id = ?', [req.params.id]);

    // Log activity
    await logActivity(
      req.user.id,
      req.user.username,
      'DELETE',
      'employee',
      parseInt(req.params.id),
      employee?.name_fa || employee?.name_en,
      `کاربر "${employee?.name_fa || employee?.name_en}" حذف شد`
    );

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// PATCH toggle employee visibility
app.patch(
  '/api/admin/employees/:id/visibility',
  authenticateToken,
  async (req, res) => {
    try {
      const { visible } = req.body;

      if (typeof visible !== 'number') {
        return res
          .status(400)
          .json({ error: 'visible must be 0 or 1' });
      }

      const employee = await db.get(
        'SELECT name_fa, name_en, visible FROM employees WHERE id = ?',
        [req.params.id]
      );

      await db.run(
        'UPDATE employees SET visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [visible, req.params.id]
      );

      // Log activity
      const statusText = visible === 1 ? 'نمایش داده شد' : 'مخفی شد';
      await logActivity(
        req.user.id,
        req.user.username,
        'TOGGLE_VISIBILITY',
        'employee',
        parseInt(req.params.id),
        employee?.name_fa || employee?.name_en,
        `کاربر "${employee?.name_fa || employee?.name_en}" ${statusText}`
      );

      const updatedEmployee = await db.get('SELECT * FROM employees WHERE id = ?', [
        req.params.id,
      ]);

      res.json(updatedEmployee);
    } catch (err) {
      console.error('Error updating visibility:', err);
      res.status(500).json({ error: 'Failed to update visibility' });
    }
  }
);

// PATCH toggle employee mobile visibility
app.patch(
  '/api/admin/employees/:id/toggle-mobile',
  authenticateToken,
  async (req, res) => {
    try {
      const { show_mobile } = req.body;

      if (typeof show_mobile !== 'number' || ![0, 1].includes(show_mobile)) {
        return res
          .status(400)
          .json({ error: 'show_mobile must be 0 or 1' });
      }

      const employee = await db.get(
        'SELECT name_fa, name_en FROM employees WHERE id = ?',
        [req.params.id]
      );

      await db.run(
        'UPDATE employees SET show_mobile = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [show_mobile, req.params.id]
      );

      // Log activity
      const statusText = show_mobile === 1 ? 'نمایش داده شد' : 'مخفی شد';
      await logActivity(
        req.user.id,
        req.user.username,
        'UPDATE',
        'employee',
        parseInt(req.params.id),
        employee?.name_fa || employee?.name_en,
        `موبایل کاربر "${employee?.name_fa || employee?.name_en}" ${statusText}`
      );

      const updatedEmployee = await db.get('SELECT * FROM employees WHERE id = ?', [
        req.params.id,
      ]);

      res.json(updatedEmployee);
    } catch (err) {
      console.error('Error toggling mobile visibility:', err);
      res.status(500).json({ error: 'Failed to toggle mobile visibility' });
    }
  }
);

// PATCH toggle employee email visibility
app.patch(
  '/api/admin/employees/:id/toggle-email',
  authenticateToken,
  async (req, res) => {
    try {
      const { show_email } = req.body;

      if (typeof show_email !== 'number' || ![0, 1].includes(show_email)) {
        return res
          .status(400)
          .json({ error: 'show_email must be 0 or 1' });
      }

      const employee = await db.get(
        'SELECT name_fa, name_en FROM employees WHERE id = ?',
        [req.params.id]
      );

      await db.run(
        'UPDATE employees SET show_email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [show_email, req.params.id]
      );

      // Log activity
      const statusText = show_email === 1 ? 'نمایش داده شد' : 'مخفی شد';
      await logActivity(
        req.user.id,
        req.user.username,
        'UPDATE',
        'employee',
        parseInt(req.params.id),
        employee?.name_fa || employee?.name_en,
        `ایمیل کاربر "${employee?.name_fa || employee?.name_en}" ${statusText}`
      );

      const updatedEmployee = await db.get('SELECT * FROM employees WHERE id = ?', [
        req.params.id,
      ]);

      res.json(updatedEmployee);
    } catch (err) {
      console.error('Error toggling email visibility:', err);
      res.status(500).json({ error: 'Failed to toggle email visibility' });
    }
  }
);

// ============ ADMINS MANAGEMENT ROUTES ============

// GET all admins (Super Admin only)
app.get('/api/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await db.all('SELECT id, username, email, role, is_active, created_at FROM admins ORDER BY id ASC');
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// POST create admin (Super Admin only)
app.post('/api/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, email, role = 'admin', company_id = null } = req.body;

    if (!username || !password || password.length < 8) {
      return res.status(400).json({ error: 'username and password (min 8 chars) are required' });
    }

    // Check unique username
    const existing = await db.get('SELECT id FROM admins WHERE username = ?', [username]);
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const password_hash = await bcryptjs.hash(password, 10);

    const result = await db.run(
      'INSERT INTO admins (username, password_hash, email, role, company_id, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [username, password_hash, email || null, role, company_id || null]
    );

    const admin = await db.get('SELECT id, username, email, role, is_active, created_at FROM admins WHERE id = ?', [result.lastID]);

    // Log activity
    await logActivity(
      req.user.id,
      req.user.username,
      'CREATE',
      'admin',
      admin.id,
      admin.username,
      `ادمین جدید "${username}" اضافه شد`
    );

    res.status(201).json(admin);
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// DELETE admin (Super Admin only)
app.delete('/api/admins/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deleting self
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const admin = await db.get('SELECT username FROM admins WHERE id = ?', [id]);

    await db.run('DELETE FROM admins WHERE id = ?', [id]);

    // Log activity
    await logActivity(
      req.user.id,
      req.user.username,
      'DELETE',
      'admin',
      parseInt(id),
      admin?.username,
      `ادمین "${admin?.username}" حذف شد`
    );

    res.json({ message: 'Admin deleted' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});


// ============ ACTIVITY LOG ROUTES ============

// GET all activity logs
app.get('/api/activity-logs', authenticateToken, async (req, res) => {
  try {
    const { action_type, entity_type, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    let params = [];

    if (action_type) {
      query += ' AND action_type = ?';
      params.push(action_type);
    }

    if (entity_type) {
      query += ' AND entity_type = ?';
      params.push(entity_type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const logs = await db.all(query, params);
    const totalResult = await db.get('SELECT COUNT(*) as count FROM activity_logs WHERE 1=1');
    
    res.json({
      data: logs,
      total: totalResult.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// GET activity logs for today
app.get('/api/activity-logs/stats/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const logs = await db.all(
      `SELECT action_type, COUNT(*) as count FROM activity_logs 
       WHERE DATE(created_at) = ? 
       GROUP BY action_type`,
      [today]
    );

    res.json({
      date: today,
      stats: logs
    });
  } catch (err) {
    console.error('Error fetching today stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET recent activity logs (last N)
app.get('/api/activity-logs/recent/:limit', authenticateToken, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.params.limit) || 10, 100);
    const logs = await db.all(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    res.json(logs);
  } catch (err) {
    console.error('Error fetching recent logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});


// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Database: ${DB_PATH}`);
    console.log(`✓ API endpoint: http://localhost:${PORT}/api/employees`);
  });
});
