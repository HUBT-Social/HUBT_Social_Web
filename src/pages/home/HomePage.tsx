import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col, Image, Card, Form, Input,Rate, message } from 'antd';
import Slider from 'react-slick';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

// Import hình ảnh (thay bằng đường dẫn thật của bạn)
import mobileAppScreenshot1 from '../../assets/anh1.jpg';
import mobileAppScreenshot2 from '../../assets/anh2.jpg';
import mobileAppScreenshot3 from '../../assets/anh1.jpg'; // Giả định ảnh lặp lại
import mobileAppScreenshot4 from '../../assets/anh2.jpg'; // Giả định ảnh lặp lại
import mobileAppScreenshot5 from '../../assets/anh1.jpg'; // Giả định ảnh lặp lại
import appStoreBadge from '../../assets/anh3.png';
import googlePlayBadge from '../../assets/anh4.png';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

const initialTestimonials = [
  {
    content: "Ứng dụng này thật tuyệt vời! Giao diện đẹp và dễ dùng!",
    author: "Nguyễn Văn A",
    location: "Hà Nội",
    rating: 5,
  },
  {
    content: "Hiệu suất vượt trội, tôi yêu thích tính năng bảo mật!",
    author: "Trần Thị B",
    location: "TP.HCM",
    rating: 4,
  },
  {
    content: "Rất tiện lợi cho việc kết nối với bạn bè trong trường!",
    author: "Lê Minh C",
    location: "Đà Nẵng",
    rating: 4.5,
  },
  {
    content: "Tôi đã tiết kiệm được rất nhiều thời gian nhờ ứng dụng này.",
    author: "Phạm Thị D",
    location: "Hải Phòng",
    rating: 5,
  },
  {
    content: "Cần cải thiện thêm một chút về tốc độ tải dữ liệu.",
    author: "Hoàng Văn E",
    location: "Cần Thơ",
    rating: 3.5,
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Khởi tạo AOS khi component mount
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({ duration: 1000, once: true });
    });
  }, []);
   const [testimonials, setTestimonials] = useState(initialTestimonials);

  // Tính đánh giá trung bình
  const averageRating = useMemo(() => {
    if (!testimonials.length) return 0;
    return testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  }, [testimonials]);

  // Xử lý submit form
  const onFinish = (values: any) => {
    const newTestimonial = {
      author: values.name,
      location: values.location,
      rating: values.rating,
      content: values.message,
    };
    // Thêm mới với hiệu ứng
    setTestimonials((prev) => [...prev, newTestimonial]);
    message.success('Cảm ơn bạn đã gửi đánh giá!');
  };

  // Cấu hình carousel cho screenshots
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // Cấu hình cho Slider
const testimonialsSliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
 

  return (
    <div className="bg-gradient-to-b from-teal-600 via-white to-emerald-500 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-80 via-secondary-10 to-primary-80 py-24 text-center text-on-primary">
        <div className="container mx-auto px-4">
          <Title
            level={1}
            className="text-5xl md:text-6xl font-extrabold mb-6"
            data-aos="fade-down"
          >
            Khám Phá Ứng Dụng Mobile Tuyệt Vời!
          </Title>
          <Paragraph className="text-lg md:text-xl mb-10 max-w-3xl mx-auto" data-aos="fade-up">
            Trải nghiệm HUBT Social mọi lúc mọi nơi. Quản lý công việc, kết nối cộng đồng và tối ưu hóa thời gian của bạn với giao diện thân thiện và hiệu suất vượt trội.
          </Paragraph>
          <div className="flex justify-center gap-4 flex-wrap" data-aos="zoom-in">
            <Button
              type="primary"
              size="large"
              className="bg-primary-20 hover:bg-primary-10 border-none text-lg font-semibold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all cursor-pointer text-on-primary"
              onClick={() => {
                console.log('Navigating to /login'); // Debug
                navigate('/login');
              }}
            >
              Đăng nhập
            </Button>
            {/* <Button
              type="primary"
              size="large"
              className="bg-primary-20 hover:bg-primary-10 border-none text-lg font-semibold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all cursor-pointer text-on-primary"
              onClick={() => {
                console.log('Navigating to /signup'); // Debug
                navigate('/signup');
              }}
            >
              Đăng ký
            </Button> */}
          </div>
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/3px-tile.png')]"></div>
      </div>

      {/* Screenshots Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center" data-aos="fade-up">
            Xem trước ứng dụng
          </Title>
          <Slider {...sliderSettings} className="max-w-6xl mx-auto">
            <div className="px-4">
              <Image
                src={mobileAppScreenshot1}
                alt="Screenshot 1"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                preview={false}
              />
            </div>
            <div className="px-4">
              <Image
                src={mobileAppScreenshot2}
                alt="Screenshot 2"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                preview={false}
              />
            </div>
            <div className="px-4">
              <Image
                src={mobileAppScreenshot3}
                alt="Screenshot 3"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                preview={false}
              />
            </div>
            <div className="px-4">
              <Image
                src={mobileAppScreenshot4}
                alt="Screenshot 4"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                preview={false}
              />
            </div>
            <div className="px-4">
              <Image
                src={mobileAppScreenshot5}
                alt="Screenshot 5"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                preview={false}
              />
            </div>
          </Slider>
        </div>
      </div>

      {/* Features Section */}
<div className="py-16 bg-primary-20">
  <div className="container mx-auto px-4">
    <Title
      level={2}
      className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center"
      data-aos="fade-up"
    >
      Tính năng nổi bật
    </Title>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature Item */}
      {[
        {
          icon: "🚀",
          title: "Nhanh chóng và mượt mà",
          description: "Trải nghiệm hiệu suất tối ưu, không giật lag, giúp bạn làm việc hiệu quả hơn.",
          color: "text-teal-500",
          aos: "fade-right"
        },
        {
          icon: "📱",
          title: "Giao diện thân thiện",
          description: "Dễ dàng sử dụng, phù hợp với mọi đối tượng người dùng.",
          color: "text-emerald-500",
          aos: "fade-up"
        },
        {
          icon: "🔒",
          title: "Bảo mật tuyệt đối",
          description: "Dữ liệu của bạn được bảo vệ với công nghệ mã hóa tiên tiến.",
          color: "text-rose-500",
          aos: "fade-left"
        },
        {
          icon: "💬",
          title: "Nhắn tin tương tác",
          description: "Gửi tin nhắn, hình ảnh và tài liệu dễ dàng, kết nối người dùng tức thì.",
          color: "text-blue-500",
          aos: "fade-right"
        },
        {
          icon: "🔔",
          title: "Thông báo thời gian thực",
          description: "Không bỏ lỡ bất kỳ sự kiện hay cập nhật quan trọng nào.",
          color: "text-yellow-500",
          aos: "fade-up"
        },
        {
          icon: "📝",
          title: "Luyện đề thi",
          description: "Hệ thống luyện thi thông minh, đa dạng bộ đề cho mọi cấp học.",
          color: "text-indigo-500",
          aos: "fade-left"
        },
        {
          icon: "📆",
          title: "Thời khóa biểu thông minh",
          description: "Tự động gửi nhắc nhở học tập mỗi ngày, không lo trễ giờ.",
          color: "text-green-500",
          aos: "fade-right"
        },
        {
          icon: "✅",
          title: "Điểm danh online",
          description: "Hệ thống điểm danh nhanh chóng, chính xác và minh bạch.",
          color: "text-orange-500",
          aos: "fade-up"
        },
        {
          icon: "🌐",
          title: "Hỗ trợ đa ngôn ngữ",
          description: "Giao diện linh hoạt, hỗ trợ nhiều ngôn ngữ cho người dùng toàn cầu.",
          color: "text-purple-500",
          aos: "fade-left"
        }
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:shadow-2xl transition-all duration-300"
          data-aos={feature.aos}
        >
          <div className={`${feature.color} text-4xl mb-4`}>{feature.icon}</div>
          <Title level={4} className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</Title>
          <Paragraph className="text-gray-600">{feature.description}</Paragraph>
        </div>
      ))}
    </div>
  </div>
