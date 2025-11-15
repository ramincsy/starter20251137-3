import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Contact Directory',
      search: 'Search by name, department, or email...',
      filterByDepartment: 'Filter by Department',
      allDepartments: 'All Departments',
      filterByCompany: 'Filter by Company',
      allCompanies: 'All Companies',
      refresh: 'Refresh Data',
      export: 'Export',
      exportExcel: 'Export to Excel',
      exportCSV: 'Export to CSV',
      exportJSON: 'Export to JSON',
      extension: 'Extension',
      mobile: 'Mobile',
      email: 'Email',
      call: 'Call',
      send: 'Send',
      language: 'Language',
      theme: 'Theme',
      noResults: 'No contacts found',
      noResultsDescription: 'Try adjusting your search or filters',
      loading: 'Loading contacts...',
      error: 'Failed to load contacts',
      errorDescription: 'Please try refreshing the page',
      dataRefreshed: 'Data refreshed successfully',
      departments: {
        Executive: 'Executive',
        Technology: 'Technology',
        'Human Resources': 'Human Resources',
        Marketing: 'Marketing',
        Finance: 'Finance',
        Product: 'Product',
        Design: 'Design'
      }
    }
  },
  fa: {
    translation: {
      title: 'دفترچه تلفن سازمانی',
      search: 'جستجو بر اساس نام، بخش یا ایمیل...',
      filterByDepartment: 'فیلتر بر اساس بخش',
      allDepartments: 'همه بخش‌ها',
      filterByCompany: 'فیلتر بر اساس شرکت',
      allCompanies: 'همه شرکت‌ها',
      refresh: 'بروزرسانی اطلاعات',
      export: 'خروجی',
      exportExcel: 'خروجی اکسل',
      exportCSV: 'خروجی CSV',
      exportJSON: 'خروجی JSON',
      extension: 'داخلی',
      mobile: 'موبایل',
      email: 'ایمیل',
      call: 'تماس',
      send: 'ارسال',
      language: 'زبان',
      theme: 'تم',
      noResults: 'مخاطبی یافت نشد',
      noResultsDescription: 'لطفاً جستجو یا فیلترها را تغییر دهید',
      loading: 'در حال بارگذاری مخاطبین...',
      error: 'خطا در بارگذاری مخاطبین',
      errorDescription: 'لطفاً صفحه را بروزرسانی کنید',
      dataRefreshed: 'اطلاعات با موفقیت بروزرسانی شد',
      departments: {
        Executive: 'مدیریت',
        Technology: 'فناوری',
        'Human Resources': 'منابع انسانی',
        Marketing: 'بازاریابی',
        Finance: 'مالی',
        Product: 'محصول',
        Design: 'طراحی'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'fa',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Set initial document direction and language
const currentLang = i18n.language;
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';

// Watch for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;