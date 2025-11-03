import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ContactCard from './ContactCard';
import Toolbar from './Toolbar';
import { Employee } from '@/types/employee';
import { exportToExcel, exportToCSV, exportToJSON } from '@/utils/exportUtils';
import { inferGenderFromEmployee } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import '../i18n/config';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setError(null);
      // Use import.meta.env.BASE_URL to get the correct path in both dev and production
      const response = await fetch(import.meta.env.BASE_URL + 'employees.json');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // Map employees and infer gender so UI can pick the correct local avatar.
      const mapped = data.map((emp: any) => ({
        ...emp,
        gender: emp.gender ?? inferGenderFromEmployee(emp)
      }));
      setEmployees(mapped);
    } catch (err) {
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

  const searchResults = useMemo(() => {
    const lang = i18n.language as 'en' | 'fa';
    
    return employees.map(emp => {
      const searchMatch = findMatches(emp, searchTerm);
      const matchesDepartment = selectedDepartment === 'all' || 
        normalizeText(emp.department?.[lang]) === normalizeText(selectedDepartment);

      return {
        employee: emp,
        included: searchMatch.matches && matchesDepartment,
        matchedFields: searchMatch.matchedFields
      };
    });
  }, [employees, searchTerm, selectedDepartment, i18n.language]);

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">
                  {filteredEmployees.length} {filteredEmployees.length === 1 ? 'contact' : 'contacts'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg text-primary">AFA STEEL</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Toolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            departments={departments}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults
              .filter(r => r.included)
              .map(({ employee, matchedFields }) => (
                <ContactCard 
                  key={employee.id} 
                  employee={employee}
                  matchedFields={matchedFields}
                />
              ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}