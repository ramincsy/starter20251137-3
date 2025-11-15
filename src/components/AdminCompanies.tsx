import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface Company {
  id: number;
  name_en: string;
  name_fa: string;
  created_at: string;
}

export const AdminCompanies: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_fa: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('admin_token');
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch companies');

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در بارگذاری شرکت‌ها',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en || !formData.name_fa) {
      toast({
        title: 'خطا',
        description: 'تمام فیلدها الزامی هستند',
        variant: 'destructive',
      });
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/companies/${editingId}`
        : `${apiUrl}/api/companies`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save company');

      toast({
        title: 'موفق',
        description: editingId ? 'شرکت بروز شد' : 'شرکت اضافه شد',
      });

      setFormData({ name_en: '', name_fa: '' });
      setEditingId(null);
      setShowModal(false);
      fetchCompanies();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در ذخیره شرکت',
        variant: 'destructive',
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const response = await fetch(`${apiUrl}/api/companies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete company');

      toast({
        title: 'موفق',
        description: 'شرکت حذف شد',
      });

      fetchCompanies();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در حذف شرکت',
        variant: 'destructive',
      });
    }
  };

  // Handle edit
  const handleEdit = (company: Company) => {
    setFormData({ name_en: company.name_en, name_fa: company.name_fa });
    setEditingId(company.id);
    setShowModal(true);
  };

  // Handle new
  const handleNew = () => {
    setFormData({ name_en: '', name_fa: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.name_fa.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">مدیریت شرکت‌ها</h1>
          <p className="text-gray-600 mt-1">
            مجموعی: {filteredCompanies.length} شرکت
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          ➕ شرکت جدید
        </Button>
      </div>

      {/* Search */}
      <div>
        <Input
          type="text"
          placeholder="جستجو در شرکت‌ها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">هیچ شرکتی یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  نام انگلیسی
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  نام فارسی
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  تاریخ ایجاد
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {company.name_en}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-700">{company.name_fa}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(company.created_at).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-6 py-4 text-left space-x-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      ✏️ ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? '✏️ ویرایش شرکت' : '➕ شرکت جدید'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  نام انگلیسی
                </label>
                <Input
                  type="text"
                  placeholder="Company Name"
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  نام فارسی
                </label>
                <Input
                  type="text"
                  placeholder="نام شرکت"
                  value={formData.name_fa}
                  onChange={(e) =>
                    setFormData({ ...formData, name_fa: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ✓ ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
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
