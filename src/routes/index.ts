import React from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import ColorTestPage from '../components/ColorTest';
import Layout from '../components/Layout';
//import { extractTokenInfo } from '../helper/extratoken';
import NotFoundPage from '../pages/404/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import BillLayout from '../pages/dashboard/billing';
import DashboadPage from '../pages/dashboard/DashboadPage';
import TeaturesLayout from '../pages/dashboard/features';
import NotificationLayout from '../pages/dashboard/notification';
import NotificationSystem from '../pages/dashboard/notification/NotificationSystem';
import EnhancedNotificationSystem from '../pages/dashboard/notification/notification_academic/index';
import SettingAndProfile from '../pages/dashboard/settings';
import StudentsLayout from '../pages/dashboard/students';
import StudentList from '../pages/dashboard/students/StudentList';
import {
  TeacherDetailPage,
  TeacherIndex,
  TeacherLayout
} from '../pages/dashboard/teachers/index';
import HomePage from '../pages/home/HomePage';
import { TokenManager } from '../config/axios';
import NotificationScreen from '../pages/dashboard/notification/notification_dashboard/NotificationScreen';
import PracticeTestManagement from '../pages/dashboard/exams';
import TimetableApp from '../pages/dashboard/schedule/ScheduleTimeline';


// Component bảo vệ route
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!TokenManager.hasValidToken(null)) {
    return React.createElement(Navigate, { to: '/login', replace: true });
  }
  return React.createElement(React.Fragment, null, children);
};

// Các route không yêu cầu đăng nhập
const publicRoutes: RouteObject[] = [
  { path: '/', element: React.createElement(HomePage) },
  { path: '/login', element: React.createElement(LoginPage) },
  { path: '/signup', element: React.createElement(SignUpPage) },
  { path: '/clm', element: React.createElement(ColorTestPage) },
  { path: '*', element: React.createElement(NotFoundPage) },
];

// Các route yêu cầu đăng nhập
const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: React.createElement(
      PrivateRoute,
      {children: React.createElement(Layout)}
    ),
    children: [
      { index: true, element: React.createElement(DashboadPage) },
      {
        path: 'teachers',
        element: React.createElement(TeacherLayout),
        children: [
          { index: true, element: React.createElement(TeacherIndex) },
          { path: ':id', element: React.createElement(TeacherDetailPage) },
          { path: '*', element: React.createElement(NotFoundPage) },
        ],
      },
      {
        path: 'students',
        element: React.createElement(StudentsLayout),
        children: [
          { index: true, element: React.createElement(StudentList) },
          { path: '*', element: React.createElement(NotFoundPage) },
        ],
      },
      {
        path: 'notition',
        element: React.createElement(NotificationLayout),
        children: [
          { index: true, element: React.createElement(NotificationScreen) },
          { path: 'condition', element: React.createElement(NotificationSystem)},
          { path: 'academic', element: React.createElement(EnhancedNotificationSystem)},
          { path: '*', element: React.createElement(NotFoundPage) },
        ],
      },
      { path: 'settings', element: React.createElement(SettingAndProfile) },
      { path: 'schedule', element: React.createElement(TimetableApp) },
      { path: 'billing', element: React.createElement(BillLayout) },
      { path: 'exams', element: React.createElement(PracticeTestManagement) },
      { path: 'features', element: React.createElement(TeaturesLayout) },
    ],
  },
];//NotificationLayout

// Combine các route
const AppRoutes: React.FC = () => {
  const routes = useRoutes([...publicRoutes, ...privateRoutes]);
  return routes;
};

export default AppRoutes;
