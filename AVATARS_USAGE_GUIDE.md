# 🎨 نحوه استفاده از Avatar های جدید

## 📁 ساختار فایل‌ها

```
src/components/ui/
├── AvatarSvgs.tsx           ← تمام تعریف‌های SVG (قدیم و جدید)
├── Avatars.tsx              ← کامپوننت‌های React
├── AVATARS_README.md        ← راهنمای تغییر رنگ‌ها

public/avatars/
├── custom/
│   ├── male2.svg            ← Avatar مرد جدید
│   ├── female2.svg          ← Avatar زن جدید
├── male.svg                 ← Avatar مرد قدیم
├── female.svg               ← Avatar زن قدیم
├── anonymous.svg            ← Avatar ناشناس قدیم
```

## 🔧 نحوه استفاده

### گزینه 1: استفاده از Avatar های قدیم (ساده)

```tsx
import { AvatarMale, AvatarFemale, AvatarAnonymous } from '@/components/ui/Avatars';

// در کامپوننت
<AvatarMale size={64} className="rounded-lg" />
<AvatarFemale size={80} />
<AvatarAnonymous size={96} />
```

### گزینه 2: استفاده از Avatar های جدید (مدرن)

```tsx
import { AvatarMale2, AvatarFemale2 } from '@/components/ui/Avatars';

// در کامپوننت
<AvatarMale2 size={64} className="rounded-lg" />
<AvatarFemale2 size={80} />
```

## 📝 مثال کامل در ModernContactCard.tsx

### استفاده قدیم:
```tsx
{employee.gender === 'male' ? (
  <AvatarMale className="w-12 h-12 sm:w-14 sm:h-14" />
) : employee.gender === 'female' ? (
  <AvatarFemale className="w-12 h-12 sm:w-14 sm:h-14" />
) : (
  <AvatarAnonymous className="w-12 h-12 sm:w-14 sm:h-14" />
)}
```

### استفاده جدید:
```tsx
{employee.gender === 'male' ? (
  <AvatarMale2 size={56} className="sm:w-16 sm:h-16" />
) : employee.gender === 'female' ? (
  <AvatarFemale2 size={56} className="sm:w-16 sm:h-16" />
) : (
  <AvatarAnonymous className="w-12 h-12 sm:w-14 sm:h-14" />
)}
```

## 🎯 تغییر Avatar های جدید

### 1️⃣ تغییر رنگ‌های male2.svg:

فایل: `public/avatars/custom/male2.svg`

```xml
<!-- قبل -->
<linearGradient id="maleBg">
  <stop offset="0%" style="stop-color:#E3F2FD" />
  <stop offset="100%" style="stop-color:#BBDEFB" />
</linearGradient>

<!-- بعد (رنگ سبز) -->
<linearGradient id="maleBg">
  <stop offset="0%" style="stop-color:#F0FDF4" />
  <stop offset="100%" style="stop-color:#C6F6D5" />
</linearGradient>
```

### 2️⃣ تغییر سایز Avatar:

```tsx
<AvatarMale2 size={80} /> {/* بزرگ‌تر */}
<AvatarMale2 size={48} /> {/* کوچک‌تر */}
```

## ✨ رنگ‌های موجود در Avatar های جدید

### Male2 (آبی مدرن):
- Background: `#E3F2FD → #BBDEFB` (Gradient)
- Head: `#1976D2` (Modern Blue)
- Hair: `#1565C0` (Darker Blue)
- Eyes: `#FFFFFF` (White)
- Shirt: `#1976D2` (Modern Blue)

### Female2 (صورتی مدرن):
- Background: `#FCE4EC → #F8BBD0` (Gradient)
- Head: `#C2185B` (Modern Pink)
- Hair: `#AD1457` (Darker Pink)
- Eyes: `#FFFFFF` (White)
- Dress: `#C2185B` (Modern Pink)

## 🚀 پیشنهاد بهتری برای استفاده

اگر می‌خواهید **هر دو Avatar را در دسترس داشته باشید**:

```tsx
// در ModernContactCard.tsx
const useNewAvatars = true; // تغییر این را برای سوئیچ کردن

{employee.gender === 'male' ? (
  useNewAvatars ? (
    <AvatarMale2 size={56} />
  ) : (
    <AvatarMale size={56} />
  )
) : employee.gender === 'female' ? (
  useNewAvatars ? (
    <AvatarFemale2 size={56} />
  ) : (
    <AvatarFemale size={56} />
  )
) : (
  <AvatarAnonymous size={56} />
)}
```

## 🔄 اگر SVG های شخصی دارید

1. فایل‌های `.svg` خود را در `public/avatars/custom/` قرار دهید
2. در `AvatarSvgs.tsx` یک کامپوننت جدید اضافه کنید:

```tsx
export function MyCustomMale({ size = 256, className = '', ...props }: ImgProps) {
  return (
    <img
      src="/avatars/custom/my-male.svg"
      alt="my custom avatar"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={className}
      {...props}
    />
  );
}
```

3. در `Avatars.tsx` export کنید و استفاده کنید

---

**نوشتاری:** 2025 | **نسخه:** 2.0
