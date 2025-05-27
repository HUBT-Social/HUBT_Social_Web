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

import Image_Academic_Result from '../../assets/interface_academic_result.png';
import Image_Chat from '../../assets/interface_chat.png';
import Image_ChatView from '../../assets/interface_chatview.png';
import Image_Exam from '../../assets/interface_exam.png';
import Image_Home from '../../assets/interface_home.png';
import Image_Menu_Setting from '../../assets/interface_menu_setting.png';
import Image_Module from '../../assets/interface_module.png';
import Image_Notification from '../../assets/interface_notification.png';
import Image_Profile from '../../assets/interface_profile.png';
import Image_SchoolSurvey from '../../assets/interface_schoolsurvey.png';
import Image_StudentList from '../../assets/interface_studentlist.png';
import Image_Timetable_Info from '../../assets/interface_timetable_info.png';

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

interface SocialProof {
  user: string;
  action: string;
  time: string;
  avatar: string;
}

const socialProof: SocialProof[] = [
  {
    user: 'Nguyễn Anh',
    action: 'đã chia sẻ một bài viết về sự kiện cộng đồng.',
    time: '2 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Lê Minh',
    action: 'đã bình luận trong nhóm HUBT Connect.',
    time: '1 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Trần Hương',
    action: 'đã tham gia sự kiện "HUBT Hackathon 2025".',
    time: '4 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Phạm Nam',
    action: 'đã cập nhật ảnh đại diện mới.',
    time: '30 phút trước',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Hoàng Linh',
    action: 'đã đăng ký khóa học "Kỹ năng mềm 2025".',
    time: '3 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Vũ Thảo',
    action: 'đã tạo một bài thảo luận về kỳ thi cuối kỳ.',
    time: '5 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Đỗ Khánh',
    action: 'đã tham gia nhóm "HUBT Alumni".',
    time: '6 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Ngô Hải',
    action: 'đã đăng ký tham gia hội thảo kỹ năng lập trình.',
    time: '1 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Trịnh Phương',
    action: 'đã chia sẻ tài liệu học tập cho lớp A1.',
    time: '2 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Bùi Hùng',
    action: 'đã phản hồi trong bài đăng về sự kiện thể thao.',
    time: '3 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Nguyễn Anh',
    action: 'đã chia sẻ một bài viết về sự kiện cộng đồng.',
    time: '2 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Lê Minh',
    action: 'đã bình luận trong nhóm HUBT Connect.',
    time: '1 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Trần Hương',
    action: 'đã tham gia sự kiện "HUBT Hackathon 2025".',
    time: '4 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Phạm Nam',
    action: 'đã cập nhật ảnh đại diện mới.',
    time: '30 phút trước',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Hoàng Linh',
    action: 'đã đăng ký khóa học "Kỹ năng mềm 2025".',
    time: '3 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Vũ Thảo',
    action: 'đã tạo một bài thảo luận về kỳ thi cuối kỳ.',
    time: '5 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Đỗ Khánh',
    action: 'đã tham gia nhóm "HUBT Alumni".',
    time: '6 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Ngô Hải',
    action: 'đã đăng ký tham gia hội thảo kỹ năng lập trình.',
    time: '1 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Trịnh Phương',
    action: 'đã chia sẻ tài liệu học tập cho lớp A1.',
    time: '2 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Bùi Hùng',
    action: 'đã phản hồi trong bài đăng về sự kiện thể thao.',
    time: '3 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Mai Ngọc',
    action: 'đã đăng bài viết về dự án nhóm.',
    time: '45 phút trước',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Phan Tùng',
    action: 'đã thích bài viết trong diễn đàn HUBT.',
    time: '7 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Đặng Quyên',
    action: 'đã tham gia sự kiện "Ngày hội việc làm 2025".',
    time: '1 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Lý Thành',
    action: 'đã cập nhật trạng thái học tập trên HUBT Social.',
    time: '5 phút trước',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Hà My',
    action: 'đã mời bạn bè tham gia nhóm "HUBT Volunteer".',
    time: '8 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Nguyễn Long',
    action: 'đã đăng ký tham gia câu lạc bộ công nghệ.',
    time: '3 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1543610892-1b1c4e2a6d5d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Trần Duy',
    action: 'đã chia sẻ ảnh từ sự kiện "HUBT Festival".',
    time: '2 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1511367461989-5c2b2c66a1df?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Lê Bảo',
    action: 'đã đăng câu hỏi trong diễn đàn học tập.',
    time: '4 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Phạm Quỳnh',
    action: 'đã tham gia hội thảo "Phát triển kỹ năng lãnh đạo".',
    time: '1 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
  {
    user: 'Hoàng Nam',
    action: 'đã cập nhật thông tin hồ sơ cá nhân.',
    time: '15 phút trước',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&w=200&h=200&fit=crop&auto=format',
  },
];

const interfaces = [
  {
    src: Image_Academic_Result,
    alt: 'Giao diện kết quả học tập',
    label: 'Giao diện kết quả học tập',
    bgColor: 'from-teal-100 to-cyan-100',
    themeColor: 'text-teal-600',
  },
  {
    src: Image_Chat,
    alt: 'Giao diện tin nhắn',
    label: 'Giao diện tin nhắn',
    bgColor: 'from-indigo-100 to-blue-100',
    themeColor: 'text-indigo-600',
  },
  {
    src: Image_ChatView,
    alt: 'Giao diện xem tin nhắn',
    label: 'Giao diện xem tin nhắn',
    bgColor: 'from-purple-100 to-indigo-100',
    themeColor: 'text-purple-600',
  },
  {
    src: Image_Exam,
    alt: 'Giao diện thi cử',
    label: 'Giao diện thi cử',
    bgColor: 'from-yellow-100 to-amber-100',
    themeColor: 'text-yellow-600',
  },
  {
    src: Image_Home,
    alt: 'Giao diện chính',
    label: 'Giao diện chính',
    bgColor: 'from-green-100 to-lime-100',
    themeColor: 'text-green-600',
  },
  {
    src: Image_Menu_Setting,
    alt: 'Giao diện cài đặt menu',
    label: 'Giao diện cài đặt menu',
    bgColor: 'from-gray-100 to-gray-200',
    themeColor: 'text-gray-600',
  },
  {
    src: Image_Module,
    alt: 'Giao diện mô-đun',
    label: 'Giao diện mô-đun',
    bgColor: 'from-blue-100 to-sky-100',
    themeColor: 'text-blue-600',
  },
  {
    src: Image_Notification,
    alt: 'Giao diện thông báo',
    label: 'Giao diện thông báo',
    bgColor: 'from-sky-100 to-blue-100',
    themeColor: 'text-sky-600',
  },
  {
    src: Image_Profile,
    alt: 'Giao diện hồ sơ',
    label: 'Giao diện hồ sơ',
    bgColor: 'from-pink-100 to-purple-100',
    themeColor: 'text-pink-600',
  },
  {
    src: Image_SchoolSurvey,
    alt: 'Giao diện khảo sát trường học',
    label: 'Giao diện khảo sát trường học',
    bgColor: 'from-rose-100 to-red-100',
    themeColor: 'text-rose-600',
  },
  {
    src: Image_StudentList,
    alt: 'Giao diện danh sách sinh viên',
    label: 'Giao diện danh sách sinh viên',
    bgColor: 'from-emerald-100 to-teal-100',
    themeColor: 'text-emerald-600',
  },
  {
    src: Image_Timetable_Info,
    alt: 'Giao diện thông tin thời khóa biểu',
    label: 'Giao diện thông tin thời khóa biểu',
    bgColor: 'from-orange-100 to-amber-100',
    themeColor: 'text-orange-600',
  },
];

const teamMembers = [
    {
      name: 'Văn Đăng',
      role: 'Fullstack Developer',
      quote: 'Mỗi dòng code đều mang theo sự chỉn chu và trách nhiệm.',
      description:
        'Phụ trách cả Backend và Frontend Web, Đăng đảm bảo hệ thống hoạt động ổn định, bảo mật và dễ mở rộng. Là người đặt nền móng vững chắc cho kiến trúc hệ thống, anh luôn hướng đến trải nghiệm người dùng tối ưu.',
      avatar:
        'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/475510642_597003689776162_6875163495834661125_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=1d2534&_nc_ohc=G5lBji-nxcMQ7kNvwGqu0hP&_nc_oc=AdmQRI0j9szUqrl0EXBY0NH1RLXL9ewAw99AYkATLklcWqOeG9S8K92rmA0Ro0lgM64&_nc_zt=24&_nc_ht=scontent.fhan17-1.fna&_nc_gid=VnxyPqNONYd1XD_zE_C7kw&oh=00_AfJEAXoCsYe9llMwCGHONaStc_rUZDqf8wrfHCdS_yU1lA&oe=683B82AF',
    },
    {
      name: 'Bình Dương',
      role: 'Backend Engineer',
      quote: 'Xử lý dữ liệu phức tạp để tạo ra những điều đơn giản cho người dùng.',
      description:
        'Chuyên sâu về xử lý dữ liệu và tối ưu hệ thống, Dương chịu trách nhiệm chính về API và hiệu suất. Khả năng phân tích và giải quyết vấn đề của anh là yếu tố cốt lõi đảm bảo ứng dụng vận hành mượt mà.',
      avatar:
        'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/404630716_3637091993284323_2887544166348866455_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=H0ZD5lg4DwYQ7kNvwG3d2Ak&_nc_oc=AdkUXOw0hUZrN0CzTnJURUlE3tpOAv-yN31zrNSwGONs3y5r80eK0jc45lpKmkikM2E&_nc_zt=24&_nc_ht=scontent.fhan17-1.fna&_nc_gid=KsDavmEIgvn3bb-b-164gA&oh=00_AfJBYMi1iRmPHD4D3cPKHGZFOITohwpmrIxC6UHkC5Cakg&oe=683B6FEA',
    },
    {
      name: 'Anh Đức',
      role: 'Business Analyst / UI-UX Strategist',
      quote: 'Thấu hiểu người dùng để định hình giải pháp.',
      description:
        'Là cầu nối giữa nhu cầu người dùng và sản phẩm cuối cùng, Đức đảm bảo mỗi tính năng đều có mục đích rõ ràng và hiệu quả. Kết hợp cùng tư duy thiết kế UX/UI, anh giúp ứng dụng trở nên dễ tiếp cận và hấp dẫn hơn.',
      avatar:
        'https://scontent.fhan17-1.fna.fbcdn.net/v/t1.6435-1/160782340_271258687897568_6237076410782101596_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=NtWt15PArIQQ7kNvwEiS_hN&_nc_oc=Adk1mm6y6SMgQOIeGE0UzWN1OeGbxTpkez3euFfcISlz-J93zwGbA4H9ofEtDzGbrnU&_nc_zt=24&_nc_ht=scontent.fhan17-1.fna&_nc_gid=4TbWyVUglJIyGkqqxZgAyg&oh=00_AfI1ppfVHctPvtEfm6TwTQV5c3ILF_qychVaPFJBFAVc_w&oe=685D1BB4',
    },
    {
      name: 'Thế Trường',
      role: 'Mobile Developer',
      quote: 'Mang trải nghiệm mượt mà đến đầu ngón tay.',
      description:
        'Tối ưu từng thao tác trên giao diện di động, Trường xây dựng ứng dụng với hiệu năng cao và giao diện thân thiện. Anh đảm bảo sinh viên có thể sử dụng mọi tính năng dễ dàng từ điện thoại.',
      avatar:
        'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/473589835_1348257683196549_6978826915134767187_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=1d2534&_nc_ohc=2-TlX-Kwg3QQ7kNvwEa_-4a&_nc_oc=AdmPbrdrEZUm-V9cHrQcAKHrzPHDpPoVGiw6SSiqmo0eMLf6ARSGN2l4mwv2kP2IFK4&_nc_zt=24&_nc_ht=scontent.fhan17-1.fna&_nc_gid=-AYnOJa6M1SBTpa8GRm5Ow&oh=00_AfK0iVvekRERZY8s-oFsaTWNdvCfao4z5-vzk_4K7gBbnw&oe=683B6409',
    },
    {
      name: 'Hải Hà',
      role: 'Mobile Developer',
      quote: 'Từng dòng code là một phần của hành trình người dùng.',
      description:
        'Với tư duy logic và thiết kế linh hoạt, Hà đồng hành cùng team mobile để hoàn thiện ứng dụng từ giao diện đến chức năng, mang đến trải nghiệm thân thiện và đáng tin cậy.',
      avatar:
        'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/496943219_1408744430127108_2219460052898586259_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=DhRu1Qv5QZIQ7kNvwGapH8O&_nc_oc=AdlzKonnp2qzc9brwcrfTAlKkGKooR6AlPgIgOpQqsFCZmBq06_meQ5LuGLM5-FRbUA&_nc_zt=24&_nc_ht=scontent.fhan17-1.fna&_nc_gid=9Tln38ZFFEs1NyTKsAgCYQ&oh=00_AfIIWlKnnMQldj0ebLI1Yp_NaA_p-xmkPIQrp5pn4l_8Uw&oe=683B78FC',
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
// const teamVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
// };

// const cardVariants = {
//   hover: { scale: 1.05, transition: { duration: 0.3 } },
// };

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
  // Split the socialProof array into two parts for the two rows
  const midIndex = Math.floor(socialProof.length / 2);
  const topRowProof = socialProof.slice(0, midIndex); // First half for top row
  const bottomRowProof = socialProof.slice(midIndex); // Second half for bottom row

  // Duplicate each row for seamless scrolling
  const topRowDuplicated = [...topRowProof, ...topRowProof];
  const bottomRowDuplicated = [...bottomRowProof, ...bottomRowProof];

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
    speed: 500,
    slidesToShow: 3, // Show 3 slides at a time
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Ensure autoplay is enabled
    autoplaySpeed: 3000, // 3 seconds per slide
    centerMode: true, // Highlight the middle slide
    centerPadding: '0px', // No padding on sides for even spacing
    responsive: [
      {
        breakpoint: 1024, // lg breakpoint
        settings: {
          slidesToShow: 2, // Show 2 slides on medium screens
          centerMode: true,
        },
      },
      {
        breakpoint: 640, // sm breakpoint
        settings: {
          slidesToShow: 1, // Show 1 slide on small screens
          centerMode: true,
        },
      },
    ],
    appendDots: (dots: React.ReactNode) => (
      <div style={{ padding: '10px' }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <span
        className={`w-3 h-3 rounded-full inline-block ${
          i === 0 ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      />
    ),
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
  className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-t from-teal-50 to-purple-10 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-10 shadow-xl relative"
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
          {interfaces.map((item, idx) => {
            const isCenter = idx === Math.floor(interfaces.length / 2);
            const rotateClass = idx < Math.floor(interfaces.length / 2) ? 'rotate-3' : idx > Math.floor(interfaces.length / 2) ? '-rotate-3' : '';
            return (
              <div key={idx} className="px-2 sm:px-4">
                <motion.div
                  className={`relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 ${isCenter ? 'scale-110 z-20' : `scale-90 ${rotateClass}`}`}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-2xl opacity-10`}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
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
            );
          })}
        </Slider>
      </div>

      {/* Custom CSS for slider adjustments */}
      <style>
        {`
          .slick-slide {
            transform: scale(0.9);
          }
          .slick-center .slick-slide {
            transform: scale(1.1);
          }
          .slick-list {
            padding: 0 20px !important;
          }
          .slick-track {
            display: flex !important;
            gap: 20px;
            align-items: center;
          }
        `}
      </style>
    </motion.section>

{/**         */}
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
          {/* Row 1: Scrolls left to right, starts from beginning */}
          <motion.div
            className="flex gap-6 mb-6"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {topRowDuplicated.map((item, idx) => (
              <motion.div
                key={`row1-${idx}`}
                initial={{ opacity: 0, x: -50 }}
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

          {/* Row 2: Scrolls right to left, starts from middle */}
          <motion.div
            className="flex gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {bottomRowDuplicated.map((item, idx) => (
              <motion.div
                key={`row2-${idx}`}
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
      whileInView="visible"
      viewport={{ once: true }}
      className="pt-20 sm:pt-24 pb-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl mx-4"
      id="đội-ngũ"
    >
      <div className="container mx-auto max-w-7xl px-6">
        <Title level={2} className="text-4xl font-extrabold text-gray-900 mb-16 text-center">
          Đội ngũ của chúng tôi
        </Title>
        <Slider {...sliderSettings}>
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl p-8 shadow-md text-center mx-4 slick-slide"
              style={{
                transform: 'scale(0.9)', // Default scale for all slides
                transition: 'transform 0.3s ease',
              }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <motion.img
                  src={member.avatar}
                  alt={`Ảnh đại diện của ${member.name}`}
                  className="w-24 h-24 rounded-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <Title level={4} className="text-2xl font-semibold text-gray-900 mb-2">
                {member.name}
              </Title>
              <Text className="text-indigo-600 text-lg font-medium mb-4 block">
                {member.role}
              </Text>
              <Paragraph className="text-gray-600 italic mb-6">
                <strong>{member.quote}</strong>
              </Paragraph>
              <Paragraph className="text-gray-600 text-base leading-relaxed">
                {member.description}
              </Paragraph>
            </motion.div>
          ))}
        </Slider>
      </div>

      {/* Custom CSS for center scale and spacing */}
      <style>
        {`
          .slick-slide {
            transform: scale(0.9); /* Default scale */
          }
          .slick-center .slick-slide {
            transform: scale(1.2); /* Scale up the center slide */
          }
          .slick-list {
            padding: 0 20px !important; /* Ensure even spacing with padding */
          }
          .slick-track {
            display: flex !important;
            gap: 20px; /* Even spacing between slides */
            align-items: center; /* Center align slides vertically */
          }
        `}
      </style>
    </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 sm:pt-24 pb-20 bg-gradient-to-t from-indigo-600 to-purple-600 text-white text-center rounded-t-3xl"
        id="download"
        data-aos="fade-up"
      >
        <div className="container mx-auto max-w-7xl px-6">
          <Title level={2} className="text-4xl font-extrabold mb-6 text-white">
            Tải HUBT Social ngay!
          </Title>
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
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="pt-20 sm:pt-24 pb-8 bg-gradient-to-b from-indigo-600 to-neutral-100 text-white" data-aos="fade-up">
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