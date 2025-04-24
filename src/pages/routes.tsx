

import Dashboard from './Dashboard';
import Configuration from './Configuration';
import Analytics from './Analytics';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export interface AppRoute {
  path: string;
  name: string;
  element?: JSX.Element;
  private?: boolean;
  children?: AppRoute[];
}

const routes: AppRoute[] = [
    { path: '/', name: 'Home',  element: <Navigate to="/dashboard" replace /> },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
  
    // Private/Admin routes
    { path: '/dashboard/*', name: 'Dashboard', element: <Dashboard />, private: false },
    { path: '/configuration', name: 'Configuration', element: <Configuration />, private: false },
    { path: '/analytics', name: 'Analytics', element: <Analytics />, private: false },
  ];
  
  export default routes;