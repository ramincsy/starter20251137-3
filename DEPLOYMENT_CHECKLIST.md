# Deployment Checklist

## کوئی بھی Deployment سے پہلے

### کوڈ کی تیاری
- [ ] تمام `.env.local` فائلیں remove کریں (sensitive data)
- [ ] `.env.example` فائل بنائیں (template کے لیے)
- [ ] `JWT_SECRET` کو production-safe کریں
- [ ] Admin default credentials (`admin`/`admin123`) تبدیل کریں
- [ ] `package.json` dependencies latest ہوں: `npm update`

### Testing
- [ ] Local میں `npm run build` کریں اور `dist/` test کریں
- [ ] Backend `npm run dev` test کریں
- [ ] Admin login flow test کریں
- [ ] Employee list view test کریں

---

## Scenario 1: cPanel WITH Node.js Support

### Frontend Deployment
```bash
# 1. Local میں build کریں
npm run build

# 2. dist/ کو cPanel میں upload کریں
# - File Manager یا FTP استعمال کریں
# - Destination: public_html/ (or subdirectory)

# 3. .htaccess add کریں (SPA routing کے لیے)
# CPANEL_DEPLOYMENT_GUIDE.md میں دیکھیں
```

### Backend Deployment
```bash
# 1. cPanel میں Node.js app setup کریں
#    (cPanel admin panel → Setup Node.js App)

# 2. Terminal/SSH سے:
cd /home/username/public_html/backend

# 3. Dependencies install کریں
npm install --production

# 4. .env configure کریں
# PORT=3001
# JWT_SECRET=<STRONG_SECRET>
# NODE_ENV=production

# 5. Start کریں
npm start
```

### Post-Deployment
- [ ] https://yourdomain.com لوڈ ہوتا ہے؟
- [ ] Admin panel accessible ہے؟
- [ ] Backend endpoints respond کرتے ہیں؟
- [ ] Database محفوظ ہے؟

---

## Scenario 2: cPanel (Frontend) + Railway/Render (Backend)

### Step 1: Frontend Build & Upload
```bash
npm run build
# dist/ → cPanel via FTP/File Manager
```

### Step 2: Backend Deploy on Railway
```bash
# 1. Railway.app جاؤ
# 2. GitHub سے repo connect کریں
# 3. Backend folder select کریں
# 4. Environment variables:
#    - PORT: 3001
#    - JWT_SECRET: <PRODUCTION_SECRET>
#    - NODE_ENV: production
# 5. Deploy
```

### Step 3: Update Frontend Config
```bash
# .env.production
VITE_API_URL=https://<railway-domain>.up.railway.app

npm run build
# dist/ → cPanel again
```

### Testing
- [ ] Frontend loads
- [ ] Admin login کام کرتا ہے
- [ ] Create admin endpoint respond کرتا ہے
- [ ] Employee list visible ہے

---

## Database Considerations

### SQLite on cPanel
✅ Works locally  
⚠️ If backend and frontend on different hosts → problems

**Solution:**
1. اگر backend same server پر ہے → OK
2. اگر backend remote ہے → SQLite move کریں:
   - **Option A:** PostgreSQL/MySQL استعمال کریں (Supabase)
   - **Option B:** Shared file storage (NFS) set up کریں
   - **Option C:** Keep on Railway/Render (simpler)

---

## Security Checklist

- [ ] JWT_SECRET production-grade ہے
- [ ] HTTPS enabled ہے
- [ ] Default admin account password changed
- [ ] CORS properly configured
- [ ] Database credentials secure
- [ ] .env files version control میں نہیں
- [ ] SSH keys safe
- [ ] Firewall rules check کریں

---

## Post-Deployment Monitoring

```bash
# Backend logs check کریں
pm2 logs  (اگر pm2 استعمال کر رہے ہیں)
# یا
journalctl -u nodejs-app  (if systemd)

# Database integrity
sqlite3 employees.db "SELECT COUNT(*) FROM admins;"

# Test endpoints
curl -X GET http://localhost:3001/api/health
```

---

## Rollback Plan

اگر کچھ غلط ہو:

1. **Frontend:** پرانا `dist/` backup سے restore کریں
2. **Backend:** پرانا code commit سے switch کریں
3. **Database:** backup سے restore کریں (employees.db.backup)

---

## Contact & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port blocked | cPanel میں مختلف port try کریں |
| CORS error | Backend CORS middleware check کریں |
| DB not found | Path absolute بنائیں |
| Admin login fails | JWT_SECRET same ہے check کریں |
| Slow response | Database indexes check کریں |

