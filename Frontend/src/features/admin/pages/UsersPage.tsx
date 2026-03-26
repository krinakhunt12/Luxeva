import React from 'react';
import AdminLayout from '../layout/AdminLayout';

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Users Management</h3>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 italic font-serif">
            <tr className="text-xs text-gray-400 uppercase tracking-widest uppercase">
              <th className="p-6 font-bold">User</th>
              <th className="p-6 font-bold">Email</th>
              <th className="p-6 font-bold">Role</th>
              <th className="p-6 font-bold">Joined</th>
              <th className="p-6 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[1, 2, 3].map(i => (
              <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">U</div>
                    <span className="font-bold text-gray-900">User {i}</span>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-600">user{i}@example.com</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Active</span>
                </td>
                <td className="p-6 text-xs text-gray-400">March 2{i}, 2026</td>
                <td className="p-6">
                  <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
