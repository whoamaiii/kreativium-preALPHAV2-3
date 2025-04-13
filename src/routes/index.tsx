import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AdminGuard } from '../components/admin/AdminGuard';
import { AdminRoutes } from './AdminRoutes';
import Home from '../pages/Home';
import Quiz from '../pages/Quiz';
import QuizGame from '../pages/QuizGame';
import Memory from '../pages/Memory';
import MemoryGame from '../pages/MemoryGame';
import Results from '../pages/Results';
import NotFound from '../pages/NotFound';
import { Unauthorized } from '../pages/Unauthorized';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz">
          <Route index element={<Quiz />} />
          <Route path="category/:categoryId" element={<QuizGame />} />
          <Route path="results" element={<Results />} />
        </Route>
        <Route path="memory">
          <Route index element={<Memory />} />
          <Route path=":categoryId" element={<MemoryGame />} />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      
      <Route path="/admin/*" element={
        <AdminGuard>
          <AdminRoutes />
        </AdminGuard>
      } />
    </Routes>
  );
};