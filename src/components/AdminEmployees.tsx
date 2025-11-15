import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface Employee {
  id: number;
  company_id: number | null;
  company?: { en?: string; fa?: string };
  name: { en: string; fa: string };
  title: { en: string; fa: string };
  department: { en: string; fa: string };
  extension: string;
  mobile: string;
  email: string;
  photo: string;
  gender: string;
  visible: number;
  show_mobile: number;
  show_email: number;
}

interface Company {
  id: number;
  name_en: string;
  name_fa: string;
}

export const AdminEmployees: React.FC = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [formData, setFormData] = useState({
    company_id: '',
    name_en: '',
    name_fa: '',
    title_en: '',
    title_fa: '',
    dept_en: '',
    dept_fa: '',
    extension: '',
    mobile: '',
    email: '',
    photo: '',
    icon: 'unknown',
  });

  const token = localStorage.getItem('admin_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Fetch employees and companies
  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesRes, employeesRes] = await Promise.all([
        fetch(`${apiUrl}/api/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!companiesRes.ok || !employeesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const companiesData = await companiesRes.json();
      const employeesData = await employeesRes.json();

      setCompanies(companiesData);
      setEmployees(employeesData);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در بارگذاری داده‌ها',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle موبایل visibility
  const toggleMobileVisibility = async (id: number, currentValue: number) => {
    try {
      const newValue = currentValue === 1 ? 0 : 1;
      const response = await fetch(`${apiUrl}/api/admin/employees/${id}/toggle-mobile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ show_mobile: newValue }),
      });

      if (!response.ok) throw new Error('خطا در تغییر');

      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, show_mobile: newValue } : emp
      ));

      const statusText = newValue === 1 ? '✅ نمایش داده شد' : '🔒 مخفی شد';
      toast({
        title: 'موفق',
        description: `موبایل ${statusText}`,
      });
    } catch (error) {
      toast({
        title: '❌ خطا',
        description: 'خطا در تغییر موبایل',
        variant: 'destructive',
      });
    }
  };

  // Toggle ایمیل visibility
  const toggleEmailVisibility = async (id: number, currentValue: number) => {
    try {
      const newValue = currentValue === 1 ? 0 : 1;
      const response = await fetch(`${apiUrl}/api/admin/employees/${id}/toggle-email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ show_email: newValue }),
      });

      if (!response.ok) throw new Error('خطا در تغییر');

      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, show_email: newValue } : emp
      ));

      const statusText = newValue === 1 ? '✅ نمایش داده شد' : '🔒 مخفی شد';
      toast({
        title: 'موفق',
        description: `ایمیل ${statusText}`,
      });
    } catch (error) {
      toast({
        title: '❌ خطا',
        description: 'خطا در تغییر ایمیل',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name_en ||
      !formData.name_fa ||
      !formData.extension
    ) {
      toast({
        title: 'خطا',
        description: 'نام (انگلیسی/فارسی) و شماره داخلی الزامی هستند',
        variant: 'destructive',
      });
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/admin/employees/${editingId}`
        : `${apiUrl}/api/admin/employees`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          company_id: formData.company_id ? parseInt(formData.company_id) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save employee');
      }

      toast({
        title: 'موفق',
        description: editingId ? 'کاربر بروز شد' : 'کاربر اضافه شد',
      });

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description:
          error instanceof Error ? error.message : 'خطا در ذخیره کاربر',
        variant: 'destructive',
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید؟ این عمل قابل بازگشت نیست')) return;

    try {
      const response = await fetch(`${apiUrl}/api/admin/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      toast({
        title: 'موفق',
        description: 'کاربر حذف شد',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در حذف کاربر',
        variant: 'destructive',
      });
    }
  };

  // Handle toggle visibility
  const handleToggleVisibility = async (id: number, visible: number) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/employees/${id}/visibility`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ visible: visible === 1 ? 0 : 1 }),
        }
      );

      if (!response.ok) throw new Error('Failed to update visibility');

      toast({
        title: 'موفق',
        description: visible === 1 ? 'کاربر مخفی شد' : 'کاربر نمایان شد',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در بروزرسانی وضعیت',
        variant: 'destructive',
      });
    }
  };

  // Handle edit
  const handleEdit = (employee: Employee) => {
    setFormData({
      company_id: employee.company_id?.toString() || '',
      name_en: employee.name.en,
      name_fa: employee.name.fa,
      title_en: employee.title.en,
      title_fa: employee.title.fa,
      dept_en: employee.department.en,
      dept_fa: employee.department.fa,
      extension: employee.extension,
      mobile: employee.mobile,
      email: employee.email,
      photo: employee.photo,
      icon: employee.gender,
    });
    setEditingId(employee.id);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      company_id: '',
      name_en: '',
      name_fa: '',
      title_en: '',
      title_fa: '',
      dept_en: '',
      dept_fa: '',
      extension: '',
      mobile: '',
      email: '',
      photo: '',
      icon: 'unknown',
    });
    setEditingId(null);
  };

  // Handle new
  const handleNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.name.fa.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.extension.includes(searchTerm);

    const matchesCompany =
      !selectedCompany || emp.company_id?.toString() === selectedCompany;

    return matchesSearch && matchesCompany;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">مدیریت کاربران</h1>
          <p className="text-gray-600 mt-1">
            مجموعی: {filteredEmployees.length} کاربر
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          ➕ کاربر جدید
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="جستجو (نام، ایمیل، شماره داخلی)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300"
        />
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white"
        >
          <option value="">تمام شرکت‌ها</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name_fa} ({company.name_en})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">هیچ کاربری یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-4 text-right font-semibold text-gray-700">نام</th>
                <th className="px-4 py-4 text-right font-semibold text-gray-700">شرکت</th>
                <th className="px-4 py-4 text-right font-semibold text-gray-700">عنوان</th>
                <th className="px-4 py-4 text-right font-semibold text-gray-700">ایمیل</th>
                <th className="px-4 py-4 text-right font-semibold text-gray-700">وضعیت</th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    employee.visible === 0 ? 'bg-gray-100 opacity-75' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {employee.name.fa}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.name.en}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">
                      {employee.company?.en || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">
                      {employee.title.fa}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600 truncate">
                      {employee.email}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {employee.visible === 1 ? (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        👁️ نمایان
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        🔒 مخفی
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-left">
                    <div className="flex gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="ویرایش"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleToggleVisibility(employee.id, employee.visible)
                        }
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          employee.visible === 1
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title="نمایش/مخفی"
                      >
                        {employee.visible === 1 ? '👁️' : '🔒'}
                      </button>
                      <button
                        onClick={() => toggleMobileVisibility(employee.id, employee.show_mobile)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          employee.show_mobile === 1
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                        title="موبایل مخفی/نمایش"
                      >
                        {employee.show_mobile === 1 ? '📱' : '🚫'}
                      </button>
                      <button
                        onClick={() => toggleEmailVisibility(employee.id, employee.show_email)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          employee.show_email === 1
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                        title="ایمیل مخفی/نمایش"
                      >
                        {employee.show_email === 1 ? '📧' : '🚫'}
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? '✏️ ویرایش کاربر' : '➕ کاربر جدید'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    شرکت
                  </label>
                  <select
                    value={formData.company_id}
                    onChange={(e) =>
                      setFormData({ ...formData, company_id: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  >
                    <option value="">بدون شرکت</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name_fa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    جنسیت
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  >
                    <option value="unknown">نامشخص</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    نام (انگلیسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="First Last Name"
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
                    نام (فارسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={formData.name_fa}
                    onChange={(e) =>
                      setFormData({ ...formData, name_fa: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    عنوان (انگلیسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="Job Title"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    عنوان (فارسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="سمت و عنوان"
                    value={formData.title_fa}
                    onChange={(e) =>
                      setFormData({ ...formData, title_fa: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    بخش (انگلیسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="Department"
                    value={formData.dept_en}
                    onChange={(e) =>
                      setFormData({ ...formData, dept_en: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    بخش (فارسی)
                  </label>
                  <Input
                    type="text"
                    placeholder="بخش"
                    value={formData.dept_fa}
                    onChange={(e) =>
                      setFormData({ ...formData, dept_fa: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    شماره داخلی ⚠️
                  </label>
                  <Input
                    type="text"
                    placeholder="1234"
                    value={formData.extension}
                    onChange={(e) =>
                      setFormData({ ...formData, extension: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    موبایل
                  </label>
                  <Input
                    type="tel"
                    placeholder="09xxxxxxxxx"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  ایمیل
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ✓ ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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
