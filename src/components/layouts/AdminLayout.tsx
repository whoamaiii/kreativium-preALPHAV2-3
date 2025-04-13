import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../admin/AdminSidebar';
import { AdminHeader } from '../admin/AdminHeader';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1625]">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};