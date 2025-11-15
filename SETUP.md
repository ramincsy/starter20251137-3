# مراحل نصب و راه‌اندازی سریع

## مرحله 1: نصب MySQL (اگر نصب نکرده‌اید)

### گزینه A: نصب MySQL مستقل
- دانلود از: https://dev.mysql.com/downloads/mysql/
- یا استفاده از XAMPP: https://www.apachefriends.org/

### گزینه B: استفاده از XAMPP (توصیه شده)
XAMPP شامل MySQL + phpMyAdmin است و راحت‌تر است.

---

## مرحله 2: ایجاد دیتابیس و جداول

### گزینه A: استفاده از Command Line
```bash
cd backend
mysql -u root -p < database.sql
```
(اگر پسورد ندارید، کافی است Enter بزنید)

### گزینه B: استفاده از phpMyAdmin (اگر XAMPP استفاده می‌کنید)
1. باز کنید: http://localhost/phpmyadmin/
2. رفتار: Import → انتخاب فایل `database.sql` → Execute

---

## مرحله 3: تنظیم Environment Variables

فایل `backend/.env` را ایجاد کنید با محتوای زیر:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=contact_directory
PORT=3001
NODE_ENV=development
```

**نکته:** اگر MySQL پسورد دارد، مقدار `DB_PASSWORD` را تنظیم کنید.

---

## مرحله 4: اجرای Backend

از پوشه `backend`:

```bash
npm start
```

نتیجه باید چیزی شبیه این باشد:
```
✓ Database connected successfully
✓ Server running on http://localhost:3001
✓ API endpoint: http://localhost:3001/api/employees
```

---

## مرحله 5: تست API

باز کنید مرورگر و برید به:
```
http://localhost:3001/api/health
```

اگر نتیجه `{"status":"Server is running"}` را ببینید، همه چیز درست است!

---

## مرحله 6: اجرای Frontend

از پوشه اصلی پروژه:

```bash
npm install
npm run dev
```

حالا سایت به آدرس `http://localhost:5173` (یا آدرسی که Vite نمایش می‌دهد) باز می‌شود.

---

## اگر مشکل داشتید:

### خطای "Cannot find module 'mysql2'"
```bash
cd backend
npm install
```

### خطای "Database connection failed"
1. مطمئن شوید MySQL Server اجرا شده است (XAMPP یا MySQL Server)
2. مقادیر `.env` را بررسی کنید
3. اجرا کنید: `mysql -u root -p` و Enter برای بررسی اتصال

### خطای "CORS Error" در سایت
مطمئن شوید:
1. Backend در حال اجرا است (npm start در پوشه backend)
2. `VITE_API_URL` در `.env.local` روی `http://localhost:3001` تنظیم شده است

---

## کاری که انجام شد:

✅ ساخت Backend بر اساس Express.js  
✅ اتصال به MySQL  
✅ API endpoint برای دریافت کارمندان  
✅ تغییر Frontend برای دریافت از Backend  
✅ تنظیم Environment Variables برای Windows و Linux  
✅ دیتابیس SQL آماده برای ساخت جداول  

---

## موارد بعدی برای سرور لینوکس:

وقتی بخواهید پروژه را به لینوکس منتقل کنید:
1. تنظیم `.env` در backend با اطلاعات سرور لینوکس
2. نصب Node.js و MySQL روی سرور
3. راه‌اندازی Backend با systemd service
4. تنظیم Nginx reverse proxy
5. تغییر `VITE_API_URL` در فرانت‌اند به آدرس سرور

راهنمایی کامل در `backend/README.md` نوشته شده است.

---

**سوال داشتید؟ بگویید!**
