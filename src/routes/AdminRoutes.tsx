import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { MediaLibrary } from '../pages/admin/MediaLibrary';
import { QuizBuilder } from '../pages/admin/QuizBuilder';
import { MemoryGameBuilder } from '../pages/admin/MemoryGameBuilder';
import { CategoryManager } from '../pages/admin/CategoryManager';
import { UserManagement } from '../pages/admin/UserManagement';
import { Analytics } from '../pages/admin/Analytics';
import { AuditLogs } from '../pages/admin/AuditLogs';
import { Workflow } from '../pages/admin/Workflow';
import { AdminGuard } from '../components/admin/AdminGuard';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={
          <AdminGuard requiredRole="viewer">
            <AdminDashboard />
          </AdminGuard>
        } />
        <Route path="media" element={
          <AdminGuard requiredRole="editor">
            <MediaLibrary />
          </AdminGuard>
        } />
        <Route path="quizzes" element={
          <AdminGuard requiredRole="editor">
            <QuizBuilder />
          </AdminGuard>
        } />
        <Route path="memory-games" element={
          <AdminGuard requiredRole="editor">
            <MemoryGameBuilder />
          </AdminGuard>
        } />
        <Route path="categories" element={
          <AdminGuard requiredRole="editor">
            <CategoryManager />
          </AdminGuard>
        } />
        <Route path="users" element={
          <AdminGuard requiredRole="admin">
            <UserManagement />
          </AdminGuard>
        } />
        <Route path="analytics" element={
          <AdminGuard requiredRole="viewer">
            <Analytics />
          </AdminGuard>
        } />
        <Route path="audit-logs" element={
          <AdminGuard requiredRole="admin">
            <AuditLogs />
          </AdminGuard>
        } />
        <Route path="workflow" element={
          <AdminGuard requiredRole="editor">
            <Workflow />
          </AdminGuard>
        } />
      </Route>
    </Routes>
  );
};

// Default export for lazy loading
export default AdminRoutes;