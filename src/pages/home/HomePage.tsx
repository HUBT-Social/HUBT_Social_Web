import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col, Image } from 'antd';

// Import các hình ảnh hoặc assets của bạn
import mobileAppScreenshot1 from '../../assets/anh1.jpg'; // Thay đổi đường dẫn
import mobileAppScreenshot2 from '../../assets/anh2.jpg'; // Thay đổi đường dẫn
import appStoreBadge from '../../assets/anh3.png'; // Thay đổi đường dẫn
import googlePlayBadge from '../../assets/anh4.jpg'; // Thay đổi đường dẫn

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto text-center">
        {/* Tiêu đề chính */}
        <Typography.Title level={1} className="text-4xl font-bold text-indigo-600 mb-8">
          Khám phá Ứng dụng Mobile Tuyệt Vời Của Chúng Tôi!
        </Typography.Title>

        {/* Mô tả ngắn gọn */}
        <Typography.Paragraph className="text-lg text-gray-700 mb-10">
          Trải nghiệm [Tên Ứng Dụng] mọi lúc mọi nơi. [Mô tả ngắn gọn về lợi ích chính của ứng dụng].
        </Typography.Paragraph>

        {/* Screenshots của ứng dụng */}
        <div className="mb-12">
          <Typography.Title level={2} className="text-2xl font-semibold text-gray-800 mb-4">
            Xem trước ứng dụng
          </Typography.Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Image src={mobileAppScreenshot1} alt="Screenshot 1" className="rounded-lg shadow-md" />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Image src={mobileAppScreenshot2} alt="Screenshot 2" className="rounded-lg shadow-md" />
            </Col>
            {/* Thêm các screenshot khác nếu cần */}
          </Row>
        </div>

        {/* Tính năng nổi bật */}
        <div className="mb-12">
          <Typography.Title level={2} className="text-2xl font-semibold text-gray-800 mb-4">
            Tính năng nổi bật
          </Typography.Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-indigo-500 text-3xl mb-2">🚀</div> {/* Icon */}
                <Typography.Title level={4} className="text-lg font-semibold text-gray-800 mb-2">
                  Nhanh chóng và mượt mà
                </Typography.Title>
                <Typography.Paragraph className="text-gray-600 text-sm">
                  Trải nghiệm hiệu suất tối ưu, không giật lag.
                </Typography.Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-500 text-3xl mb-2">📱</div> {/* Icon */}
                <Typography.Title level={4} className="text-lg font-semibold text-gray-800 mb-2">
                  Giao diện thân thiện
                </Typography.Title>
                <Typography.Paragraph className="text-gray-600 text-sm">
                  Dễ dàng sử dụng, phù hợp với mọi người.
                </Typography.Paragraph>
              </div>
            </Col>
            {/* Thêm các tính năng khác */}
          </Row>
        </div>

        {/* Kêu gọi hành động (Call to Action) */}
        <div className="mb-16">
          <Typography.Title level={2} className="text-2xl font-semibold text-gray-800 mb-4">
            Tải ứng dụng ngay!
          </Typography.Title>
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <a href="[Link App Store]" target="_blank" rel="noopener noreferrer">
                <Image src={appStoreBadge} alt="Tải trên App Store" height={60} />
              </a>
            </Col>
            <Col>
              <a href="[Link Google Play]" target="_blank" rel="noopener noreferrer">
                <Image src={googlePlayBadge} alt="Tải trên Google Play" height={60} />
              </a>
            </Col>
          </Row>
        </div>

        {/* Liên kết đến trang đăng nhập và đăng ký (nếu cần) */}
        <div className="space-y-4 mt-8">
          <Button type="primary" size="large" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
          <Button type="default" size="large" onClick={() => navigate('/signup')}>
            Đăng ký
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} [Tên Công Ty/Ứng Dụng]. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default HomePage;