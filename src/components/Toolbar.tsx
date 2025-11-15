import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, RefreshCw, Download, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Employee } from '@/types/employee';

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  companies: string[];
  onRefresh: () => void;
  onExport: (format: 'excel' | 'csv' | 'json') => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isRefreshing: boolean;
}

export default function Toolbar({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  selectedCompany,
  onCompanyChange,
  companies,
  onRefresh,
  onExport,
  isDarkMode,
  onThemeToggle,
  isRefreshing
}: ToolbarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <div className="space-y-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border-2 border-primary/10 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-primary w-5 h-5`} />
          <Input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${isRTL ? 'pr-11' : 'pl-11'} h-12 text-base border-2 focus:border-primary/50 bg-background/80`}
          />
        </div>

        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 border-2 bg-background/80 font-medium">
            <SelectValue placeholder={t('filterByDepartment')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-medium">{t('allDepartments')}</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="font-medium">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCompany} onValueChange={onCompanyChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 border-2 bg-background/80 font-medium">
            <SelectValue placeholder={t('filterByCompany')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-medium">{t('allCompanies')}</SelectItem>
            {companies.map((comp) => (
              <SelectItem key={comp} value={comp} className="font-medium">
                {comp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
            title={t('refresh')}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                title={t('export')}
              >
                <Download className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="font-medium">
              <DropdownMenuItem onClick={() => onExport('excel')}>
                {t('exportExcel')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('csv')}>
                {t('exportCSV')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                {t('exportJSON')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleLanguage}
            className="h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
            title={t('language')}
            aria-label={t('language')}
          >
            <Globe className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onThemeToggle}
            className="h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
            title={t('theme')}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}