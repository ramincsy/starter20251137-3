import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarMale, AvatarFemale, AvatarAnonymous } from '@/components/ui/Avatars';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building2, Smartphone } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useTranslation } from 'react-i18next';

interface ContactCardProps {
  employee: (Employee & { show_mobile?: number; show_email?: number; company?: { en?: string; fa?: string } }) | null;
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

  if (!employee) return null;

  const showMobile = employee.show_mobile !== 0;
  const showEmail = employee.show_email !== 0;
  
  // Updated styles and layout to ensure cards remain responsive and visually consistent even when email or mobile is hidden.
  const visibleBoxCount = (showMobile ? 1 : 0) + (showEmail ? 1 : 0);

  return (
    <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white/98 via-white/96 to-slate-50/80 dark:from-slate-900/98 dark:via-slate-800/96 dark:to-slate-900/90 backdrop-blur-xl border-2 border-blue-100/50 dark:border-slate-700/50 hover:border-blue-400/70 dark:hover:border-blue-500/70 shadow-lg hover:shadow-xl rounded-3xl">
      <CardContent className="p-5 sm:p-6 md:p-7 h-full flex flex-col">
        <div className="flex flex-col h-full">
          {/* Avatar section */}
          <div className="flex flex-col items-center mb-4 sm:mb-5">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <Avatar className="relative w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/70 dark:border-slate-700/70 shadow-lg ring-4 ring-blue-400/20 dark:ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-500">
                <AvatarFallback className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {employee.gender === 'male' ? (
                    <AvatarMale className="w-12 h-12 sm:w-14 sm:h-14" />
                  ) : employee.gender === 'female' ? (
                    <AvatarFemale className="w-12 h-12 sm:w-14 sm:h-14" />
                  ) : (
                    <AvatarAnonymous className="w-12 h-12 sm:w-14 sm:h-14" />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name */}
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-center bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent leading-tight px-2">
              {employee.name[lang]}
            </h3>
          </div>

          {/* Company and Department */}
          <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5 flex-grow">
            {/* Company */}
            {employee.company?.[lang] && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-400/30 dark:to-cyan-400/30 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {employee.company?.[lang]}
                </Badge>
              </div>
            )}

            {/* Department */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/15 to-pink-500/15 dark:from-purple-400/25 dark:to-pink-400/25 border border-purple-300/40 dark:border-purple-500/40 backdrop-blur-sm text-slate-800 dark:text-slate-200">
                {employee.department[lang]}
              </Badge>
            </div>
          </div>

          {/* Extension Number - Dynamic size */}
          <div 
            onClick={() => window.location.href = `tel:${employee.extension}`}
            className={`w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-600 dark:via-blue-700 dark:to-purple-700 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl border border-white/20 dark:border-blue-400/20 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-all duration-500 cursor-pointer mb-3 sm:mb-4`}>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
                <span className="text-xs sm:text-sm font-semibold text-white/90">{t('extension')}</span>
              </div>
              <div className={`font-black text-white tracking-wider drop-shadow-lg text-center transition-all duration-500 ${visibleBoxCount === 0 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-4xl sm:text-5xl'}`}>
                {employee.extension}
              </div>
            </div>
          </div>

          {/* Contact boxes - Flex layout */}
          <div className="space-y-3 sm:space-y-3.5 mt-auto">
            {showMobile && (
              <div 
                onClick={() => window.location.href = `tel:${employee.mobile}`}
                className="w-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-400/30 dark:to-emerald-400/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-green-300/50 dark:border-green-500/50 shadow-md hover:shadow-lg hover:from-green-500/30 hover:to-emerald-500/30 dark:hover:from-green-400/40 dark:hover:to-emerald-400/40 transition-all duration-300 cursor-pointer group/mobile">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/40 to-emerald-500/40 dark:from-green-500/50 dark:to-emerald-500/50 rounded-lg flex-shrink-0">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-0.5">{t('mobile')}</div>
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate hover:text-clip">
                      {employee.mobile}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showEmail && (
              <div 
                onClick={() => window.location.href = `mailto:${employee.email}`}
                className="w-full bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-400/30 dark:to-red-400/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-orange-300/50 dark:border-orange-500/50 shadow-md hover:shadow-lg hover:from-orange-500/30 hover:to-red-500/30 dark:hover:from-orange-400/40 dark:hover:to-red-400/40 transition-all duration-300 cursor-pointer group/email">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/40 to-red-500/40 dark:from-orange-500/50 dark:to-red-500/50 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-0.5">{t('email')}</div>
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate hover:text-clip break-all">
                      {employee.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}