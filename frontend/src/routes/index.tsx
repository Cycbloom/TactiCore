import { createBrowserRouter, Outlet } from 'react-router-dom';

import TaskPage from '../pages/TaskPage';
import { ProtectedRoute } from '../contexts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'tasks',
        element: <TaskPage />
      }
    ]
  }
]);
