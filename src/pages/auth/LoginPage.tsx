import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import {
  loginRequest,
  getInfoUser,
  selectAuthLoading,
  selectAuthError,
  clearError,
  selectUser,
  selectIsAuthenticated
} from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import { extractTokenInfo } from '../../helper/extratoken';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const userToken = useSelector(selectUser);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    console.log('auth:', isAuthenticated);
  
    const token = extractTokenInfo();
  
    if (isAuthenticated && token && !token.isExpired && userToken) {
      dispatch(getInfoUser({ accessToken: userToken.userToken.accessToken }))
        .unwrap()
        .then(() => {
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Lấy thông tin user thất bại:', err);
        });
    }
  }, [isAuthenticated, userToken, dispatch, navigate]);

  const handleLogin = useCallback(
    (values: LoginFormValues) => {
      dispatch(loginRequest(values));
    },
    [dispatch]
  );
  

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
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
            <div className="text-red-500 text-sm mb-4">
              {typeof error === 'string' ? error : 'Login failed'}
            </div>
          )}

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
