// src/pages/admin/AdminDashboard.jsx
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import { getApplicationStats } from '../../services/mockApplications';

export default function AdminDashboard() {
  const stats = getApplicationStats();

  const recentActivity = [
    { id: 1, action: 'New application received', time: '2 hours ago', type: 'new' },
    { id: 2, action: 'Priya Patel - Status updated to Selected', time: '5 hours ago', type: 'update' },
    { id: 3, action: 'Amit Kumar - Status updated to Rejected', time: '1 day ago', type: 'update' },
    { id: 4, action: 'New application received', time: '1 day ago', type: 'new' },
        { id: 5, action: 'king Kumar - Status updated to Rejected', time: '1 day ago', type: 'update' },
    { id: 6, action: 'New application received', time: '2 day ago', type: 'new' },
    { id: 7, action: 'New application received', time: '3 day ago', type: 'new'},
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Track your recruitment metrics at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          color="blue"
          trend={12}
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          trend={-5}
        />
        <StatsCard
          title="Selected"
          value={stats.selected}
          icon={CheckCircle}
          color="green"
          trend={8}
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="red"
          trend={-2}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
     <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-[420px]">
  
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
      View All
    </button>
  </div>

  <div className="space-y-4 overflow-y-auto pr-2">
    {recentActivity.map((activity) => (
      <div
        key={activity.id}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            activity.type === "new" ? "bg-green-500" : "bg-blue-500"
          }`}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>

</div>

        {/* Quick Stats */}
<div className="bg-white rounded-xl border border-gray-200 p-6 h-[420px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-gray-900">33%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pending Review</span>
                <span className="font-semibold text-gray-900">50%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Rejection Rate</span>
                <span className="font-semibold text-gray-900">17%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}