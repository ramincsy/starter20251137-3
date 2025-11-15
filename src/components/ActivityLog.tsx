import React, { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';

interface ActivityLogEntry {
  id: number;
  admin_username: string;
  action_type: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  status: string;
  created_at: string;
}

interface ActivityStats {
  CREATE: number;
  UPDATE: number;
  DELETE: number;
  TOGGLE_VISIBILITY: number;
  LOGIN: number;
}

export const ActivityLog: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActionType, setFilterActionType] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');
  const [limit, setLimit] = useState(50);
  const [stats, setStats] = useState<Partial<ActivityStats>>({});

  const token = localStorage.getItem('admin_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let url = `${apiUrl}/api/activity-logs?limit=${limit}`;

      if (filterActionType) url += `&action_type=${filterActionType}`;
      if (filterEntityType) url += `&entity_type=${filterEntityType}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast({ title: 'خطا', description: 'خطا در دریافت لاگ فعالیت', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/activity-logs/stats/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats.reduce((acc: any, s: any) => {
          acc[s.action_type] = s.count;
          return acc;
        }, {}));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filterActionType, filterEntityType, limit]);

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, string> = {
      CREATE: '✨',
      UPDATE: '✏️',
      DELETE: '🗑️',
      TOGGLE_VISIBILITY: '👁️',
      LOGIN: '🔐',
    };
    return icons[actionType] || '📝';
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      CREATE: 'text-green-600 bg-green-50',
      UPDATE: 'text-blue-600 bg-blue-50',
      DELETE: 'text-red-600 bg-red-50',
      TOGGLE_VISIBILITY: 'text-orange-600 bg-orange-50',
      LOGIN: 'text-purple-600 bg-purple-50',
    };
    return colors[actionType] || 'text-gray-600 bg-gray-50';
  };

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, string> = {
      employee: '👤',
      company: '🏢',
      admin: '🔐',
    };
    return icons[entityType] || '📌';
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      // Minutes
      if (diff < 60000) return 'لحظاتی پیش';
      // Hours
      if (diff < 3600000) return `${Math.floor(diff / 60000)} دقیقه پیش`;
      // Days
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعت پیش`;
      
      return date.toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">سیاق فعالیت‌ها</h1>
        <p className="text-gray-600 mt-2">
          مشاهده تمام فعالیت‌های اخیر و تغییرات سامانه
        </p>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">✨ اضافه شده</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.CREATE || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">✏️ ویرایش شده</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.UPDATE || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">🗑️ حذف شده</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.DELETE || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">👁️ نمایش/مخفی</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{stats.TOGGLE_VISIBILITY || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">🔐 ورود</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{stats.LOGIN || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔍 فیلتر‌ها</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع عملیات
            </label>
            <select
              value={filterActionType}
              onChange={(e) => setFilterActionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">همه عملیات</option>
              <option value="CREATE">✨ اضافه</option>
              <option value="UPDATE">✏️ ویرایش</option>
              <option value="DELETE">🗑️ حذف</option>
              <option value="TOGGLE_VISIBILITY">👁️ نمایش/مخفی</option>
              <option value="LOGIN">🔐 ورود</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع مورد
            </label>
            <select
              value={filterEntityType}
              onChange={(e) => setFilterEntityType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">تمام موارد</option>
              <option value="employee">👤 کاربر</option>
              <option value="company">🏢 شرکت</option>
              <option value="admin">🔐 ادمین</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد نمایش
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-gray-600 font-semibold">
            فعالیتی برای نمایش وجود ندارد
          </p>
          <p className="text-gray-500 text-sm mt-2">
            فیلتر‌های خود را تغییر دهید یا بعداً دوباره بررسی کنید
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getActionColor(log.action_type)}`}>
                  {getActionIcon(log.action_type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">
                      {log.description}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {getEntityIcon(log.entity_type)} {log.entity_type === 'employee' ? 'کاربر' : log.entity_type === 'company' ? 'شرکت' : 'ادمین'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>👤 {log.admin_username}</span>
                    <span>⏰ {formatTime(log.created_at)}</span>
                    {log.status === 'success' && <span className="text-green-600">✅ موفق</span>}
                    {log.status === 'failed' && <span className="text-red-600">❌ ناموفق</span>}
                  </div>

                  {log.old_value && log.new_value && (
                    <div className="mt-3 text-xs bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">
                        <span className="font-semibold">تغییر:</span> {log.old_value} → {log.new_value}
                      </p>
                    </div>
                  )}
                </div>

                {/* ID Badge */}
                <div className="text-xs text-gray-400 shrink-0">
                  #{log.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📖 راهنما</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div>✨ <span className="font-medium">اضافه:</span> کاربر یا شرکت جدید اضافه شد</div>
          <div>✏️ <span className="font-medium">ویرایش:</span> اطلاعات تغییر کرد</div>
          <div>🗑️ <span className="font-medium">حذف:</span> کاربر یا شرکت حذف شد</div>
          <div>👁️ <span className="font-medium">نمایش/مخفی:</span> وضعیت دیده‌شدن تغییر کرد</div>
          <div>🔐 <span className="font-medium">ورود:</span> ادمین وارد شد</div>
          <div>📌 <span className="font-medium">شرکت:</span> عملیات مربوط به شرکت</div>
        </div>
      </div>
    </div>
  );
};
