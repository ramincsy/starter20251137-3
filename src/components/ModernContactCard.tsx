'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarMale2, AvatarFemale2, AvatarAnonymous } from '@/components/ui/Avatars';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building2, Smartphone, X, Copy, Check } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useTranslation } from 'react-i18next';

interface ModernContactCardProps {
  employee: (Employee & { show_mobile?: number; show_email?: number; company?: { en?: string; fa?: string } }) | null;
}

export default function ModernContactCard({ employee }: ModernContactCardProps) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as 'en' | 'fa';
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!employee) return null;

  const showMobile = employee.show_mobile !== 0;
  const showEmail = employee.show_email !== 0;

  const copyToClipboard = (text: string, isMobile: boolean) => {
    navigator.clipboard.writeText(text);
    if (isMobile) {
      setCopiedMobile(true);
      setTimeout(() => setCopiedMobile(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <>
      {/* Mobile Modal */}
      {showMobileModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowMobileModal(false)}
        >
          <div 
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-white/20 dark:border-slate-700/30" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 text-green-700 dark:text-green-300 rounded-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('mobile')}</h2>
              </div>
              <button onClick={() => setShowMobileModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-6 text-center tracking-wide font-mono">{employee.mobile}</p>
            <div className="flex gap-3">
              <button
                onClick={() => (window.location.href = `tel:${employee.mobile}`)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t('call') || 'تماس'}
              </button>
              <button
                onClick={() => copyToClipboard(employee.mobile, true)}
                className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {copiedMobile ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedMobile ? 'کپی شد' : 'کپی'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowEmailModal(false)}
        >
          <div 
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-white/20 dark:border-slate-700/30" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950 text-orange-700 dark:text-orange-300 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('email')}</h2>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center break-all font-mono">{employee.email}</p>
            <div className="flex gap-3">
              <button
                onClick={() => (window.location.href = `mailto:${employee.email}`)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t('sendEmail') || 'ارسال'}
              </button>
              <button
                onClick={() => copyToClipboard(employee.email, false)}
                className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {copiedEmail ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedEmail ? 'کپی شد' : 'کپی'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card - Glassmorphism Style */}
      <Card className="group h-full overflow-hidden transition-all duration-500 rounded-3xl backdrop-blur-xl border-2 border-white/30 dark:border-white/10 bg-gradient-to-br from-white/40 via-white/30 to-blue-50/30 dark:from-slate-900/40 dark:via-blue-900/20 dark:to-slate-900/30 shadow-xl hover:shadow-2xl hover:border-white/50 dark:hover:border-white/20">
        <CardContent className="p-5 sm:p-6 lg:p-7 flex flex-col h-full">
          <div className="flex flex-col h-full space-y-4">
            
            {/* Header Section - Fixed Height */}
            <div className="flex flex-col items-center text-center min-h-[140px] justify-center">
              {/* Avatar */}
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-3 border-white/60 dark:border-white/10 shadow-xl ring-4 ring-blue-400/20 dark:ring-blue-500/20 mb-3 flex-shrink-0">
                <AvatarFallback className="w-full h-full flex items-center justify-center">
                  {employee.gender === 'male' ? (
                    <AvatarMale2 size={96} />
                  ) : employee.gender === 'female' ? (
                    <AvatarFemale2 size={96} />
                  ) : (
                    <AvatarAnonymous className="w-12 h-12 sm:w-14 sm:h-14" />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Name - Ellipsis */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 px-1">
                {employee.name[lang]}
              </h3>
            </div>

            {/* Company & Department - Fixed Height */}
            <div className="flex flex-col items-center gap-2 min-h-[70px] justify-center">
              {employee.company?.[lang] && (
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <Badge className="bg-blue-100/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg line-clamp-1">
                    {employee.company?.[lang]}
                  </Badge>
                </div>
              )}
              
              <Badge className="bg-purple-100/80 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg line-clamp-1 max-w-full">
                {employee.department[lang]}
              </Badge>
            </div>

            {/* Extension Button - Fixed Height */}
            <div className="flex-grow min-h-[120px] flex items-center justify-center">
              <button
                type="button"
                onClick={() => (window.location.href = `tel:${employee.extension}`)}
                className="w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-800 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white rounded-2xl py-5 sm:py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center group/ext border border-white/20"
              >
                <div className="text-xs sm:text-sm uppercase tracking-widest opacity-95 font-bold mb-1">{t('extension')}</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-lg">{employee.extension}</div>
              </button>
            </div>

            {/* Contact Buttons - Fixed Height */}
            <div className="flex flex-col gap-2.5 min-h-[80px] justify-center">
              {(showMobile || showEmail) && (
                <div className="grid grid-cols-2 gap-2.5 auto-rows-[48px]">
                  {/* Mobile Button */}
                  {showMobile && (
                    <button
                      type="button"
                      onClick={() => setShowMobileModal(true)}
                      className="flex items-center justify-center gap-2 p-0 bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-950/60 dark:to-emerald-950/60 border-2 border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-xl hover:shadow-lg hover:scale-110 hover:border-green-500 dark:hover:border-green-600 transition-all duration-200 group font-semibold text-sm"
                    >
                      <Smartphone className="w-5 h-5 flex-shrink-0" />
                      <span className="hidden sm:inline text-xs">{t('mobile')}</span>
                    </button>
                  )}

                  {/* Email Button */}
                  {showEmail && (
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="flex items-center justify-center gap-2 p-0 bg-gradient-to-br from-orange-100/80 to-red-100/80 dark:from-orange-950/60 dark:to-red-950/60 border-2 border-orange-400 dark:border-orange-700 text-orange-700 dark:text-orange-300 rounded-xl hover:shadow-lg hover:scale-110 hover:border-orange-500 dark:hover:border-orange-600 transition-all duration-200 group font-semibold text-sm"
                    >
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span className="hidden sm:inline text-xs">{t('email')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}