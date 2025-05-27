import React from 'react';
import { useRoutes, RouteObject, Navigate } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import NotFoundPage from '../pages/404/NotFoundPage';
import DashboadPage from '../pages/dashboard/DashboadPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import Layout from '../components/Layout';
import ColorTestPage from '../components/ColorTest';
import {
  TeacherLayout,
  TeacherIndex,
  TeacherDetailPage
} from '../pages/dashboard/teachers/index';
import StudentsLayout from '../pages/dashboard/students';
import StudentList from '../pages/dashboard/students/StudentList';
import { userFromStorage } from '../helper/tokenHelper';
import { extractTokenInfo } from '../helper/extratoken';
import NotificationSelector from '../pages/dashboard/notification/NotificationSelecter';
import ExamManagement from '../pages/dashboard/exams';
import SettingAndProfile from '../pages/dashboard/settings';
import BillLayout from '../pages/dashboard/billing';
import TeaturesLayout from '../pages/dashboard/features';
import NotificationLayout from '../pages/dashboard/notification';
import NotificationScreen from '../pages/dashboard/notification/NotificationScreen';
import SendAcademicNotificationScreen from '../pages/dashboard/notification/SendAcademicNotificationScreen';

// Hàm kiểm tra token còn hạn hay không
const availableToken = (): boolean => {
  const userToken = extractTokenInfo();
  return userToken !== null && !userToken.isExpired;
};

// Component bảo vệ route
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // if (!userFromStorage || !availableToken()) {
  //   return React.createElement(Navigate, { to: '/login', replace: true });
  // }
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
          { path: 'condition', element: React.createElement(NotificationSelector)},
          { path: 'academic', element: React.createElement(SendAcademicNotificationScreen)},
          { path: '*', element: React.createElement(NotFoundPage) },
        ],
      },
      { path: 'settings', element: React.createElement(SettingAndProfile) },
      { path: 'billing', element: React.createElement(BillLayout) },
      { path: 'exams', element: React.createElement(ExamManagement) },
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
