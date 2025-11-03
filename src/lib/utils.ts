import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Gender = 'male' | 'female' | 'unknown';

/**
 * Infer gender from employee fields using a few heuristics:
 * 1. If `photo` URL contains a `style=male` or `style=female` indicator (used in this dataset), use it.
 * 2. Check first name against small curated lists of common female names (English and Persian).
 * 3. Otherwise return 'unknown'. This is a best-effort heuristic — for 100% accuracy add a `gender` field to the data.
 */
export function inferGenderFromEmployee(emp: { name?: { en?: string; fa?: string }; photo?: string; gender?: Gender }): Gender {
  if (!emp) return 'unknown';
  if (emp.gender) return emp.gender;
  // Prefer an explicit `icon` field if present in the JSON (some records use this).
  // Accept common values and misspellings like "male", "female", "famel".
  const icon = (emp as any).icon;
  if (typeof icon === 'string') {
    const i = icon.toLowerCase();
    if (i.includes('male') || i === 'm') return 'male';
    if (i.includes('fem') || i.includes('famel') || i === 'f') return 'female';
  }

  const photo = (emp.photo || '').toLowerCase();
  if (photo.includes('style=male') || photo.includes('style%5d=male') || photo.includes('style%5bstyle%5d=male')) return 'male';
  if (photo.includes('style=female') || photo.includes('style%5d=female') || photo.includes('style%5bstyle%5d=female')) return 'female';

  const femaleEnglish = new Set(['fatemeh','zahra','maryam','samira','farnaz','rana','roghaye','poory','poorya','mahsa','narges','mina','sara','samira','mahtab']);
  const femalePersian = new Set(['فاطمه','زهرا','مریم','سمیرا','فرناز','رعنا','پوری','مهسا','نرگس','مینا','سارا','مهتاب']);

  const en = (emp.name?.en || '').split(/[\s'-]+/)[0].toLowerCase();
  const fa = (emp.name?.fa || '').split(/\s+/)[0];

  if (en && femaleEnglish.has(en)) return 'female';
  if (fa && femalePersian.has(fa)) return 'female';

  return 'unknown';
}
