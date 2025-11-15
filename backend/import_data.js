#!/usr/bin/env node

/**
 * Import employees data from public/employees.json to SQLite database
 * Maps employees to 7 companies based on department
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');
const JSON_FILE = path.join(PROJECT_ROOT, 'public', 'employees.json');
const DB_FILE = path.join(__dirname, 'employees.db');

function extractGenderFromPhoto(photoUrl) {
  if (!photoUrl) return 'unknown';
  if (photoUrl.includes('style]=male') || photoUrl.includes('style=male')) return 'male';
  if (photoUrl.includes('style]=female') || photoUrl.includes('style=female')) return 'female';
  return 'unknown';
}

async function importEmployees() {
  try {
    // Read JSON file
    console.log(`📖 Reading ${JSON_FILE}...`);
    const jsonData = fs.readFileSync(JSON_FILE, 'utf-8');
    const employees = JSON.parse(jsonData);
    
    console.log(`✓ Loaded ${employees.length} employees from JSON`);
    
    // Connect to database
    console.log(`🔌 Connecting to ${DB_FILE}...`);
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database,
    });
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    // Clear all existing employees (not admins or companies)
    await db.run('DELETE FROM employees');
    console.log('✓ Cleared existing employees');
    
    // Map company names to IDs (7 companies)
    const companyMap = {
      'Steel': 1,        // AFA Steel
      'steel': 1,
      'Trading': 2,      // AFA Trading
      'trading': 2,
      'Logistics': 3,    // AFA Logistics
      'logistics': 3,
      'Engineering': 4,  // AFA Engineering
      'engineering': 4,
      'Technology': 5,   // AFA Technology
      'technology': 5,
      'Finance': 6,      // AFA Finance
      'finance': 6,
      'HR': 7,          // AFA HR
      'hr': 7,
    };
    
    // Insert employees
    let inserted = 0;
    let failed = 0;
    
    for (const emp of employees) {
      try {
        // Extract company ID from department
        let companyId = null;
        const dept = emp.department?.en || emp.dept_en || '';
        for (const [key, id] of Object.entries(companyMap)) {
          if (dept.includes(key)) {
            companyId = id;
            break;
          }
        }
        
        const nameEn = emp.name?.en || '';
        const naFa = emp.name?.fa || '';
        const titleEn = emp.title?.en || '';
        const titleFa = emp.title?.fa || '';
        const deptEn = emp.department?.en || '';
        const deptFa = emp.department?.fa || '';
        const extension = emp.extension || '';
        const mobile = emp.mobile || '';
        const email = emp.email || '';
        const photo = emp.photo || '';
        const icon = extractGenderFromPhoto(photo);
        const visible = 1; // All imported employees visible by default
        
        // Check required fields
        if (!extension || !nameEn || !naFa) {
          console.warn(`⚠ Skipping employee: missing required fields`);
          failed++;
          continue;
        }
        
        // Insert
        await db.run(
          `INSERT INTO employees 
           (company_id, name_en, name_fa, title_en, title_fa, dept_en, dept_fa, 
            extension, mobile, email, photo, icon, visible)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [companyId, nameEn, naFa, titleEn, titleFa, deptEn, deptFa,
           extension, mobile, email, photo, icon, visible]
        );
        
        inserted++;
        if (inserted % 50 === 0) {
          console.log(`  ↳ Processed ${inserted} employees...`);
        }
        
      } catch (err) {
        console.error(`❌ Error importing employee: ${err.message}`);
        failed++;
      }
    }
    
    // Get total count
    const result = await db.get('SELECT COUNT(*) as count FROM employees');
    const total = result.count;
    
    // Show summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Import complete!');
    console.log(`  ✓ Inserted: ${inserted} employees`);
    console.log(`  ⚠ Failed: ${failed} employees`);
    console.log(`  📊 Total in database: ${total}`);
    console.log(`  🏢 Companies mapped: 7`);
    console.log('='.repeat(50));
    
    await db.close();
    return true;
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    return false;
  }
}

// Run import
importEmployees().then(success => {
  process.exit(success ? 0 : 1);
});