</div>




{/* Reviews & Feedback Section */}
<section className="py-20 bg-secondary-10">
      <div className="max-w-screen-xl mx-auto px-6">
        <Title
          level={2}
          className="text-3xl md:text-4xl font-bold text-on-surface mb-12 text-center"
        >
          Đánh giá & Phản hồi
        </Title>
        <div className="flex items-center justify-center mb-6">
              <Text className="text-on-surface text-lg mr-2">Đánh giá trung bình:</Text>
              <Rate disabled allowHalf value={averageRating} style={{ color: 'var(--color-yellow-400)' }} />
              <Text className="text-on-surface text-lg ml-2">({averageRating.toFixed(1)}/5)</Text>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ———— Testimonials List ———— */}
          <div>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence>
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-surface-20 rounded-2xl shadow-lg p-6 text-on-surface">
                      <Paragraph className="italic mb-4">"{t.content}"</Paragraph>
                      <Rate disabled allowHalf value={t.rating} style={{ color: 'var(--color-yellow-400)' }} className="mb-2" />
                      <Title level={5} className="font-semibold">{t.author}</Title>
                      <Paragraph className="text-sm">{t.location}</Paragraph>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ———— Feedback Form ———— */}
          <div>
            <Card className="bg-secondary-20 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition text-on-surface">
              <Title level={4} className="mb-4">Chia sẻ đánh giá của bạn</Title>
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="name"
                  label={<Text>Tên của bạn</Text>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                  <Input placeholder="Ví dụ: Nguyễn Văn A" size="large" className="rounded-lg" />
                </Form.Item>
                <Form.Item
                  name="location"
                  label={<Text>Địa điểm</Text>}
                  rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
                >
                  <Input placeholder="Ví dụ: Hà Nội" size="large" className="rounded-lg" />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label={<Text>Đánh giá của bạn</Text>}
                  rules={[{ required: true, message: 'Vui lòng chấm sao!' }]}
                >
                  <Rate allowHalf style={{ color: 'var(--color-yellow-400)' }} />
                </Form.Item>
                <Form.Item
                  name="message"
                  label={<Text>Nội dung đánh giá</Text>}
                  rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
                >
                  <Input.TextArea rows={4} placeholder="Chia sẻ cảm nhận..." className="rounded-lg" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    size="large"
                    className="w-full bg-primary-20 hover:bg-primary-10 text-on-primary rounded-lg py-4 font-medium"
                  >
                    Gửi đánh giá ngay
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </section>





      
{/* Call to Action Section */}
<div className="bg-gradient-to-r from-primary-70 via-secondary-30 to-primary-70 text-on-primary py-20">
  <div className="max-w-screen-xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-5xl font-bold mb-4" data-aos="fade-up">
      Tải ứng dụng HUBT Social ngay hôm nay!
    </h2>
    <p className="text-lg text-on-primary/90 mb-10 max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="100">
      Khám phá, kết nối và trải nghiệm không gian mạng xã hội sinh viên một cách tiện lợi nhất trên điện thoại của bạn.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6" data-aos="zoom-in" data-aos-delay="200">
      <a
        href="[Link App Store]"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tải ứng dụng trên App Store"
      >
        <Image
          src={appStoreBadge}
          alt="Tải trên App Store"
          height={60}
          className="transform hover:scale-110 transition-transform duration-300"
          preview={false}
        />
      </a>
      <a
        href="[Link Google Play]"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tải ứng dụng trên Google Play"
      >
        <Image
          src={googlePlayBadge}
          alt="Tải trên Google Play"
          height={60}
          className="transform hover:scale-110 transition-transform duration-300"
          preview={false}
        />
      </a>
    </div>
  </div>
</div>


      {/* Footer Section */}
<footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white py-16">
  <div className="mx-auto px-6 max-w-screen-xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* Giới thiệu */}
      <div>
        <h4 className="text-xl font-semibold mb-4">HUBT Social</h4>
        <p className="text-gray-300 leading-relaxed">
          Kết nối cộng đồng sinh viên HUBT – Nơi chia sẻ, học hỏi và phát triển.
        </p>
      </div>

      {/* Liên hệ */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Liên hệ</h4>
        <p className="flex items-center gap-2 text-gray-300">
          <MailOutlined /> <span>support@hubtsocial.vn</span>
        </p>
        <p className="flex items-center gap-2 text-gray-300 mt-2">
          <PhoneOutlined /> <span>0123 456 789</span>
        </p>
      </div>

      {/* Mạng xã hội */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Theo dõi chúng tôi</h4>
        <div className="flex gap-4 text-2xl">
          <a href="#" aria-label="Facebook" className="hover:text-blue-500 transition-colors">
            <FacebookOutlined />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-cyan-400 transition-colors">
            <TwitterOutlined />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
            <InstagramOutlined />
          </a>
        </div>
      </div>
    </div>

    {/* Bản quyền */}
    <div className="text-center text-gray-500 text-sm mt-12">
      © {new Date().getFullYear()} HUBT Social. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
};


export default HomePage;