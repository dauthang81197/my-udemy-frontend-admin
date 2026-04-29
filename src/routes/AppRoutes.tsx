import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { PrivateRoute } from './PrivateRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { CoursesPage } from '@/features/courses/pages/CoursesPage';
import { SectionsPage } from '@/features/sections/pages/SectionsPage';
import { LessonsPage } from '@/features/lessons/pages/LessonsPage';
import { UploadVideoPage } from '@/features/uploads/pages/UploadVideoPage';
import { ExcelImportPage } from '@/features/imports/pages/ExcelImportPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'courses', element: <CoursesPage /> },
          { path: 'courses/:courseId/sections', element: <SectionsPage /> },
          { path: 'courses/:courseId/sections/:sectionId/lessons', element: <LessonsPage /> },
          { path: 'uploads', element: <UploadVideoPage /> },
          { path: 'imports', element: <ExcelImportPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
