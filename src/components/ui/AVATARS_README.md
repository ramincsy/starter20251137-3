# Avatar SVGs - Customization Guide

## 📁 فایل‌های Avatar

- **`AvatarSvgs.tsx`** - تمام SVG های Avatar (رنگ‌ها و شکل‌ها اینجا هستند)
- **`Avatars.tsx`** - کامپوننت‌های React برای استفاده

## 🎨 رنگ‌های فعلی

### Male Avatar (آبی)
- Background: `#E6F0FF` (Light Blue)
- Head: `#2B6CB0` (Dark Blue)

### Female Avatar (صورتی)
- Background: `#FFF5F8` (Light Pink)
- Head: `#D53F8C` (Dark Pink)

### Anonymous Avatar (خاکستری)
- Background: `#F0F0F0` (Light Gray)
- Head: `#A0AEC0` (Medium Gray)
- Body: `#CBD5E0` (Light Gray)

## ✏️ نحوه تغییر رنگ‌ها

### مثال 1: تغییر رنگ Male Avatar

باز کنید: `src/components/ui/AvatarSvgs.tsx`

جستجو کنید:
```tsx
export function MaleAvatarSvg({ size = 256, className = '', ...props }: SvgProps) {
  return (
    <svg ...>
      {/* Background */}
      <rect width="100%" height="100%" fill="#E6F0FF" rx="20" />
      
      {/* Head */}
      <circle cx="128" cy="88" r="44" fill="#2B6CB0" />
```

تغییر دهید:
- `fill="#E6F0FF"` → رنگ پس‌زمینه
- `fill="#2B6CB0"` → رنگ سر و بدن

### مثال 2: تغییر سایز یا شکل

```tsx
{/* Head */}
<circle cx="128" cy="88" r="44" fill="#2B6CB0" />

// r="44" → شعاع سر
// cy="88" → موقعیت عمودی
// cx="128" → موقعیت افقی
```

## 🔧 استفاده در کد

```tsx
import { AvatarMale, AvatarFemale, AvatarAnonymous } from '@/components/ui/Avatars';

// استفاده ساده
<AvatarMale size={64} />
<AvatarFemale size={80} />
<AvatarAnonymous size={96} />

// با CSS custom
<AvatarMale size={64} className="rounded-full border-2 border-blue-500" />
```

## 📊 ساختار SVG

```
Avatar
├── Background (rect)
├── Head (circle)
├── Body (rect)
└── Details (rect/circle)
```

## 💡 نکات مهم

1. **viewBox**: "0 0 256 256" - شماره‌گذاری SVG را تغییر ندهید
2. **rx/ry**: گوشه‌های مستدیر را کنترل می‌کند
3. **opacity**: شفافیت عناصر
4. **width/height**: همیشه برابر باشند

## 🎯 ایده‌های تغییر

### تغییر به رنگ‌های ایرانی
- آبی: `#1e3a8a` (Farsi Blue)
- سبز: `#065f46` (Farsi Green)
- سرخ: `#7c2d12` (Farsi Red)

### تغییر شکل
- سر: `r="40"` (کوچک‌تر) یا `r="50"` (بزرگ‌تر)
- گوشه‌ها: `rx="30"` (گوشه‌های بیش‌تر) یا `rx="10"` (تیز‌تر)

### اضافه کردن جزئیات
```tsx
{/* چشم‌ها */}
<circle cx="110" cy="80" r="6" fill="#FFFFFF" opacity="0.8" />
<circle cx="146" cy="80" r="6" fill="#FFFFFF" opacity="0.8" />

{/* دهان */}
<path d="M 120 100 Q 128 105 136 100" stroke="#FFFFFF" strokeWidth="2" fill="none" />
```

## 🚀 مثال کامل: Avatar مختص‌تر

```tsx
export function MaleAvatarSvg({ size = 256, className = '', ...props }: SvgProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" className={className} {...props}>
      {/* Background Gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6F0FF" />
          <stop offset="100%" stopColor="#D4E5F7" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGradient)" rx="20" />
      
      {/* Head with gradient */}
      <circle cx="128" cy="88" r="44" fill="#2B6CB0" />
      
      {/* Eyes */}
      <circle cx="116" cy="80" r="5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="140" cy="80" r="5" fill="#FFFFFF" opacity="0.8" />
      
      {/* Body */}
      <rect x="56" y="150" width="144" height="70" rx="18" fill="#2B6CB0" />
    </svg>
  );
}
```

---

**نوشتاری:** 2025 | **آخرین بروزرسانی:** نوامبر 13
