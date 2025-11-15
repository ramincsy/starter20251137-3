-- Create Database
CREATE DATABASE IF NOT EXISTS contact_directory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contact_directory;

-- Create Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_fa VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  title_fa VARCHAR(255),
  dept_en VARCHAR(255),
  dept_fa VARCHAR(255),
  extension VARCHAR(50) NOT NULL,
  mobile VARCHAR(50),
  email VARCHAR(255),
  photo TEXT,
  icon VARCHAR(50) DEFAULT 'unknown' COMMENT 'male, female, unknown',
  visible TINYINT(1) DEFAULT 1 COMMENT '1=visible, 0=hidden',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_visible (visible),
  INDEX idx_extension (extension),
  FULLTEXT INDEX ft_name (name_en, name_fa, dept_en, dept_fa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO employees (name_en, name_fa, title_en, title_fa, dept_en, dept_fa, extension, mobile, email, photo, icon, visible) VALUES
('Sajjad Ebrahimi', 'سجاد ابراهیمی', 'Exchange Specialist', 'کارشناس صرافی', 'Exchange', 'صرافی', '1103', '****', 's.ebrahimi@local.afasteel.com', '', 'male', 1),
('Samira Daneshpouran', 'سمیرا دانشپوران', 'Exchange Specialist', 'کارشناس صرافی', 'Exchange', 'صرافی', '1107', '****', 'sa.daneshpouran@local.afasteel.com', '', 'female', 1),
('Farnaz Mohabbi', 'فرناز محبی', 'Exchange Specialist', 'کارشناس صرافی', 'Exchange', 'صرافی', '1109', '****', 'f.mohabbi@local.afasteel.com', '', 'female', 1),
('Houshang Mardani', 'هوشنگ مردانی', 'Exchange Specialist', 'کارشناس صرافی', 'Exchange', 'صرافی', '1110', '****', 'h.mardani@local.afasteel.com', '', 'male', 1),
('Ra\'na Abtahi', 'رعنا ابطحی', 'Exchange Specialist', 'کارشناس صرافی', 'Exchange', 'صرافی', '1116', '****', 'r.abtahi@local.afasteel.com', '', 'female', 1),
('Fatemeh Razmjou', 'فاطمه رزمجو', 'Manager', 'مدیر', 'Admin', 'اداری', '2203', '****', 'f.razmjou@local.afasteel.com', '', 'female', 1);

-- Environment Configuration
SET @DB_HOST = 'localhost';
SET @DB_PORT = 3306;
SET @DB_USER = 'root';
SET @DB_PASSWORD = '';
SET @DB_NAME = 'contact_directory';
SET @PORT = 3001;
SET @NODE_ENV = 'development';

-- Server and API Information
SELECT '✓ Database connected successfully' AS message
UNION ALL
SELECT CONCAT('✓ Server running on http://', @DB_HOST, ':', @PORT) AS message
UNION ALL
SELECT CONCAT('✓ API endpoint: http://', @DB_HOST, ':', @PORT, '/api/employees') AS message;
