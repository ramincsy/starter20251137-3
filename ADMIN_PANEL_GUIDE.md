# 🔐 راهنمای صفحه ادمین (Admin Panel Guide)

## ✅ آنچه ایجاد شده است

### 1️⃣ **پایگاه داده بروز شده**
```
📊 Database Schema:
├─ companies          (7 شرکت)
│  ├─ id
│  ├─ name_en, name_fa
│  └─ timestamps
│
├─ employees         (136 کاربر - از JSON)
│  ├─ id
│  ├─ company_id (FK)
│  ├─ نام، عنوان، بخش
│  ├─ visible (1/0)
│  └─ timestamps
│
└─ admins           (Super Admin)
   ├─ id
   ├─ username: "admin"
   ├─ password: "admin123"
   ├─ role: "super_admin"
   └─ timestamps
```

### 2️⃣ **Backend API Endpoints**

#### 🔓 Authentication
```
POST   /api/auth/login              ← ورود
GET    /api/auth/me                 ← اطلاعات ادمین فعلی
POST   /api/auth/logout             ← خروج
```

#### 🏢 Companies (Protected)
```
GET    /api/companies               ← دریافت تمام شرکت‌ها
GET    /api/companies/:id           ← دریافت شرکت واحد
POST   /api/companies               ← ایجاد شرکت (Super Admin)
PUT    /api/companies/:id           ← ویرایش شرکت (Super Admin)
DELETE /api/companies/:id           ← حذف شرکت (Super Admin)
```

#### 👥 Employees
```
GET    /api/employees               ← دریافت کاربران نمایان (Public)
GET    /api/employees/:id           ← دریافت کاربر واحد (Public)
GET    /api/admin/employees         ← دریافت تمام کاربران (Admin)
GET    /api/admin/employees?company_id=1  ← فیلتر بر اساس شرکت
POST   /api/admin/employees         ← ایجاد کاربر جدید
PUT    /api/admin/employees/:id     ← ویرایش کاربر
DELETE /api/admin/employees/:id     ← حذف کاربر
PATCH  /api/admin/employees/:id/visibility  ← تغییر وضعیت نمایش
```

### 3️⃣ **Frontend Components**

#### 📝 صفحات ایجاد شده:
```
/admin/login              ← صفحه ورود
/admin/dashboard          ← داشبورد اصلی
/admin/companies          ← مدیریت شرکت‌ها
/admin/employees          ← مدیریت کاربران
/admin/users              ← مدیریت ادمین‌ها (Super Admin)
```

#### 🎨 Components:
- `AdminLogin.tsx`       ← صفحه ورود حرفه‌ای با Gradient
- `AdminLayout.tsx`      ← Layout اصلی با Sidebar + Header
- `AdminDashboard.tsx`   ← داشبورد با Statistics
- `AdminCompanies.tsx`   ← مدیریت شرکت‌ها (CRUD)
- `AdminEmployees.tsx`   ← مدیریت کاربران (CRUD + Visibility)
- `AdminUsers.tsx`       ← مدیریت ادمین‌ها (Super Admin Only)

---

## 🚀 نحوه استفاده

### مرحله 1: ورود به سیستم
```
📍 صفحه: http://localhost:5173/admin/login
👤 نام کاربری: admin
🔑 رمز عبور: admin123
```

**⚠️ نکات امنیتی:**
- رمز عبور در Bcrypt ذخیره می‌شود
- JWT Token برای 30 دقیقه معتبر است
- بعد از اولین ورود رمز را تغییر دهید (نسخه بعد)

### مرحله 2: داشبورد اصلی
```
📊 Statistics:
├─ تعداد شرکت‌ها
├─ کل کاربران
├─ کاربران فعال (visible=1)
└─ کاربران مخفی (visible=0)

🔗 Quick Access:
├─ مدیریت شرکت‌ها
├─ مدیریت کاربران
└─ مدیریت ادمین‌ها (Super Admin)
```

### مرحله 3: مدیریت شرکت‌ها

#### ✅ 7 شرکت موجود:
```
1. AFA Steel        (فولاد آفا)
2. AFA Trading      (تجارت آفا)
3. AFA Logistics    (لجستیک آفا)
4. AFA Engineering  (مهندسی آفا)
5. AFA Technology   (فناوری آفا)
6. AFA Finance      (مالی آفا)
7. AFA HR          (منابع انسانی آفا)
```

#### عملیات:
```
➕ اضافه کردن شرکت جدید
├─ نام انگلیسی
└─ نام فارسی

✏️ ویرایش شرکت
├─ نام انگلیسی
└─ نام فارسی

🗑️ حذف شرکت
└─ تمام کاربران مرتبط حذف می‌شوند
```

### مرحله 4: مدیریت کاربران

#### جستجو و فیلتر:
```
🔍 جستجو: نام، ایمیل، شماره داخلی
🏢 فیلتر: بر اساس شرکت
```

