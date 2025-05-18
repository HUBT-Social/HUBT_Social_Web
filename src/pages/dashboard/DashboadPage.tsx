import React from 'react';
import { UserPlus, School, Users, Info, Rocket, HelpCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const items = [
    {
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: 'Thêm quản trị viên',
      description: 'Cho phép thêm các quản trị viên khác để cùng bạn vận hành hệ thống một cách dễ dàng và hiệu quả hơn.',
    },
    {
      icon: <School className="w-6 h-6 text-white" />,
      title: 'Tạo lớp học',
      description: 'Tạo nội dung khóa học, lớp học và các chương trình đào tạo hấp dẫn cho học viên của bạn.',
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Quản lý học viên',
      description: 'Theo dõi quá trình học tập, tương tác và tiến độ của từng học viên trong hệ thống.',
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-white" />,
      title: 'Hướng dẫn sử dụng',
      description: 'Cung cấp video, tài liệu, và các bước thao tác để bạn làm chủ hệ thống HUBT Dashboard.',
    },
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: 'Các tính năng sắp ra mắt',
      description: 'Mạng xã hội học thuật, AI hỗ trợ học viên, hệ thống livestream, và nhiều tiện ích kinh khủng khác sắp xuất hiện.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        🎓 HUBT Dashboard — Nền tảng quản lý học tập hiện đại
      </h1>
      <p className="text-gray-600 mb-10 max-w-xl">
        Xin chào bạn! Đây là trung tâm điều khiển của bạn. Tại đây, bạn có thể quản lý lớp học, học viên, nội dung đào tạo và nhiều tính năng tuyệt vời khác như bán khóa học, tư vấn AI, tạo game tương tác, tổ chức lớp học trực tuyến...
      </p>

      <div className="space-y-8 max-w-3xl w-full text-left">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300"
          >
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-lg shadow-md">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hướng dẫn sử dụng */}
      <div className="mt-16 max-w-3xl w-full bg-white p-6 rounded-xl shadow-lg text-left space-y-4">
        <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Info className="w-5 h-5" /> Hướng dẫn sử dụng nhanh
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>📌 Vào mục <b>“Tạo lớp học”</b> để bắt đầu tạo khóa học mới.</li>
          <li>👤 Dùng mục <b>“Thêm học viên”</b> để đưa người học vào hệ thống.</li>
          <li>🎥 Sử dụng <b>“Tính năng livestream”</b> để giảng dạy trực tiếp.</li>
          <li>🤖 Dùng <b>AI tư vấn học viên</b> để cải thiện trải nghiệm học tập.</li>
        </ul>
      </div>

      {/* Support floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:brightness-110 transition">
          <HelpCircle className="w-5 h-5" />
          Hỗ trợ ngay
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
