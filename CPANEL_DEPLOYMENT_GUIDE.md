# cPanel Deployment Guide

## خلاصه سریع (Quick Summary)

**سوال:** آیا می‌تواند این سایت در cPanel اجرا شود؟  
**جواب:** ✅ **بله، اما با محدودیت‌های مهم**

---

## 1. وضعیت پروژه

### Frontend (React + Vite)
- ✅ **پشتیبانی شده** - cPanel می‌تواند static HTML/CSS/JS serve کند
- بعد از build: `npm run build` → فولدر `dist/` تولید می‌شود
- فایل‌های static باید تو root یا subdirectory قرار گیرند

### Backend (Node.js + Express + SQLite)
- ⚠️ **محدود** - cPanel اکثر پلن‌های معمولی Node.js را پشتیبانی نمی‌کند
- نیاز به: **Node.js addon** یا **VPS/Dedicated Server**
- اگر cPanel شما از Node.js پشتیبانی نکند → باید backend را جداگانه host کنید (Heroku, Railway, Render, Replit, AWS, DigitalOcean)

---

## 2. دو سناریو ممکن

### سناریو A: cPanel WITH Node.js Support (بهترین)

اگر hosting provider شما Node.js addon فراهم کرده:

#### مراحل Frontend:
```bash
# 1. روی ماشین لوکال build کنید
npm run build

# 2. فایل‌های dist/ را بالا بکشید (Upload)
# - به public_html/ یا subdomain directory
# FTP یا File Manager استفاده کنید
```

#### مراحل Backend:
```bash
# 1. روی cPanel:
#    - Node.js app برای port 3001 بسازید
#    - یا از cPanel "Setup Node.js App" استفاده کنید

# 2. اگر SSH دسترسی دارید:
cd /home/username/public_html/backend  (یا هر جای دیگری)
npm install
npm run start

# 3. .env را set کنید (port, JWT_SECRET, DATABASE path)
```

#### مسائل احتمالی:
- cPanel معمولاً Port 3000+ را block می‌کند
- `server.js` باید PORT env variable استفاده کند (✅ شما قبلاً این کار را کردید)
- SQLite db باید writable location باشد (مثلاً `/home/username/`، نه `public_html`)

---

### سناریو B: cPanel WITHOUT Node.js Support (معمول‌تر)

اگر hosting شما Node.js فراهم نکند:

#### Frontend (Static) - ✅ کار می‌کند:
```bash
npm run build
# dist/ را به public_html/ upload کنید via FTP
```

#### Backend - ❌ نیاز به جایی دیگر:
**گزینه‌ها:**

1. **Railway** (توصیه می‌شود - رایگان 500 ساعت/ماه)
   - `npm start` می‌کند
   - SQLite db را save می‌کند (در file storage)
   - سریع و ساده

2. **Render**
   - Node.js native support
   - SQLite پشتیبانی می‌کند

3. **Heroku** (اکنون free tier ندارد)

4. **DigitalOcean App Platform** یا **AWS EC2** (پیشرفته‌تر)

5. **Replit** (رایگان، اما محدود)

**مثال (Railway):**
```bash
# 1. Railway.app میں login کنید
# 2. GitHub repo connect کنید
# 3. root میں backend/ folder را نشان دهید
# 4. .env set کنید (PORT, JWT_SECRET)
# 5. Deploy ✅
```

---

## 3. Architecture برای cPanel

اگر Node.js support ندارد، بهترین setup:

```
┌─────────────────────┐
│  Your Domain        │
│  (cPanel)           │
│  public_html/       │  ← React build (dist/) upload هنا
│  - index.html       │     CORS enabled on backend
│  - app.js           │
│  - ...              │
└─────────────────────┘
         ↓ HTTP/HTTPS
    ┌────────────────────────────────┐
    │ Backend (Railway / Render)      │
    │ http://api.yoursite.com:3001    │ ← Separate domain/subdomain
    │ - Node.js + Express             │   CORS headers needed
    │ - SQLite database               │
    │ - Admin endpoints               │
    └────────────────────────────────┘
```

**باید CORS setup کنید:**

```javascript
// backend/server.js
app.use(cors({
  origin: ['https://yoursite.com', 'https://www.yoursite.com'],
  credentials: true
}));
```

---

## 4. Database مسائل