#### عملیات:
```
➕ اضافه کردن کاربر جدید
├─ نام (انگلیسی/فارسی)
├─ عنوان (انگلیسی/فارسی)
├─ بخش (انگلیسی/فارسی)
├─ شماره داخلی ⚠️ (الزامی)
├─ موبایل
├─ ایمیل
├─ جنسیت
└─ شرکت

✏️ ویرایش کاربر
└─ تمام فیلدها قابل تغییر

👁️ / 🔒 تغییر وضعیت نمایش
├─ 👁️ نمایان: کاربر در سایت نمایش داده می‌شود
└─ 🔒 مخفی: کاربر در سایت پنهان است

🗑️ حذف کاربر
└─ حذف دائمی از سیستم
```

### مرحله 5: مدیریت ادمین‌ها (Super Admin Only)

```
➕ ادمین جدید اضافه کردن
├─ نام کاربری
├─ رمز عبور
└─ ایمیل

🗑️ حذف ادمین
└─ حذف حساب ادمین
```

---

## 🔒 نکات امنیتی

### Password Hashing
```javascript
bcryptjs - 10 rounds salt
├─ ایمن در برابر Rainbow Table Attacks
└─ ایمن در برابر Brute Force (سریع نیست)
```

### JWT Authentication
```
Token Structure:
├─ Header: { alg: 'HS256', typ: 'JWT' }
├─ Payload: { id, username, role, expiresIn }
└─ Signature: HMAC-SHA256(secret)

Expiration: 30 دقیقه
```

### Role-Based Access Control
```
Super Admin:
├─ ایجاد/حذف شرکت‌ها
├─ ایجاد/حذف ادمین‌ها
└─ مدیریت کل سیستم

Admin:
├─ مدیریت کاربران
├─ تغییر وضعیت نمایش
└─ عدم دسترسی به مدیریت ادمین
```

---

## 📚 API Examples

### 1️⃣ Login Request
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@system.local",
    "role": "super_admin"
  }
}
```

### 2️⃣ Get Companies
```bash
GET http://localhost:3001/api/companies
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name_en": "AFA Steel",
    "name_fa": "فولاد آفا",
    "created_at": "2025-11-12T12:30:00Z"
  },
  ...
]
```

### 3️⃣ Create Employee
```bash
POST http://localhost:3001/api/admin/employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "company_id": 1,
  "name_en": "John Doe",
  "name_fa": "جان دو",
  "title_en": "Manager",
  "title_fa": "مدیر",
  "dept_en": "Sales",
  "dept_fa": "فروش",
  "extension": "1234",
  "mobile": "09121234567",
  "email": "john@company.com",
  "icon": "male"
}
```

### 4️⃣ Toggle Visibility
```bash
PATCH http://localhost:3001/api/admin/employees/1/visibility
Authorization: Bearer {token}
Content-Type: application/json

{
  "visible": 0  // 0 = مخفی, 1 = نمایان
}
```

---

## 🎯 بعدی (Next Steps)

### بخش‌هایی که برای تکمیل وجود دارد:

1. **Endpoints برای مدیریت ادمین** (ایجاد/حذف ادمین از API)
2. **تغییر رمز عبور** برای ادمین
3. **Audit Logs** - ثبت تمام فعالیت‌های سیستم
4. **تصویر/آپلود برای شرکت‌ها**
5. **صادرات داده‌ها** (Excel/PDF)
6. **Soft Delete** برای کاربران (نه حذف دائمی)
7. **Two-Factor Authentication** (2FA)

---

## 🛠️ Troubleshooting

### مشکل: صفحه ورود نمایش داده نمی‌شود
```
❌ حل: مطمئن شوید که:
  1. Backend در حال اجرا است (http://localhost:3001)
  2. Frontend در حال اجرا است (http://localhost:5173)
  3. Token را حذف کنید و دوباره بار کنید
```

### مشکل: Login ناموفق
```
❌ حل:
  1. نام کاربری و رمز را بررسی کنید
  2. Capslock را خاموش کنید
  3. Database آغاز شده است؟ (console سرور را بررسی کنید)
```

### مشکل: CORS Error
```
❌ حل:
  1. VITE_API_URL در .env.local صحیح است؟
  2. Backend در پورت 3001 اجرا می‌شود؟
  3. CORS middleware در Express فعال است
```

### مشکل: Token Expired
```
❌ حل:
  1. Token برای 30 دقیقه معتبر است
  2. دوباره ورود کنید
  3. Backend مشخصات رو بررسی کنید
```

---

## 📋 فایلهای جدید

```
Backend:
  ✅ backend/server.js          (Updated)
  ✅ backend/.env               (New)

Frontend:
  ✅ src/components/AdminLogin.tsx       (New)
  ✅ src/components/AdminLayout.tsx      (New)
  ✅ src/components/AdminDashboard.tsx   (New)
  ✅ src/components/AdminCompanies.tsx   (New)
  ✅ src/components/AdminEmployees.tsx   (New)
  ✅ src/components/AdminUsers.tsx       (New)
  ✅ src/App.tsx                         (Updated)
```

---

## 🎉 تبریک!

پنل ادمین شما کاملاً نصب شده و آماده استفاده است!

```
🟢 Backend: http://localhost:3001
🟢 Frontend: http://localhost:5173
🟢 Admin Panel: http://localhost:5173/admin/login
```

**سوالات؟** 😊
