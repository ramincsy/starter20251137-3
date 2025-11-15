# ⚡ Quick Start - شروع سریع

## 🔓 اطلاعات ورود

```
🌐 صفحه ورود: http://localhost:5173/admin/login

👤 نام کاربری: admin
🔑 رمز عبور:  admin123
```

---

## 🚀 شروع کردن

### 1. Backend را شروع کنید
```powershell
cd backend
npm start
```

**Output مورد انتظار:**
```
✓ Super Admin created (username: admin, password: admin123)
✓ 7 Companies created
✓ Database initialized successfully
✓ Server running on http://localhost:3001
```

### 2. Frontend را شروع کنید (ترمینال جدید)
```powershell
npm run dev
```

**Output مورد انتظار:**
```
VITE v6.2.3 ready in 281 ms
➜  Local: http://localhost:5173/
```

### 3. صفحه ورود را باز کنید
```
http://localhost:5173/admin/login
```

---

## ✅ بعد از ورود

```
👁️ داشبورد اصلی
├─ 📊 Statistics (تعداد شرکت‌ها، کاربران)
└─ 🔗 Quick Links

🏢 مدیریت شرکت‌ها
├─ ➕ اضافه کردن شرکت جدید
├─ ✏️ ویرایش
└─ 🗑️ حذف

👥 مدیریت کاربران
├─ ➕ اضافه کردن کاربر جدید
├─ ✏️ ویرایش
├─ 👁️/🔒 تغییر وضعیت نمایش
└─ 🗑️ حذف

🔐 مدیریت ادمین‌ها (Super Admin)
├─ ➕ اضافه کردن ادمین جدید
└─ 🗑️ حذف ادمین
```

---

## 📊 Database

### 7 شرکت از قبل ایجاد شده:

```
1. AFA Steel        (فولاد آفا)
2. AFA Trading      (تجارت آفا)
3. AFA Logistics    (لجستیک آفا)
4. AFA Engineering  (مهندسی آفا)
5. AFA Technology   (فناوری آفا)
6. AFA Finance      (مالی آفا)
7. AFA HR          (منابع انسانی آفا)
```

### 136 کاربر موجود
- می‌توانید کاربران را مخفی/نمایان کنید
- می‌توانید کاربران جدید اضافه کنید
- می‌توانید کاربران را حذف کنید

---

## 🔒 امنیت

```
🔐 Password Hashing: bcryptjs (10 rounds)
🎫 Token: JWT (30 دقیقه معتبر)
✔️ RBAC: Role-Based Access Control
   ├─ Super Admin: مدیریت کل
   └─ Admin: مدیریت کاربران فقط
```

---

## 🎯 Tasks

### اضافه کردن کاربر جدید برای شرکت
```
1. روی "مدیریت کاربران" کلیک کنید
2. روی "➕ کاربر جدید" کلیک کنید
3. فیلدهای الزامی را پر کنید:
   ├─ نام (انگلیسی و فارسی)
   ├─ شماره داخلی
   └─ شرکت (اختیاری)
4. "✓ ذخیره" را کلیک کنید
```

### مخفی کردن کاربر
```
1. روی "مدیریت کاربران" کلیک کنید
2. کاربر را پیدا کنید
3. روی دکمه "🔒" کلیک کنید
```

### حذف شرکت
```
⚠️ هشدار: تمام کاربران این شرکت حذف می‌شوند!
1. روی "مدیریت شرکت‌ها" کلیک کنید
2. روی دکمه "🗑️ حذف" کلیک کنید
3. تأیید کنید
```

---

## 🆘 مشکل و حل

| مشکل | حل |
|------|-----|
| صفحه ورود نمایش نمی‌شود | Backend را شروع کنید (`npm start`) |
| Login ناموفق | نام کاربری: `admin`, رمز: `admin123` |
| CORS Error | مطمئن شوید Backend در پورت 3001 است |
| 404 صفحه ادمین | مطمئن شوید URL صحیح است: `/admin/login` |

---

## 📞 API Endpoints

```
🔓 ورود:
POST   /api/auth/login

🏢 شرکت‌ها (محافظ شده):
GET    /api/companies
POST   /api/companies
PUT    /api/companies/:id
DELETE /api/companies/:id

👥 کاربران:
GET    /api/employees               (فقط visible=1)
GET    /api/admin/employees         (تمام)
POST   /api/admin/employees
PUT    /api/admin/employees/:id
DELETE /api/admin/employees/:id
PATCH  /api/admin/employees/:id/visibility
```

---

## 🎉 تمام!

حالا می‌توانید:
- ✅ وارد پنل ادمین شوید
- ✅ شرکت‌ها را مدیریت کنید
- ✅ کاربران را مدیریت کنید
- ✅ وضعیت نمایش کاربران را تغییر دهید

**نیاز به کمک؟** `ADMIN_PANEL_GUIDE.md` را بخوانید! 📚
