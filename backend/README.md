# Contact Directory Backend (SQLite)

بک‌اند Express.js با SQLite — ساده‌ترین و سریع‌ترین راه برای Windows و Linux!

## 🎉 نیاز به نصب دیتابیس ندارید!

SQLite یک فایل ساده است. فقط اجرا کنید و دیتابیس خودکار ایجاد می‌شود.

## نصب و راه‌اندازی Windows

### 1. نصب Node.js
دانلود از: https://nodejs.org/

### 2. نصب Dependencies
در پوشه `backend`:

```bash
npm install
```

### 3. اجرای Server
```bash
npm start
```

**فقط همین!** باید بخش زیر را ببینید:
```
✓ Database initialized successfully
✓ Server running on http://localhost:3001
✓ Database: employees.db
✓ API endpoint: http://localhost:3001/api/employees
```

### 4. تست API
باز کنید مرورگر و برید به: `http://localhost:3001/api/health`

باید بخش زیر را ببینید:
```
✓ Database connected successfully
✓ Server running on http://localhost:3001
✓ API endpoint: http://localhost:3001/api/employees
```

### 7. تست API
باز کنید مرورگر و برید به: `http://localhost:3001/api/health`

باید نتیجه `{"status":"Server is running"}` را ببینید.

---

## API Endpoints

### GET /api/employees
لیست تمام کارمندان قابل نمایش:

```
GET http://localhost:3001/api/employees
```

پاسخ:
```json
[
  {
    "id": 1,
    "name": {"en": "Sajjad Ebrahimi", "fa": "سجاد ابراهیمی"},
    "title": {"en": "Exchange Specialist", "fa": "کارشناس صرافی"},
    "department": {"en": "Exchange", "fa": "صرافی"},
    "extension": "1103",
    "mobile": "****",
    "email": "s.ebrahimi@local.afasteel.com",
    "photo": "",
    "gender": "male"
  }
]
```

### GET /api/employees/:id
جزئیات یک کارمند:

```
GET http://localhost:3001/api/employees/1
```

### GET /api/health
بررسی وضعیت سرور:

```
GET http://localhost:3001/api/health
```

---

## راه‌اندازی روی Linux

### 1. نصب Node.js و npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. نصب MySQL Server
```bash
sudo apt-get install -y mysql-server
```

### 3. ساخت دیتابیس
```bash
mysql -u root -p < database.sql
```

### 4. نصب Dependencies
```bash
cd backend
npm install --production
```

### 5. تنظیم Environment Variables
```bash
cp .env.example .env
nano .env
```

تنظیم مقادیر:
```
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=your_secure_password
DB_NAME=contact_directory
PORT=3001
NODE_ENV=production
```

### 6. راه‌اندازی با systemd
فایل service ایجاد کنید:

```bash
sudo nano /etc/systemd/system/contact-backend.service
```

محتوا:
```ini
[Unit]
Description=Contact Directory Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

فعال‌سازی:
```bash
sudo systemctl daemon-reload
sudo systemctl enable contact-backend
sudo systemctl start contact-backend
sudo systemctl status contact-backend
```

### 7. تنظیم Reverse Proxy (Nginx)
```bash
sudo nano /etc/nginx/sites-available/contact-backend
```

محتوا:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعال‌سازی:
```bash
sudo ln -s /etc/nginx/sites-available/contact-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Troubleshooting

### خطای "Cannot find module 'mysql2'"
```bash
npm install
```

### خطای "Database connection failed"
- مطمئن شوید MySQL اجرا شده است
- مقادیر `.env` را بررسی کنید
- پسورد دیتابیس را صحیح وارد کنید

### خطای "CORS Error"
- مطمئن شوید بک‌اند در حال اجرا است
- `VITE_API_URL` در `.env.local` فرانت‌اند را بررسی کنید

---

## نوت‌ها

- این بک‌اند برای Windows و Linux سازگار است
- در Windows، اطمینان حاصل کنید MySQL Service اجرا شده است
- در Linux، از systemd برای مدیریت سرویس استفاده کنید
- برای پروداکشن، از HTTPS استفاده کنید
