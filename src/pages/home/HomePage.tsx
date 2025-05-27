import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Rate, message, Modal, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Menu, Facebook, Twitter, Instagram, Mail, Phone, Users, Download, PenSquare, MessageSquare, UserCog, Shield, Clock, X } from 'lucide-react';

const { Title, Paragraph, Text } = Typography;

interface Testimonial {
  content: string;
  author: string;
  location: string;
  rating: number;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialProof {
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface FeedbackForm {
  name: string;
  location: string;
  rating: number;
  message: string;
}

const initialTestimonials: Testimonial[] = [
  {
    content: 'Ứng dụng siêu vui, giao diện sáng sủa và dễ dùng!',
    author: 'Nguyễn Văn A',
    location: 'Hà Nội',
    rating: 5,
  },
  {
    content: 'Màu sắc tươi tắn, kết nối bạn bè cực nhanh!',
    author: 'Trần Thị B',
    location: 'TP.HCM',
    rating: 4.5,
  },
  {
    content: 'HUBT Social làm mình yêu thích việc học hơn!',
    author: 'Lê Minh C',
    location: 'Đà Nẵng',
    rating: 4,
  },
];

const features: Feature[] = [
  {
    title: 'Kết nối dễ dàng',
    description: 'Tạo kết nối với bạn bè, đồng nghiệp và cộng đồng chỉ trong vài cú nhấp chuột.',
    icon: <Users className="h-12 w-12" />,
    color: 'text-teal-500',
  },
  {
    title: 'Tin nhắn nhanh',
    description: 'Trò chuyện thời gian thực với bạn bè qua tin nhắn riêng tư hoặc nhóm.',
    icon: <MessageSquare className="h-12 w-12" />,
    color: 'text-indigo-500',
  },
  {
    title: 'Cá nhân hóa hồ sơ',
    description: 'Tùy chỉnh trang cá nhân với ảnh, tiểu sử và chủ đề độc đáo của bạn.',
    icon: <UserCog className="h-12 w-12" />,
    color: 'text-pink-500',
  },
  {
    title: 'Bảo mật tối ưu',
    description: 'Dữ liệu của bạn được bảo vệ với mã hóa tiên tiến và quyền riêng tư tùy chỉnh.',
    icon: <Shield className="h-12 w-12" />,
    color: 'text-blue-500',
  },
];

const socialProof: SocialProof[] = [
  {
    user: 'Nguyễn Anh',
    action: 'đã chia sẻ một bài viết về sự kiện cộng đồng.',
    time: '2 giờ trước',
    avatar: '/avatar1.png',
  },
  {
    user: 'Lê Minh',
    action: 'đã bình luận trong nhóm HUBT Connect.',
    time: '1 giờ trước',
    avatar: '/avatar2.png',
  },
  {
    user: 'Trần Hương',
    action: 'đã tham gia sự kiện "HUBT Hackathon 2025".',
    time: '4 giờ trước',
    avatar: '/avatar3.png',
  },
  {
    user: 'Phạm Nam',
    action: 'đã cập nhật ảnh đại diện mới.',
    time: '30 phút trước',
    avatar: '/avatar4.png',
  },
];

const interfaces = [
  {
    src: '/logoblue.png',
    alt: 'Giao diện chính',
    label: 'Giao diện chính',
    bgColor: 'from-teal-100 to-cyan-100',
    themeColor: 'text-teal-600',
  },
  {
    src: '/logoblue.png',
    alt: 'Giao diện tin nhắn',
    label: 'Giao diện tin nhắn',
    bgColor: 'from-indigo-100 to-blue-100',
    themeColor: 'text-indigo-600',
  },
  {
    src: '/logoblue.png',
    alt: 'Giao diện hồ sơ',
    label: 'Giao diện hồ sơ',
    bgColor: 'from-pink-100 to-purple-100',
    themeColor: 'text-pink-600',
  },
];

const navItems = ['Tính năng', 'Giao diện', 'Đánh giá', 'Liên hệ'];

const teamVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring', stiffness: 120 } },
  hover: { scale: 1.05, boxShadow: '0 12px 24px rgba(0,0,0,0.1)', transition: { duration: 0.3 } },
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    name: '',
    location: '',
    rating: 0,
    message: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: 'ease-in-out' });
  }, []);

  const averageRating = React.useMemo(() => {
    return testimonials.length ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length : 0;
  }, [testimonials]);

  const handleFeedbackSubmit = () => {
    if (!feedbackForm.name || !feedbackForm.location || !feedbackForm.message || feedbackForm.rating === 0) {
      message.error('Vui lòng điền đầy đủ thông tin và chọn đánh giá!');
      return;
    }
    const newTestimonial: Testimonial = {
      author: feedbackForm.name,
      location: feedbackForm.location,
      rating: feedbackForm.rating,
      content: feedbackForm.message,
    };
    setTestimonials((prev) => [...prev, newTestimonial]);
    setFeedbackForm({ name: '', location: '', rating: 0, message: '' });
    setIsModalVisible(false);
    message.success('Cảm ơn bạn đã gửi đánh giá!');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: '20px' },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerPadding: '10px' },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-tight m-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
              HUBT Social
            </span>
          </h3>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item}
                className="text-white text-base lg:text-lg font-medium hover:text-yellow-300 transition-colors duration-300"
                onClick={() => navigate(`/#${item.toLowerCase()}`)}
                aria-label={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full px-6 py-2 text-base lg:text-lg font-semibold transition-colors duration-300"
                onClick={() => navigate('/login')}
                aria-label="Đăng nhập"
              >
                Đăng nhập
              </button>
            </motion.div>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="md:hidden bg-gradient-to-r from-indigo-700 to-purple-700 rounded-b-2xl px-4 sm:px-6 py-4"
            >
              {navItems.map((item) => (
                <motion.button
                  key={item}
                  className="block w-full text-left text-white text-base sm:text-lg font-medium hover:text-yellow-300 py-3 transition-colors duration-300"
                  onClick={() => {
                    navigate(`/#${item.toLowerCase()}`);
                    setIsMenuOpen(false);
                  }}
                  aria-label={item}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full py-3 text-base sm:text-lg font-semibold mt-2"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                aria-label="Đăng nhập"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Đăng nhập
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.section
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
  className="pt-20 sm:pt-24 pb-24 sm:pb-32 bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100 text-gray-800"
  id="hero"
>
  <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative">
    {/* Lớp phủ gradient được đặt ở cấp cao nhất nhưng với z-index thấp */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 blur-xl rounded-3xl -z-10"></div>

    <motion.div
      className="lg:w-1/2 text-center lg:text-left z-10" // Tăng z-index cho văn bản
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.7 }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
        Kết nối sinh viên với{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          HUBT Social
        </span>
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
        Mạng xã hội học đường nơi bạn học tập, kết bạn và lưu giữ những khoảnh khắc đáng nhớ.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-semibold transition-colors duration-300"
          onClick={() => navigate('/')}
          aria-label="Bắt đầu ngay"
        >
          Bắt đầu ngay
        </button>
      </motion.div>
    </motion.div>
    <motion.div
      className="lg:w-1/2 relative z-10" // Tăng z-index cho hình ảnh
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.9, type: 'spring', stiffness: 100 }}
    >
      <motion.img
        src="/logoblue.png"
        alt="HUBT Social App Preview"
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-2xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  </div>
</motion.section>

      {/* Stats Section */}
      <motion.section
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-t from-teal-50 to-purple-50 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-10 shadow-xl relative"
  id="stats"
  data-aos="zoom-in"
>
  {/* Lớp phủ gradient đặt ở cấp cao nhất với z-index thấp */}
  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 to-purple-50/30 opacity-10 blur-xl rounded-3xl -z-10"></div>

  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
      {[
        { title: "Người dùng", value: 10000, suffix: "+", icon: <Users className="h-10 w-10 sm:h-12 sm:w-12" /> },
        { title: "Lượt tải", value: 5000, suffix: "+", icon: <Download className="h-10 w-10 sm:h-12 sm:w-12" /> },
        { title: "Bài viết", value: 20000, suffix: "+", icon: <PenSquare className="h-10 w-10 sm:h-12 sm:w-12" /> },
      ].map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.15, type: "spring", stiffness: 120 }}
          className="relative bg-white rounded-xl p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-100/50 z-10" // Tăng z-index
          whileHover={{ scale: 1.04, rotate: 1 }}
        >
          <motion.div
            className="text-purple-600 mb-4 mx-auto"
            animate={{ y: [0, -5, 0], opacity: [1, 0.8, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {stat.icon}
          </motion.div>
          <h3 className="text-gray-900 text-base sm:text-lg font-bold tracking-wide">{stat.title}</h3>
          <div className="text-teal-600 text-2xl sm:text-3xl font-extrabold mt-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.2, type: "spring" }}
            >
              {stat.value.toLocaleString()}
              <span className="text-purple-500">{stat.suffix}</span>
            </motion.span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-50/30 to-purple-50/30 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      {/* Features Section */}
      <motion.section
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="pt-20 sm:pt-24 pb-16 sm:pb-24 bg-gradient-to-b from-teal-100 via-purple-100 to-indigo-100 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-16 shadow-2xl relative"
  id="tính-năng"
>
  {/* Lớp phủ gradient đặt ở cấp cao nhất với z-index thấp */}
  <div className="absolute inset-0 bg-gradient-to-tr from-gray-50/20 to-transparent opacity-10 blur-xl rounded-3xl -z-10"></div>

  <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-3xl sm:text-5xl font-bold text-gray-800 mb-12 sm:mb-16 text-center tracking-tight z-10" // Tăng z-index
    >
      Điều gì làm <span className="text-indigo-600">HUBT Social</span> đặc biệt?
    </motion.h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', stiffness: 120 }}
          className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/30 overflow-hidden z-10" // Tăng z-index
          whileHover={{ scale: 1.05, rotate: 0.3 }}
        >
          <motion.div
            className={`flex justify-center ${feature.color} mb-6`}
            animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {feature.icon}
          </motion.div>
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h4>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed text-center">{feature.description}</p>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-50/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      {/* Portfolio Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pt-20 sm:pt-24 pb-16 sm:pb-24 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-16 shadow-2xl overflow-hidden"
        id="giao-diện"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent opacity-50"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-12 sm:mb-16 text-center tracking-tight"
          >
            Khám phá <span className="text-indigo-600">Giao diện</span> HUBT Social
          </motion.h2>
          <Slider {...sliderSettings} className="max-w-5xl mx-auto" aria-label="Giao diện ứng dụng">
            {interfaces.map((item, idx) => (
              <div key={idx} className="px-2 sm:px-4">
                <motion.div
                  className={`relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 ${
                    idx === 1 ? 'scale-110 z-20' : 'scale-90 rotate-3 opacity-80'
                  }`}
                  whileHover={{ scale: idx === 1 ? 1.12 : 0.95, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-2xl opacity-20`}
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="rounded-xl w-full h-48 sm:h-64 lg:h-80 object-cover"
                    loading="lazy"
                  />
                  <p className={`mt-4 text-center text-base sm:text-lg font-medium ${item.themeColor}`}>
                    {item.label}
                  </p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </motion.section>

      {/* Social Proof Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pt-20 sm:pt-24 pb-16 sm:pb-24 bg-gradient-to-b from-indigo-100 via-purple-100 to-teal-100 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-16 shadow-2xl overflow-hidden"
        id="cộng-đồng"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-50"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-12 sm:mb-16 text-center tracking-tight"
          >
            Cộng đồng <span className="text-indigo-600">Rực rỡ</span> của HUBT Social
          </motion.h2>
          <div className="max-w-4xl mx-auto overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              {[...socialProof, ...socialProof].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-md min-w-[280px] sm:min-w-[320px] flex items-center space-x-4"
                >
                  <motion.img
                    src={item.avatar}
                    alt={`Ảnh đại diện của ${item.user}`}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div>
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                      <span className="font-semibold text-indigo-600">{item.user}</span> {item.action}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm flex items-center mt-2">
                      <Clock className="w-4 h-4 mr-1" /> {item.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pt-20 sm:pt-24 pb-16 sm:pb-24 bg-gradient-to-b from-indigo-100 via-purple-100 to-teal-100 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-16 shadow-2xl overflow-hidden"
        id="đánh-giá"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-50"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-12 sm:mb-16 text-center tracking-tight"
          >
            Sinh viên <span className="text-indigo-600">yêu thích</span> gì ở HUBT Social?
          </motion.h2>
          <Slider {...sliderSettings} className="max-w-4xl mx-auto" aria-label="Đánh giá sinh viên">
            {testimonials.map((t, idx) => (
              <div key={idx} className="px-3 sm:px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center"
                >
                  <p className="italic text-gray-600 text-base sm:text-lg mb-4">"{t.content}"</p>
                  <Rate disabled allowHalf value={t.rating} className="text-rose-500 mb-4" />
                  <h5 className="text-gray-900 text-base sm:text-lg font-semibold">{t.author}</h5>
                  <p className="text-gray-500 text-sm sm:text-base">{t.location}</p>
                </motion.div>
              </div>
            ))}
          </Slider>
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-800 text-base sm:text-lg font-medium mb-2">Đánh giá trung bình:</p>
            <div className="flex items-center space-x-2">
              <Rate disabled allowHalf value={averageRating} className="text-rose-500" />
              <p className="text-gray-800 text-base sm:text-lg">({averageRating.toFixed(1)}/5)</p>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="large"
                type="primary"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-8 py-3"
                onClick={() => setIsModalVisible(true)}
              >
                Để lại đánh giá
              </Button>
            </motion.div>
          </div>
          <Modal
            title={<span className="text-xl font-semibold text-gray-800">Chia sẻ cảm nhận của bạn</span>}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleFeedbackSubmit}
            okText="Gửi"
            cancelText="Hủy"
            centered
            className="rounded-2xl"
            okButtonProps={{ className: 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg' }}
            cancelButtonProps={{ className: 'rounded-lg' }}
          >
            <div className="space-y-6 mt-4">
              <div>
                <label className="text-gray-800 font-medium text-sm sm:text-base">Tên</label>
                <Input
                  placeholder="Tên của bạn"
                  size="large"
                  className="rounded-lg mt-1"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-gray-800 font-medium text-sm sm:text-base">Địa điểm</label>
                <Input
                  placeholder="Bạn đang học ở đâu?"
                  size="large"
                  className="rounded-lg mt-1"
                  value={feedbackForm.location}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-gray-800 font-medium text-sm sm:text-base">Đánh giá</label>
                <Rate
                  allowHalf
                  value={feedbackForm.rating}
                  onChange={(value) => setFeedbackForm({ ...feedbackForm, rating: value })}
                  className="text-rose-500 block mt-1"
                />
              </div>
              <div>
                <label className="text-gray-800 font-medium text-sm sm:text-base">Cảm nhận</label>
                <Input.TextArea
                  rows={4}
                  placeholder="Chia sẻ cảm nhận của bạn..."
                  className="rounded-lg mt-1"
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                />
              </div>
            </div>
          </Modal>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        variants={teamVariants}
        initial="hidden"
        animate="visible"
        className="pt-20 sm:pt-24 pb-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl mx-4"
        id="đội-ngũ"
        data-aos="fade-up"
      >
        <div className="container mx-auto max-w-7xl px-6">
          <Title level={2} className="text-4xl font-extrabold text-gray-900 mb-16 text-center">
            Đội ngũ của chúng tôi
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: 'Chị Anh',
                role: 'Chuyên viên tư vấn',
                quote: '“Chuyên viên tư vấn làm việc rất chuyên nghiệp”',
                description: 'Nhân viên tư vấn tận tình, niềm nở, vui vẻ, rất thân thiện. Mình đã thiết kế một website để chạy quảng cáo hàng hóa. Thật sự hiệu quả và mong được hợp tác lâu dài.',
              },
              {
                name: 'Anh Minh',
                role: 'Nhà phát triển',
                quote: '“Đam mê tạo ra trải nghiệm mượt mà”',
                description: 'Đảm bảo HUBT Social vận hành nhanh chóng và ổn định, mang đến trải nghiệm người dùng tuyệt vời.',
              },
              {
                name: 'Chị Linh',
                role: 'Nhà thiết kế UX/UI',
                quote: '“Thiết kế giao diện thân thiện và hiện đại”',
                description: 'Tạo ra giao diện đẹp mắt, dễ sử dụng, giúp sinh viên kết nối và chia sẻ dễ dàng hơn.',
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl p-8 shadow-md text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">Ảnh</span>
                </div>
                <Title level={4} className="text-2xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </Title>
                <Text className="text-indigo-600 text-lg font-medium mb-4 block">
                  {member.role}
                </Text>
                <Paragraph className="text-gray-600 italic mb-6">"{member.quote}"</Paragraph>
                <Paragraph className="text-gray-600 text-base leading-relaxed">
                  {member.description}
                </Paragraph>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-10">
            {[0, 1, 2].map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 sm:pt-24 pb-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center rounded-t-3xl"
        id="download"
        data-aos="fade-up"
      >
        <div className="container mx-auto max-w-7xl px-6">
          <Title level={2} className="text-4xl font-extrabold mb-6">
            Tải HUBT Social ngay!
          </Title>
          <Paragraph className="text-xl mb-10 max-w-xl mx-auto">
            Mang cả thế giới sinh viên vào túi bạn với HUBT Social.
          </Paragraph>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src="/logoblue.png"
                alt="Tải trên App Store"
                className="h-14 rounded-xl"
                loading="lazy"
              />
            </motion.a>
            <motion.a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src="/logoblue.png"
                alt="Tải trên Google Play"
                className="h-14 rounded-xl"
                loading="lazy"
              />
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="pt-20 sm:pt-24 pb-8 bg-indigo-900 text-white" data-aos="fade-up">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold mb-4">HUBT Social</h3>
              <p className="text-gray-300 text-sm">
                Mạng xã hội sinh viên đầy màu sắc và niềm vui!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p className="flex items-center justify-center md:justify-start gap-2 text-gray-300 text-sm mb-2">
                <Mail className="h-5 w-5" />
                support@hubt.edu.vn
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2 text-gray-300 text-sm">
                <Phone className="h-5 w-5" />
                +84 123 456 789
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Theo dõi</h3>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://facebook.com" className="text-white hover:text-yellow-300" aria-label="Facebook">
                  <Facebook size={24} />
                </a>
                <a href="https://twitter.com" className="text-white hover:text-yellow-300" aria-label="Twitter">
                  <Twitter size={24} />
                </a>
                <a href="https://instagram.com" className="text-white hover:text-yellow-300" aria-label="Instagram">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-xs mt-8">
            © {new Date().getFullYear()} HUBT Social. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(HomePage);