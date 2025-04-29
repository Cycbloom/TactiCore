import { createBrowserRouter, Outlet } from 'react-router-dom';

import { TaskPage } from '../components/features/task';
import { TaskDetailPage } from '../components/features/task/TaskDetail';
import { LoginForm } from '../components/features';
import { ProtectedRoute } from '../contexts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />
  },
  {
    path: '/login',
    element: <LoginForm />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute showLoading={false}>
        <TaskPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute showLoading={false}>
        <TaskPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/tasks/:taskId',
    element: (
      <ProtectedRoute showLoading={false}>
        <TaskDetailPage />
      </ProtectedRoute>
    )
  }
]);
