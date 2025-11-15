import React, { useEffect, useState } from 'react';

interface Stats {
  totalCompanies: number;
  totalEmployees: number;
  visibleEmployees: number;
  hiddenEmployees: number;
}

interface ActivityLogEntry {
  id: number;
  admin_username: string;
  action_type: string;
  entity_type: string;
  entity_name: string;
  description: string;
  created_at: string;
  status: string;
}

interface DailyStats {
  CREATE: number;
  UPDATE: number;
  DELETE: number;
  TOGGLE_VISIBILITY: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCompanies: 0,
    totalEmployees: 0,
    visibleEmployees: 0,
    hiddenEmployees: 0,
  });
  const [recentLogs, setRecentLogs] = useState<ActivityLogEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<Partial<DailyStats>>({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('admin_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch stats
        const companiesRes = await fetch(`${apiUrl}/api/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companies = await companiesRes.json();

        const employeesRes = await fetch(`${apiUrl}/api/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const employees = await employeesRes.json();

        const visibleEmployees = employees.filter(
          (emp: any) => emp.visible === 1
        ).length;
        const hiddenEmployees = employees.length - visibleEmployees;

        setStats({
          totalCompanies: companies.length,
          totalEmployees: employees.length,
          visibleEmployees,
          hiddenEmployees,
        });

        // Fetch recent activity logs
        const logsRes = await fetch(`${apiUrl}/api/activity-logs/recent/5`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (logsRes.ok) {
          const logs = await logsRes.json();
          setRecentLogs(logs);
        }

        // Fetch daily stats
        const statsRes = await fetch(`${apiUrl}/api/activity-logs/stats/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statsRes.ok) {
          const data = await statsRes.json();
          const statsMap: any = {};
          data.stats.forEach((s: any) => {
            statsMap[s.action_type] = s.count;
          });
          setDailyStats(statsMap);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: number;
    color: string;
  }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div
          className={`w-16 h-16 rounded-full ${color} bg-opacity-20 flex items-center justify-center text-3xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">خوش آمدید به پنل ادمین</h1>
        <p className="text-gray-600 mt-2">
          مرور سریع وضعیت سامانه و مدیریت شرکت‌ها و کاربران
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-32 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="🏢"
            label="تعداد شرکت‌ها"
            value={stats.totalCompanies}
            color="border-blue-500"
          />
          <StatCard
            icon="👥"
            label="کل کاربران"
            value={stats.totalEmployees}
            color="border-green-500"
          />
          <StatCard
            icon="👁️"
            label="کاربران فعال"
            value={stats.visibleEmployees}
            color="border-purple-500"
          />
          <StatCard
            icon="🔒"
            label="کاربران مخفی"
            value={stats.hiddenEmployees}
            color="border-red-500"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">دسترسی سریع</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/companies"
            className="block p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="font-semibold mb-2">مدیریت شرکت‌ها</h3>
            <p className="text-sm text-blue-100">
              مشاهده و مدیریت شرکت‌های فعال
            </p>
          </a>

          <a
            href="/admin/employees"
            className="block p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold mb-2">مدیریت کاربران</h3>
            <p className="text-sm text-green-100">
              افزودن، ویرایش و حذف کاربران
            </p>
          </a>

          <a
            href="/admin/users"
            className="block p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-semibold mb-2">مدیریت ادمین‌ها</h3>
            <p className="text-sm text-purple-100">
              مدیریت حساب‌های ادمین سیستم
            </p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📊 فعالیت‌های اخیر</h2>
          <a
            href="/admin/activity"
            className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
          >
            مشاهده همه →
          </a>
        </div>

        {/* Today Stats */}
        {Object.keys(dailyStats).length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-3">📈 <span className="font-semibold">فعالیت‌های امروز:</span></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dailyStats.CREATE && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dailyStats.CREATE}</p>
                  <p className="text-xs text-gray-600">✨ اضافه</p>
                </div>
              )}
              {dailyStats.UPDATE && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dailyStats.UPDATE}</p>
                  <p className="text-xs text-gray-600">✏️ ویرایش</p>
                </div>
              )}
              {dailyStats.DELETE && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{dailyStats.DELETE}</p>
                  <p className="text-xs text-gray-600">🗑️ حذف</p>
                </div>
              )}
              {dailyStats.TOGGLE_VISIBILITY && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{dailyStats.TOGGLE_VISIBILITY}</p>
                  <p className="text-xs text-gray-600">👁️ نمایش/مخفی</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Logs */}
        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="text-xl mt-1">
                  {log.action_type === 'CREATE' && '✨'}
                  {log.action_type === 'UPDATE' && '✏️'}
                  {log.action_type === 'DELETE' && '🗑️'}
                  {log.action_type === 'TOGGLE_VISIBILITY' && '👁️'}
                  {!['CREATE', 'UPDATE', 'DELETE', 'TOGGLE_VISIBILITY'].includes(log.action_type) && '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium">
                    {log.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    👤 {log.admin_username} • {new Date(log.created_at).toLocaleTimeString('fa-IR')}
                  </p>
                </div>
                {log.status === 'success' && (
                  <span className="text-xs text-green-600 font-semibold">✅</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>📭 فعالیتی برای نمایش وجود ندارد</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">💡 نکات مفید</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ برای اضافه کردن شرکت جدید به بخش "مدیریت شرکت‌ها" رفته</li>
          <li>✓ می‌توانید کاربران را مخفی یا نمایان کنید</li>
          <li>✓ تنها Super Admin می‌تواند ادمین جدید اضافه کند</li>
          <li>✓ تمام تغییرات فوراً در سامانه اعمال می‌شوند</li>
        </ul>
      </div>
    </div>
  );
};
