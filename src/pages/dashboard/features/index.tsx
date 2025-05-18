import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

const TeaturesLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: '80vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          HUBT Social — Mạng xã hội toàn năng cho sinh viên 5.0 🚀
        </h1>

        <p className="text-lg text-gray-700 text-center">
          Đây không chỉ là một mạng xã hội, đây là một siêu nền tảng dành cho thế hệ sinh viên hiện đại —
          nơi bạn có thể học tập, giải trí, kinh doanh và phát triển bản thân toàn diện.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm">
          <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-blue-600">🛍️ Chợ sinh viên online</h2>
            <p>Mua bán sách vở, đồ dùng học tập, quần áo, đồ ăn... cực kỳ tiện lợi và không tốn phí trung gian.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-purple-600">🎬 Video ngắn HUBT</h2>
            <p>Chia sẻ khoảnh khắc, kiến thức, meme học đường qua video ngắn như TikTok.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-green-600">🎮 Góc giải trí & Game</h2>
            <p>Thư giãn sau giờ học với mini game, đố vui, trò chơi tương tác ngay trên nền tảng.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-yellow-600">🧠 Tư vấn AI cá nhân</h2>
            <p>Cố vấn học tập, định hướng nghề nghiệp, hỗ trợ tinh thần... tất cả đều có AI đồng hành 24/7.</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-indigo-600">📚 Học online tích hợp</h2>
            <p>Tham gia lớp học ảo, luyện đề, xem lại bài giảng... tất cả trong một cú click.</p>
          </div>
          <div className="bg-rose-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-rose-600">🧑‍⚕️ Chat với tư vấn viên</h2>
            <p>Kết nối với đội ngũ tư vấn thật để được hỗ trợ học vụ, tâm lý và hướng nghiệp.</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 italic mt-4">
          * Các tính năng đang được triển khai và sẽ sớm ra mắt. Chuẩn bị cho kỷ nguyên mạng xã hội sinh viên 5.0! 🔥
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold px-6 py-2 rounded-xl transition duration-200"
          >
            Trải nghiệm ngay
          </button>
        </div>

        <Outlet />
      </div>
    </Content>
  );
};

export default TeaturesLayout;