### SQLite در cPanel:
- ✅ فایل‌based - persistence خوب
- ⚠️ اگر backend جدا hosted است، database باید accessible باشد (یا migrate کنید)

### بهتر است:
```
اگر backend و frontend جدا hosted هستند:
  → Database‌رو hosted service منتقل کنید (Supabase, Firebase, MongoDB Atlas)
  → یا backend folder برای shared storage مونت کنید
```

---

## 5. Deployment Checklist

### Frontend (cPanel)
- [ ] Run `npm run build`
- [ ] Upload `dist/` files to `public_html/` (via FTP)
- [ ] Test: https://yoursite.com
- [ ] Verify: `index.html` loads correctly
- [ ] Set `.htaccess` for SPA routing (see below)

### Backend (Remote: Railway/Render/etc)
- [ ] Create account on Railway/Render
- [ ] Connect GitHub repo
- [ ] Set `PORT`, `JWT_SECRET`, `NODE_ENV` env vars
- [ ] Deploy
- [ ] Test: curl or Postman POST `/api/auth/login`
- [ ] Verify CORS headers

### Connect Frontend ↔ Backend
- [ ] Update `VITE_API_URL` in frontend `.env` (deployment domain)
- [ ] Rebuild and upload
- [ ] Test admin login flow

---

## 6. .htaccess برای React SPA

اگر frontend در cPanel hosted است، `public_html/` میں یہ `.htaccess` بنائیں:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

یہ یقینی بناتا ہے کہ تمام URLs کو React Router handle کرے۔

---

## 7. Environment Variables

### Frontend (.env.production)
```properties
VITE_API_URL=https://api.yourdomain.com:3001
# یا اگر backend cPanel میں ہے:
VITE_API_URL=https://yourdomain.com/api
```

### Backend (.env)
```properties
PORT=3001
NODE_ENV=production
JWT_SECRET=YOUR_STRONG_SECRET_HERE_CHANGE_ME
DATABASE_PATH=/home/username/employees.db
CORS_ORIGIN=https://yourdomain.com
```

---

## 8. Security نکات

- [ ] JWT_SECRET کو محفوظ رکھیں (env میں، version control میں نہیں)
- [ ] HTTPS استعمال کریں (SSL/TLS)
- [ ] CORS properly configure کریں
- [ ] Backend port 3001 public open نہ ہو (firewall میں block ہو سکتا ہے)
- [ ] Database credentials محفوظ ہوں
- [ ] Admin passwords default سے بدل دیں (`admin123` تبدیل کریں)

---

## 9. مثال: Deployment on Railway

### قدم 1: Railway account بنائیں
https://railway.app/

### قدم 2: GitHub repo connect کریں

### قدم 3: Services بنائیں
```
- service: backend
  root: /backend
  cmd: npm start
  
env vars:
  - PORT: 3001
  - JWT_SECRET: <your-secret>
  - NODE_ENV: production
```

### قدم 4: Frontend env update
```
VITE_API_URL=https://<your-railway-domain>.up.railway.app
```

### قدم 5: Rebuild & upload frontend
```bash
npm run build
# dist/ → cPanel via FTP
```

---

## 10. خلاصہ نتیجہ

| Feature | cPanel Only | cPanel + Remote Backend |
|---------|---|---|
| Frontend | ✅ | ✅ |
| Backend | ❌ | ✅ |
| Database | ✅ (SQLite) | ⚠️ (need migration) |
| Node.js | ❌ | ✅ (separate host) |
| Cost | ₹ | ₹₹ |
| Ease | سادہ | medium |

---

## سفارشات

**اگر آپ کے cPanel میں Node.js ہے:**
- Backend بھی cPanel میں رکھیں
- .env properly configure کریں
- Port conflicts check کریں

**اگر cPanel میں Node.js نہیں:**
1. Frontend → cPanel (static)
2. Backend → Railway یا Render (free tier)
3. CORS اچھی طرح configure کریں

---

## اگر مسائل ہوں

1. **"Port 3001 blocked"** → ENV میں مختلف port try کریں
2. **"CORS error"** → Backend میں origin add کریں
3. **"Database not found"** → Path absolute ہو، writable directory میں ہو
4. **"Admin login fails"** → Check JWT_SECRET same ہے frontend + backend میں

