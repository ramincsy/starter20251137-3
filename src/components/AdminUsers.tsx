import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: number;
  created_at: string;
}

export const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const token = localStorage.getItem('admin_token');
  const apiUrl = import.meta.env.VITE_API_URL;

  const apiBase = apiUrl || 'http://localhost:3001';

  // Fetch admins from backend
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` || '' },
      });

      if (response.status === 401) {
        toast({ title: 'خطای احراز هویت', description: 'لطفاً دوباره وارد شوید', variant: 'destructive' });
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        const txt = await response.text();
        console.error('Failed to fetch admins:', txt);
        toast({ title: 'خطا', description: 'دریافت لیست ادمین‌ها ناموفق بود', variant: 'destructive' });
        return;
      }

      const data = await response.json();
      // backend returns an array of admin objects
      setAdmins(data || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      toast({
        title: 'خطا',
        description: 'تمام فیلدها الزامی هستند',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = { username: formData.username.trim(), password: formData.password, email: formData.email.trim(), role: 'admin' };
      const response = await fetch(`${apiBase}/api/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || '',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        toast({ title: 'خطای احراز هویت', description: 'دسترسی ندارید - لطفاً ورود کنید', variant: 'destructive' });
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

      if (response.status === 409) {
        toast({ title: 'خطا', description: 'نام کاربری تکراری است', variant: 'destructive' });
        return;
      }

      if (!response.ok) {
        const txt = await response.text();
        console.error('Failed to create admin:', txt);
        toast({ title: 'خطا', description: 'خطا در ایجاد ادمین', variant: 'destructive' });
        return;
      }

      toast({ title: 'موفق', description: 'ادمین جدید ایجاد شد' });
      setFormData({ username: '', password: '', email: '' });
      setShowModal(false);
      fetchAdmins();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در ذخیره ادمین',
        variant: 'destructive',
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const response = await fetch(`${apiBase}/api/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` || '' },
      });

      if (response.status === 401) {
        toast({ title: 'خطای احراز هویت', description: 'دسترسی ندارید - لطفاً ورود کنید', variant: 'destructive' });
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        const txt = await response.text();
        console.error('Failed to delete admin:', txt);
        toast({ title: 'خطا', description: 'خطا در حذف ادمین', variant: 'destructive' });
        return;
      }

      toast({ title: 'موفق', description: 'ادمین حذف شد' });
      fetchAdmins();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در حذف ادمین',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">مدیریت ادمین‌ها</h1>
          <p className="text-gray-600 mt-1">
            🔴 فقط Super Admin می‌تواند ادمین جدید اضافه یا حذف کند
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          ➕ ادمین جدید
        </Button>
      </div>

      {/* Current Admin Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold text-blue-900 mb-4">📋 اطلاعات ادمین فعلی:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">نام کاربری:</p>
            <p className="font-semibold text-blue-900">
              {JSON.parse(localStorage.getItem('admin_user') || '{}').username}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">سطح دسترسی:</p>
            <p className="font-semibold text-blue-900">
              {JSON.parse(localStorage.getItem('admin_user') || '{}').role ===
              'super_admin'
                ? '🔴 Super Admin'
                : '🟢 Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Admins List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
          <p className="text-2xl mb-2">🔐</p>
          <p className="text-gray-600 font-semibold mb-4">
            حالاً یک ادمین Super فعال وجود دارد
          </p>
          <p className="text-gray-500 text-sm">
            ادمین‌های دیگری را از اینجا اضافه یا حذف کنید
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  نام کاربری
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  ایمیل
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  سطح دسترسی
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {admin.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        admin.role === 'super_admin'
                          ? 'px-3 py-1 bg-red-100 text-red-700 rounded text-sm'
                          : 'px-3 py-1 bg-green-100 text-green-700 rounded text-sm'
                      }
                    >
                      {admin.role === 'super_admin' ? '🔴 Super Admin' : '🟢 Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.is_active === 1 ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        ✓ فعال
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        ✕ غیرفعال
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      🗑️ حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-3">⚠️ نکات امنیتی:</h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>✓ هر ادمین می‌تواند کاربران و شرکت‌ها را مدیریت کند</li>
          <li>✓ فقط Super Admin می‌تواند ادمین جدید اضافه/حذف کند</li>
          <li>✓ رمز عبور باید حداقل 8 کاراکتر داشته باشد</li>
          <li>✓ برای غیرفعال کردن ادمین، از اینجا حذف کنید</li>
          <li>✓ تمام فعالیت‌های حساس ثبت می‌شود</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ➕ ادمین جدید
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  نام کاربری
                </label>
                <Input
                  type="text"
                  placeholder="نام کاربری"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  رمز عبور
                </label>
                <Input
                  type="password"
                  placeholder="رمز عبور قوی"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  حداقل 8 کاراکتر شامل حروف، اعداد و نماد
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  ایمیل
                </label>
                <Input
                  type="email"
                  placeholder="ایمیل"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ✓ ایجاد
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
                >
                  ✕ انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
