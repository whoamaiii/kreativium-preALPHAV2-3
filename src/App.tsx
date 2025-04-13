import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminGuard } from './components/admin/AdminGuard';

// Lazily load page components
const Home = lazy(() => import('./pages/Home'));
const Quiz = lazy(() => import('./pages/Quiz'));
const EnhancedQuizGame = lazy(() => import('./pages/EnhancedQuizGame'));
const QuizResults = lazy(() => import('./pages/QuizResults'));
const Memory = lazy(() => import('./pages/Memory'));
const MemoryGame = lazy(() => import('./pages/MemoryGame'));
const Results = lazy(() => import('./pages/Results'));
const Settings = lazy(() => import('./pages/Settings'));
const Dictionary = lazy(() => import('./pages/Dictionary'));
const FeelingsTracker = lazy(() => import('./pages/FeelingsTracker'));
const KidsManagement = lazy(() => import('./pages/KidsManagement'));
const ILP = lazy(() => import('./pages/ILP'));
const ILPManagement = lazy(() => import('./pages/ILPManagement'));
const AAC = lazy(() => import('./pages/AAC'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));

// Lazy loading wrapper component with error boundary
const LazyComponent = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading className="min-h-[300px]" />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={
          <LazyComponent>
            <Home />
          </LazyComponent>
        } />
        
        <Route path="quiz">
          <Route index element={
            <LazyComponent>
              <Quiz />
            </LazyComponent>
          } />
          <Route path=":categoryId" element={
            <LazyComponent>
              <EnhancedQuizGame />
            </LazyComponent>
          } />
          <Route path="results" element={
            <LazyComponent>
              <QuizResults />
            </LazyComponent>
          } />
        </Route>
        
        <Route path="memory">
          <Route index element={
            <LazyComponent>
              <Memory />
            </LazyComponent>
          } />
          <Route path=":categoryId" element={
            <LazyComponent>
              <MemoryGame />
            </LazyComponent>
          } />
          <Route path="results" element={
            <LazyComponent>
              <Results />
            </LazyComponent>
          } />
        </Route>
        
        <Route path="settings" element={
          <LazyComponent>
            <Settings />
          </LazyComponent>
        } />
        
        <Route path="dictionary" element={
          <LazyComponent>
            <Dictionary />
          </LazyComponent>
        } />
        
        <Route path="feelings-tracker" element={
          <LazyComponent>
            <FeelingsTracker />
          </LazyComponent>
        } />
        
        <Route path="kids" element={
          <LazyComponent>
            <KidsManagement />
          </LazyComponent>
        } />
        
        <Route path="ilp">
          <Route index element={
            <LazyComponent>
              <ILP />
            </LazyComponent>
          } />
          <Route path="management" element={
            <LazyComponent>
              <ILPManagement />
            </LazyComponent>
          } />
        </Route>
        
        <Route path="aac" element={
          <LazyComponent>
            <AAC />
          </LazyComponent>
        } />
        
        <Route path="*" element={
          <LazyComponent>
            <NotFound />
          </LazyComponent>
        } />
      </Route>
      
      <Route path="/admin/*" element={
        <AdminGuard>
          <LazyComponent>
            <AdminRoutes />
          </LazyComponent>
        </AdminGuard>
      } />
    </Routes>
  );
};
