import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, Alert, Space, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import {
  loginRequest,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from '../../store/slices/authSlice';
import { selectSettings } from '../../store/slices/settingSlice';
import type { AppDispatch } from '../../store/store';
import { storageService } from '../../helper/tokenHelper';

interface LoginFormValues {
  username: string;
  password: string;
}

interface DecodedToken {
  exp: number;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const settings = useSelector(selectSettings);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUserString = storageService.getItem('persist:authUser');
        if (!authUserString) throw new Error('No auth data');

        const authUser = JSON.parse(authUserString);
        const tokenObj = authUser?.token ? JSON.parse(authUser.token) : null;
        const accessToken = tokenObj?.accessToken;

        if (accessToken && isTokenValid(accessToken)) {
          navigate('/dashboard');
        } else {
          throw new Error('Invalid or expired token');
        }
      } catch {
        storageService.clear();
        dispatch(clearError());
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await dispatch(loginRequest(values)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Animation variants
  const formVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 300 : -300,
    }),
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -300 : 300,
      transition: { duration: 0.5, ease: 'easeInOut' },
    }),
  };

  const alertVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Spin size="large" className="text-[var(--primary)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[var(--background)]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[var(--card-bg)]/80 backdrop-blur-lg border border-[var(--color-neutral-20)]/20">
        <AnimatePresence mode="wait" custom={showContactForm ? 1 : -1}>
          {!showContactForm ? (
            <motion.div
              key="login"
              custom={-1}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Typography.Title
                level={3}
                className="text-center mb-2 font-bold text-[var(--text-color)]"
              >
                Đăng nhập vào <span className="text-[var(--primary)]">Tài khoản</span>
              </Typography.Title>

              <Typography.Paragraph className="text-center text-[var(--color-neutral-20)] mb-6 text-sm">
                Chào mừng bạn đến với hệ thống!
              </Typography.Paragraph>

              <AnimatePresence>
                {error && (
                  <motion.div
                    variants={alertVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Alert
                      message="Lỗi đăng nhập"
                      description={error}
                      type="error"
                      showIcon
                      className="mb-4 animate-shake border-[var(--color-error-50)]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Form
                name="login_form"
                onFinish={handleLogin}
                layout="vertical"
                disabled={loading}
                initialValues={{
                  username: import.meta.env.DEV ? 'DangAdmin' : '',
                  password: import.meta.env.DEV ? 'Khongnho123@' : '',
                }}
              >
                <motion.div
                  variants={formVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    label={<span className="text-[var(--text-color)]">Tên đăng nhập</span>}
                  >
                    <Input
                      prefix={<UserOutlined className="text-[var(--color-neutral-30)]" />}
                      placeholder="Nhập tên đăng nhập"
                      className="py-2 rounded-lg bg-[var(--color-surface-10)]/30 border-[var(--color-neutral-20)]/50 hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div
                  variants={formVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                >
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    label={<span className="text-[var(--text-color)]">Mật khẩu</span>}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-[var(--color-neutral-30)]" />}
                      placeholder="Nhập mật khẩu"
                      className="py-2 rounded-lg bg-[var(--color-surface-10)]/30 border-[var(--color-neutral-20)]/50 hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                    />
                  </Form.Item>
                </motion.div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="py-2 rounded-lg text-[var(--color-on-primary)] font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </Form.Item>
              </Form>

              <p className="text-center text-sm text-[var(--color-neutral-20)] mt-4">
                Chưa có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowContactForm(true);
                  }}
                  className="text-[var(--primary)] hover:underline font-medium"
                >
                  Đăng ký
                </a>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="contact"
              custom={1}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Typography.Title
                level={3}
                className="text-center mb-2 font-bold text-[var(--text-color)]"
              >
                Liên hệ <span className="text-[var(--primary)]">Quản trị viên</span>
              </Typography.Title>

              <Typography.Paragraph className="text-center text-[var(--color-neutral-20)] mb-6 text-sm">
                Vui lòng liên hệ quản trị viên để được cấp tài khoản.
              </Typography.Paragraph>

              <div className="flex flex-col items-center gap-4">
                <Space direction="vertical" align="center" size="middle">
                  <MailOutlined className="text-4xl text-[var(--primary)]" />
                  <div className="text-center">
                    <Typography.Text strong className="text-[var(--text-color)]">
                      Email hỗ trợ:
                    </Typography.Text>
                    <Typography.Text className="text-[var(--color-neutral-20)] block">
                      admin@school.edu.vn
                    </Typography.Text>
                  </div>
                  <div className="text-center">
                    <Typography.Text strong className="text-[var(--text-color)]">
                      Hotline:
                    </Typography.Text>
                    <Typography.Text className="text-[var(--color-neutral-20)] block">
                      +84 123 456 789
                    </Typography.Text>
                  </div>
                  <Typography.Text className="text-[var(--color-neutral-20)]">
                    Vui lòng cung cấp thông tin cá nhân để được hỗ trợ tạo tài khoản.
                  </Typography.Text>
                </Space>
              </div>

              <p className="text-center text-sm text-[var(--color-neutral-20)] mt-6">
                Đã có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowContactForm(false);
                  }}
                  className="text-[var(--primary)] hover:underline font-medium"
                >
                  Quay lại đăng nhập
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;