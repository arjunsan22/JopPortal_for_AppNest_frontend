// src/components/layout/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, Admin
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scroll only this area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}