import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarMale, AvatarFemale, AvatarAnonymous } from '@/components/ui/Avatars';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Building2, Smartphone } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useTranslation } from 'react-i18next';

interface ContactCardProps {
  employee: Employee;
  matchedFields?: {
    nameEn?: boolean;
    nameFa?: boolean;
    deptEn?: boolean;
    deptFa?: boolean;
    extension?: boolean;
    email?: boolean;
  };
}

export default function ContactCard({ employee }: ContactCardProps) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as 'en' | 'fa';

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-blue-950/50 backdrop-blur-xl border-2 border-white/20 dark:border-slate-700/30 hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Avatar with glassmorphism */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <Avatar className="relative w-28 h-28 border-4 border-white/50 dark:border-slate-700/50 shadow-2xl ring-4 ring-blue-400/20 dark:ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-500">
              {/* Always use local SVG avatars (no network). Show gender if provided, otherwise anonymous. */}
              <AvatarFallback className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {employee.gender === 'male' ? (
                  <AvatarMale className="w-16 h-16" />
                ) : employee.gender === 'female' ? (
                  <AvatarFemale className="w-16 h-16" />
                ) : (
                  <AvatarAnonymous className="w-16 h-16" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Department */}
          <div className="space-y-3 w-full">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
              {employee.name[lang]}
            </h3>
            <Badge variant="secondary" className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 border border-blue-300/30 dark:border-blue-500/30 backdrop-blur-sm">
              <Building2 className="w-4 h-4 mr-2" />
              {employee.department[lang]}
            </Badge>
          </div>

          {/* Extension Number - Center Highlight */}
          <div className="w-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Phone className="w-6 h-6 text-white/90" />
                <span className="text-base font-semibold text-white/90">{t('extension')}</span>
              </div>
              <div className="text-5xl font-black text-white tracking-wider drop-shadow-lg mb-4">
                {employee.extension}
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm font-bold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = `tel:${employee.extension}`}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('call')}
              </Button>
            </div>
          </div>
          <div className="w-full space-y-3">
            {/* Mobile */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-400/20 dark:to-emerald-400/20 backdrop-blur-sm rounded-xl p-4 border border-green-300/30 dark:border-green-500/30 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">{t('mobile')}</div>
                    <div className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {employee.mobile}
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="flex-shrink-0 h-11 px-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl font-bold transition-all duration-300"
                  onClick={() => window.location.href = `tel:${employee.mobile}`}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t('call')}
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-400/20 dark:to-red-400/20 backdrop-blur-sm rounded-xl p-4 border border-orange-300/30 dark:border-orange-500/30 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1">{t('email')}</div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:truncate-none transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded px-1">
                      {employee.email}
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="flex-shrink-0 h-11 px-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl font-bold transition-all duration-300"
                  onClick={() => window.location.href = `mailto:${employee.email}`}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {t('send')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}