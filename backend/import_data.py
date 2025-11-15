#!/usr/bin/env python3
"""
Import employees data from public/employees.json to SQLite database
"""

import json
import sqlite3
import sys
from pathlib import Path

# Paths
BACKEND_DIR = Path(__file__).parent
PROJECT_ROOT = BACKEND_DIR.parent
JSON_FILE = PROJECT_ROOT / "public" / "employees.json"
DB_FILE = BACKEND_DIR / "employees.db"

def extract_gender_from_photo(photo_url):
    """Extract gender from photo URL if available"""
    if not photo_url:
        return "unknown"
    if "style]=male" in photo_url or "style=male" in photo_url:
        return "male"
    if "style]=female" in photo_url or "style=female" in photo_url:
        return "female"
    return "unknown"

def import_employees():
    """Import employees from JSON to SQLite"""
    try:
        # Read JSON file
        print(f"📖 Reading {JSON_FILE}...")
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            employees = json.load(f)
        
        print(f"✓ Loaded {len(employees)} employees from JSON")
        
        # Connect to database
        print(f"🔌 Connecting to {DB_FILE}...")
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        # Clear existing data (except sample data we want to keep)
        cursor.execute('DELETE FROM employees WHERE id NOT IN (SELECT id FROM employees LIMIT 0)')
        
        # Insert employees
        inserted = 0
        failed = 0
        
        for emp in employees:
            try:
                # Extract data
                emp_id = emp.get('id')
                name_en = emp.get('name', {}).get('en', '')
                name_fa = emp.get('name', {}).get('fa', '')
                title_en = emp.get('title', {}).get('en', '')
                title_fa = emp.get('title', {}).get('fa', '')
                dept_en = emp.get('department', {}).get('en', '')
                dept_fa = emp.get('department', {}).get('fa', '')
                extension = emp.get('extension', '')
                mobile = emp.get('mobile', '')
                email = emp.get('email', '')
                photo = emp.get('photo', '')
                icon = extract_gender_from_photo(photo)
                visible = 1  # All imported employees visible by default
                
                # Check required fields
                if not extension or not name_en or not name_fa:
                    print(f"⚠ Skipping employee {emp_id}: missing required fields")
                    failed += 1
                    continue
                
                # Insert or replace
                cursor.execute('''
                    INSERT OR REPLACE INTO employees 
                    (id, name_en, name_fa, title_en, title_fa, dept_en, dept_fa, 
                     extension, mobile, email, photo, icon, visible)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (emp_id, name_en, name_fa, title_en, title_fa, dept_en, dept_fa,
                      extension, mobile, email, photo, icon, visible))
                
                inserted += 1
                if inserted % 50 == 0:
                    print(f"  ↳ Processed {inserted} employees...")
                
            except Exception as e:
                print(f"❌ Error importing employee {emp.get('id')}: {str(e)}")
                failed += 1
                continue
        
        # Commit changes
        conn.commit()
        
        # Show summary
        print("\n" + "="*50)
        print(f"✅ Import complete!")
        print(f"  ✓ Inserted: {inserted} employees")
        print(f"  ⚠ Failed: {failed} employees")
        print(f"  📊 Total in database: {cursor.execute('SELECT COUNT(*) FROM employees').fetchone()[0]}")
        print("="*50)
        
        conn.close()
        return True
        
    except FileNotFoundError:
        print(f"❌ Error: {JSON_FILE} not found")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {str(e)}")
        return False
    except sqlite3.Error as e:
        print(f"❌ Database error: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = import_employees()
    sys.exit(0 if success else 1)
