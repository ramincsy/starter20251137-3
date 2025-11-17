import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ModernContactCard from './ModernContactCard';
import Toolbar from './Toolbar';
import { Employee } from '@/types/employee';
import { exportToExcel, exportToCSV, exportToJSON } from '@/utils/exportUtils';
import { inferGenderFromEmployee } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function normalizeText(s: string) {
  if (!s) return '';
  return s
    .normalize('NFKC')
    .replace(/\u200c/g, '') // حذف نیم‌فاصله
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

interface SearchMatch {
  matches: boolean;
  matchedFields: {
    nameEn?: boolean;
    nameFa?: boolean;
    deptEn?: boolean;
    deptFa?: boolean;
    extension?: boolean;
    email?: boolean;
  };
}

function findMatches(emp: Employee, query: string): SearchMatch {
  if (!query) return { matches: true, matchedFields: {} };
  
  const q = normalizeText(query);
  const nameEn = normalizeText(emp.name?.en);
  const nameFa = normalizeText(emp.name?.fa);
  const deptEn = normalizeText(emp.department?.en);
  const deptFa = normalizeText(emp.department?.fa);
  const extension = normalizeText(emp.extension);
  const email = normalizeText(emp.email);

  const matchedFields = {
    nameEn: nameEn.includes(q),
    nameFa: nameFa.includes(q),
    deptEn: deptEn.includes(q),
    deptFa: deptFa.includes(q),
    extension: extension.includes(q),
    email: email.includes(q)
  };

  return {
    matches: Object.values(matchedFields).some(Boolean),
    matchedFields
  };
}

export default function ContactDirectory() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setError(null);
      // Fetch from backend API instead of static JSON file
      // API_URL will be http://localhost:3001 in development (Windows)
      // and can be changed to your server IP in production (Linux)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      // Map employees and infer gender so UI can pick the correct local avatar.
      const mapped = data.map((emp: any) => ({
        ...emp,
        gender: emp.gender ?? inferGenderFromEmployee(emp),
        show_mobile: typeof emp.show_mobile === 'number' ? emp.show_mobile : 1,
        show_email: typeof emp.show_email === 'number' ? emp.show_email : 1,
      }));
      setEmployees(mapped);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError(t('error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEmployees();
    toast({
      title: t('dataRefreshed'),
      duration: 2000,
    });
  };

  const handleExport = (format: 'excel' | 'csv' | 'json') => {
    const lang = i18n.language as 'en' | 'fa';
    const dataToExport = filteredEmployees;

    switch (format) {
      case 'excel':
        exportToExcel(dataToExport, lang);
        break;
      case 'csv':
        exportToCSV(dataToExport, lang);
        break;
      case 'json':
        exportToJSON(dataToExport, lang);
        break;
    }
  };

  const departments = useMemo(() => {
  const lang = i18n.language as 'en' | 'fa';
  const depts = new Set(
    employees
      .map(emp => emp.department[lang])
      .filter(dept => dept && dept !== '-' && dept !== 'Disabled')
  );
  return Array.from(depts).sort();
}, [employees, i18n.language]);

  const companies = useMemo(() => {
    const lang = i18n.language as 'en' | 'fa';
    const comps = new Set(
      employees
        .map(emp => emp.company?.[lang])
        .filter(comp => comp && comp !== '-' && comp !== 'Disabled')
    );
    return Array.from(comps).sort();
  }, [employees, i18n.language]);

  const searchResults = useMemo(() => {
    const lang = i18n.language as 'en' | 'fa';
    
    return employees.map(emp => {
      const searchMatch = findMatches(emp, searchTerm);
      const matchesDepartment = selectedDepartment === 'all' || 
        normalizeText(emp.department?.[lang]) === normalizeText(selectedDepartment);
      const empCompanyName = (emp as any).company?.[lang] || '';
      const matchesCompany = selectedCompany === 'all' || 
        normalizeText(empCompanyName) === normalizeText(selectedCompany);

      return {
        employee: emp,
        included: searchMatch.matches && matchesDepartment && matchesCompany,
        matchedFields: searchMatch.matchedFields
      };
    });
  }, [employees, searchTerm, selectedDepartment, selectedCompany, i18n.language]);

  const filteredEmployees = useMemo(() => 
    searchResults.filter(r => r.included).map(r => r.employee),
    [searchResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Premium Header */}
      <div className="relative overflow-hidden border-b-2 border-primary/20 bg-gradient-to-r from-blue-600/90 via-blue-700/85 to-purple-700/90 dark:from-blue-900/60 dark:via-blue-950/50 dark:to-purple-900/60 backdrop-blur-xl shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Title and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-white/90 uppercase tracking-widest">AFA STEEL GROUP</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg leading-tight">
                دفترچه تلفن
                <br />
                
                <span className="bg-gradient-to-r from-yellow-300 via-orange-200 to-pink-200 bg-clip-text text-transparent">
                  سازمانی
                </span>
              </h1>

              <p className="text-white/90 text-lg max-w-md leading-relaxed font-medium">
                 ارتباط سریع با تمام اعضای شرکت
              </p>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-semibold">سیستم فعال</span>
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <div className="text-white/90 text-sm font-medium">
                  <span className="text-white font-bold">{filteredEmployees.length}</span> مخاطب فعال
                </div>
              </div>
            </div>

            {/* Right side - Company Info Card */}
            <div className="hidden md:flex justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl max-w-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                  
                  <div className="relative space-y-6">
                    {/* Header Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-8 h-8 text-white font-bold" />
                    </div>

                    {/* Company Name */}
                    <div>
                      <p className="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wide">Holding company </p>
                      <h2 className="text-3xl font-black text-white">AFA STEEL</h2>
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t border-white/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm font-medium">تعداد کارمندان</span>
                        <span className="text-2xl font-bold text-white">{employees.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm font-medium">بخش‌ها</span>
                        <span className="text-2xl font-bold text-white">{departments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm font-medium">شرکت‌ها</span>
                        <span className="text-2xl font-bold text-white">{companies.length}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-2 flex items-center gap-2 bg-green-500/20 rounded-xl p-3 border border-green-500/40">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-green-300 text-sm font-semibold">سیستم فعال و آماده</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Toolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
            departments={departments}
            companies={companies}
            onRefresh={handleRefresh}
            onExport={handleExport}
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            isRefreshing={isRefreshing}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {filteredEmployees.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('noResults')}</h3>
            <p className="text-muted-foreground">{t('noResultsDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
            {searchResults
              .filter(r => r.included)
              .map(({ employee, matchedFields }) => (
                <div key={employee.id} className="h-full">
                  <ModernContactCard 
                    employee={employee}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}