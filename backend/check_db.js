import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './employees.db',
  driver: sqlite3.Database
});

try {
  // Add missing columns if they don't exist
  console.log('اضافه کردن ستون‌های مفقود...');
  
  await db.exec(`ALTER TABLE employees ADD COLUMN show_mobile INTEGER DEFAULT 1;`).catch(() => {
    console.log('ستون show_mobile قبلاً وجود دارد یا خطا');
  });
  
  await db.exec(`ALTER TABLE employees ADD COLUMN show_email INTEGER DEFAULT 1;`).catch(() => {
    console.log('ستون show_email قبلاً وجود دارد یا خطا');
  });
  
  // Check columns
  const employees = await db.all('SELECT id, name_en, show_mobile, show_email FROM employees LIMIT 5');
  console.log('✅ بررسی database:');
  console.log(employees);
  
} catch (err) {
  console.error('خطا:', err);
}

await db.close();
