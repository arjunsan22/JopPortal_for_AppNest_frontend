// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, selected: 0, rejected: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/stats`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data?.stats || { total: 0, pending: 0, selected: 0, rejected: 0 });
          setRecentActivity(data.data?.recentActivity || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatTimeAgo = (dateString) => {
    const dates = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dates) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const currentStats = stats || { total: 0, pending: 0, selected: 0, rejected: 0 };
  const conversionRate = currentStats.total > 0 ? Math.round((currentStats.selected / currentStats.total) * 100) : 0;
  const pendingRate = currentStats.total > 0 ? Math.round((currentStats.pending / currentStats.total) * 100) : 0;
  const rejectionRate = currentStats.total > 0 ? Math.round((currentStats.rejected / currentStats.total) * 100) : 0;

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
          value={loading ? "..." : currentStats.total}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Pending Review"
          value={loading ? "..." : currentStats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Selected"
          value={loading ? "..." : currentStats.selected}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Rejected"
          value={loading ? "..." : currentStats.rejected}
          icon={XCircle}
          color="red"
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
    {loading ? (
      <p className="text-gray-500">Loading activity...</p>
    ) : recentActivity.length === 0 ? (
      <p className="text-gray-500">No recent activity found.</p>
    ) : (
      recentActivity.map((activity) => (
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
            <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.time)}</p>
          </div>
        </div>
      ))
    )}
  </div>

</div>

        {/* Quick Stats */}
<div className="bg-white rounded-xl border border-gray-200 p-6 h-[420px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-gray-900">{conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${conversionRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pending Review</span>
                <span className="font-semibold text-gray-900">{pendingRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${pendingRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Rejection Rate</span>
                <span className="font-semibold text-gray-900">{rejectionRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${rejectionRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}