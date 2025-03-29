import React from 'react';
import { useRoutes, RouteObject} from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import NotFoundPage from '../pages/404/NotFoundPage';
import DashboadPage from '../pages/dashboard/DashboadPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import Layout from '../components/Layout';
import ColorTestPage from '../components/ColorTest'
import {
  TeacherLayout,
  TeacherIndex,
  TeacherDetailPage
} from '../pages/dashboard/teachers/index';
import {userFromStorage} from '../helper/tokenHelper';
import StudentsLayout from '../pages/dashboard/students';
import StudentList from '../pages/dashboard/students/StudentList';
import { extractTokenInfo } from '../helper/extratoken';


// Component bảo vệ route
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return userFromStorage !== null ? (
    availableToken() === true ?
    (children) : React.createElement(LoginPage)
  ) : (
    React.createElement(LoginPage)
  );
};
const availableToken = (): boolean =>{
  const userToken = extractTokenInfo();
    if (!userToken || userToken.isExpired){
      return false;
    }
    return true;
}


// Định nghĩa các public routes
const publicRoutes: RouteObject[] = [
  { path: '/', element: React.createElement(HomePage) },
  { path: '/login', element: React.createElement(LoginPage) },
  { path: '/signup', element: React.createElement(SignUpPage) },
  { path: '/clm', element: React.createElement(ColorTestPage) },
  { path: '*', element: React.createElement(NotFoundPage) }
];

// Định nghĩa các private routes (yêu cầu layout và xác thực)
const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: React.createElement(PrivateRoute, { children: React.createElement(Layout) }), // Bọc Layout bằng PrivateRoute
    children: [
      { index: true, element: React.createElement(DashboadPage) },
      {
        path: 'teachers',
        element: React.createElement(PrivateRoute, { children: React.createElement(TeacherLayout) }), // Bọc TeacherLayout bằng PrivateRoute
        children: [
          { index: true, element: React.createElement(TeacherIndex) },
          { path: ':id', element: React.createElement(TeacherDetailPage) },
          { path: '*', element: React.createElement(NotFoundPage) }
        ],
      },
      {
        path: 'students',
        element: React.createElement(PrivateRoute, { children: React.createElement(StudentsLayout) }), 
        children: [
          { index: true, element: React.createElement(StudentList) },
          { path: '*', element: React.createElement(NotFoundPage) }
        ],
      },
      // {
      //   path: 'notition', 
      //   element: ,
      //   children:[
      //     {index: true, element: },
      //     {path: '*',element: React.createElement(NotFoundPage)}
      //   ]
      // },
      // {
      //   path: 'notition', 
      //   element: ,
      //   children:[
      //     {index: true, element: },
      //     {path: '*',element: React.createElement(NotFoundPage)}
      //   ]
      // },
      // {
      //   path: 'notition', 
      //   element: ,
      //   children:[
      //     {index: true, element: },
      //     {path: '*',element: React.createElement(NotFoundPage)}
      //   ]
      // },
      { path: 'settings', element: React.createElement(PrivateRoute, { children: React.createElement(SettingsPage) }) },
      { path: 'billing', element: React.createElement(PrivateRoute, { children: React.createElement(SettingsPage) }) },
      { path: 'exams', element: React.createElement(PrivateRoute, { children: React.createElement(SettingsPage) }) },
      { path: 'settings', element: React.createElement(PrivateRoute, { children: React.createElement(SettingsPage) }) },
      { path: 'features', element: React.createElement(PrivateRoute, { children: React.createElement(SettingsPage) }) },
    ],
  },
];

const AppRoutes: React.FC = () => {
  const routes = useRoutes([...publicRoutes, ...privateRoutes]);
  return routes;
};

export default AppRoutes;