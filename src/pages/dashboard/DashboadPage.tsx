import React from 'react';
import { UserPlus, School, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const items = [
    {
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: 'Add other admins',
      description:
        "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
    },
    {
      icon: <School className="w-6 h-6 text-white" />,
      title: 'Add classes',
      description:
        "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Add students',
      description:
        "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
        Welcome to your dashboard, Udemy school
      </h1>
      <p className="text-gray-600 mb-12">Uyo/school/@teachable.com</p>

      <div className="space-y-8 max-w-2xl w-full">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex items-center justify-center bg-blue-100 p-3 rounded-lg">
              {item.icon}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Support button */}
      <div className="fixed bottom-6 right-6">
        <button className="flex items-center gap-2 bg-[#1e2a78] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#162060] transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
          Support
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
