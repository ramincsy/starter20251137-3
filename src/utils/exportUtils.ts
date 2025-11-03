import { Employee } from '@/types/employee';
import * as XLSX from 'xlsx';

export const exportToExcel = (employees: Employee[], language: 'en' | 'fa') => {
  const data = employees.map(emp => ({
    Name: emp.name[language],
    Title: emp.title[language],
    Department: emp.department[language],
    Extension: emp.extension,
    Mobile: emp.mobile,
    Email: emp.email
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
  XLSX.writeFile(wb, `contacts_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (employees: Employee[], language: 'en' | 'fa') => {
  const data = employees.map(emp => ({
    Name: emp.name[language],
    Title: emp.title[language],
    Department: emp.department[language],
    Extension: emp.extension,
    Mobile: emp.mobile,
    Email: emp.email
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportToJSON = (employees: Employee[], language: 'en' | 'fa') => {
  const data = employees.map(emp => ({
    name: emp.name[language],
    title: emp.title[language],
    department: emp.department[language],
    extension: emp.extension,
    mobile: emp.mobile,
    email: emp.email
  }));

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};