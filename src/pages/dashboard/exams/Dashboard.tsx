import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';

interface DashboardProps {
  exams?: Array<{
    id: string;
    status: 'draft' | 'pending' | 'approved';
    major: string;
    createdDate: string;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ exams = [] }) => {
  // Mock data if no exams provided
  const mockExams = exams.length === 0 ? [
    { id: '1', status: 'draft' as const, major: 'Toán', createdDate: '2025-06-01' },
    { id: '2', status: 'pending' as const, major: 'Lý', createdDate: '2025-06-02' },
    { id: '3', status: 'approved' as const, major: 'Hóa', createdDate: '2025-06-03' },
    { id: '4', status: 'approved' as const, major: 'Toán', createdDate: '2025-06-04' },
    { id: '5', status: 'pending' as const, major: 'Văn', createdDate: '2025-06-05' },
  ] : exams;

  const totalExams = mockExams.length;
  const draftCount = mockExams.filter((exam) => exam.status === 'draft').length;
  const approvedCount = mockExams.filter((exam) => exam.status === 'approved').length;
  const pendingCount = mockExams.filter((exam) => exam.status === 'pending').length;

  // Get unique majors count
  const uniqueMajors = new Set(mockExams.map(exam => exam.major));
  const majorsCount = uniqueMajors.size;

  // Recent activity (last 7 days)
  const recentExams = mockExams.filter(exam => {
    const examDate = new Date(exam.createdDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return examDate >= weekAgo;
  }).length;

  const stats = [
    {
      title: 'Tổng số đề',
      value: totalExams,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Đề nháp',
      value: draftCount,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: '+3%',
      changeType: 'positive' as const
    },
    {
      title: 'Đang xử lý',
      value: pendingCount,
      icon: AlertCircle,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: '-5%',
      changeType: 'negative' as const
    },
    {
      title: 'Đã duyệt',
      value: approvedCount,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+8%',
      changeType: 'positive' as const
    },
  ];

  const additionalStats = [
    {
      title: 'Môn học',
      value: majorsCount,
      icon: BookOpen,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Số môn học khác nhau'
    },
    {
      title: 'Hoạt động gần đây',
      value: recentExams,
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      description: 'Đề thi trong 7 ngày qua'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
            <p className="text-blue-100 text-lg">
              Theo dõi và quản lý bộ sưu tập đề thi của bạn
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Calendar className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    stat.changeType === 'positive' ? '' : 'rotate-180'
                  }`} />
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}></div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {additionalStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{Math.round((approvedCount / totalExams) * 100) || 0}%</p>
            <p className="text-gray-600 text-sm">Đề đã được duyệt</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{Math.round((pendingCount / totalExams) * 100) || 0}%</p>
            <p className="text-gray-600 text-sm">Đề đang chờ xử lý</p>
          </div>
          <div className="text-center">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{majorsCount}</p>
            <p className="text-gray-600 text-sm">Môn học khác nhau</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;