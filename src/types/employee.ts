export interface Employee {
  id: number;
  name: {
    en: string;
    fa: string;
  };
  title: {
    en: string;
    fa: string;
  };
  department: {
    en: string;
    fa: string;
  };
  extension: string;
  mobile: string;
  email: string;
  photo: string;
  // optional gender helps choose a local SVG avatar when photo is missing
  gender?: 'male' | 'female' | 'unknown';
}