import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Sử dụng thư viện jwt-decode
import {
  loginRequest,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import { getTeachers } from '../../store/slices/teacherSlice';
import { getStudents } from '../../store/slices/studentSlice';

interface LoginFormValues {
  username: string;
  password: string;
}

// Wrapper service cho localStorage
const storageService = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Hàm kiểm tra tính hợp lệ của token (sử dụng thư viện)
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      const expiryDate = decoded.exp * 1000;
      console.log("Token hop le?: ",new Date().getTime() < expiryDate);
      return new Date().getTime() < expiryDate;
    } catch (error) {
      console.error('Token validation error:', error);
      return false; // Token không hợp lệ nếu có lỗi giải mã
    }
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    const persistedRoot = storageService.getItem('persist:root');
    let hasStudents: boolean = false;
    let hasTeachers: boolean = false;

    if (persistedRoot) {
        try {
            const persistedData = JSON.parse(persistedRoot);
            // Check for the existence of student and teacher data
            hasStudents = persistedData.students && persistedData.students.students && persistedData.students.students.length > 0;
            hasTeachers = persistedData.teachers && persistedData.teachers.teachers && persistedData.teachers.teachers.length > 0;

        } catch (error) {
            console.error("Error parsing persisted data:", error);
            // Handle the error appropriately, e.g., set an error state
        }
    }
    console.log('Fuck youyou: ', persistedRoot);
    console.log('hasStudents:', hasStudents , 'hasTeachers:',hasTeachers);

    try {
        if (hasStudents || hasTeachers) {
            const fetchStudentsData = async () => {
                let currentStudentPage = 0;
                let studentHasMore = true;
                while (studentHasMore) {
                    const res = await dispatch(getStudents(currentStudentPage) as any).unwrap();
                    studentHasMore = res?.hasMore;
                    currentStudentPage += 1;
                }
            };

            const fetchTeachersData = async () => {
                let currentTeacherPage = 0;
                let teacherHasMore = true;
                while (teacherHasMore) {
                    const res = await dispatch(getTeachers(currentTeacherPage) as any).unwrap();
                    teacherHasMore = res?.hasMore;
                    currentTeacherPage += 1;
                }
            };
            await Promise.all([fetchStudentsData(), fetchTeachersData()]);
        }
    } catch (error) {
        console.error("Error fetching initial data", error);
    } finally {
        setIsLoading(false);
    }
}, [dispatch]);


  // Kiểm tra token và chuyển hướng
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); // Set loading at the beginning

      try {
          const authUserString = storageService.getItem('persist:authUser');
          console.log("authUserString:", authUserString); // Log authUserString
          const authUser = authUserString ? JSON.parse(authUserString) : null;
          console.log("authUser:", authUser); // Log authUser

          if (authUser?.token) {
              // No need to parse authUser.token again, it's already an object
              const { accessToken } = JSON.parse(authUser.token);
              
              console.log("accessToken:", accessToken); // Log accessToken

              if (accessToken !== null && isTokenValid(accessToken)) {
                console.log("sdnvsdnvkdfnknsvsodmcsdcnsdjAaaaaaaaaaaaaaaaaaaaaaaaaa");
                  navigate('/dashboard');
                  fetchData();
                  return; // Important: Exit the function after successful navigation
              }
          }
          setIsLoading(false); // Set loading to false if not authenticated
      } catch (error) {
          console.error("Error checking authentication:", error);
          setIsLoading(false); // Set loading to false on error
      }
  };
    checkAuth();
  }, [navigate, isTokenValid, fetchData]);

  const handleLogin = useCallback(
    async (values: LoginFormValues) => {
      dispatch(clearError()); // Clear error before dispatching loginRequest
      try {
        if(await dispatch(loginRequest(values)).unwrap()){
          navigate('/dashboard');
          //fetchData();
          return;
        }
      } catch (err: any) { // Type err as any
        console.error('Login failed:', err);
        // Error is handled by the slice, no need to set error state here
      }
    },
    [dispatch, navigate]
  );

  // Tự động xóa thông báo lỗi sau 3 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Nếu đang loading, hiển thị loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-90 px-4">
      <div className="w-full max-w-md bg-secondary-10 p-8 rounded-xl shadow-md">
        <Typography.Title level={3} className="text-center mb-2 !text-gray-800">
          Welcome, Log into your <span className="text-blue-600">account</span>
        </Typography.Title>

        <Typography.Paragraph className="text-center text-gray-600 mb-6 text-sm">
          It is our great pleasure to have you on board!
        </Typography.Paragraph>

        <Form
          name="login_form"
          onFinish={handleLogin}
          layout="vertical"
          disabled={loading}
          className="max-w-[400px] mx-auto"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your school name!' }]}
            label="User Name"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter the name of school"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your Password!' }]}
            label="Password"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter Password"
              className="py-2"
            />
          </Form.Item>

          {error && (
            <Alert
              message="Login Error"
              description={typeof error === 'string' ? error : 'Login failed'}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
