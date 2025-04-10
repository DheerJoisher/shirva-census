import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import { FaUsers, FaClipboardCheck, FaDatabase, FaChartBar, FaChevronRight, FaUserPlus } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalResidents: 0,
    pendingApprovals: 0,
    lifeMemberCount: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Get total households count
        const { count: familiesCount, error: familiesError } = await supabase
          .from('HOUSEHOLD')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get total residents count
        const { count: residentsCount, error: residentsError } = await supabase
          .from('RESIDENTS')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get pending approvals count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('pending_users')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get life members count
        const { count: lifeMembers, error: lifeMemberError } = await supabase
          .from('RESIDENTS')
          .select('*', { count: 'exact', head: 'count' })
          .eq('lifemember', true);
        
        if (familiesError || residentsError || pendingError || lifeMemberError) {
          console.error("Error fetching stats:", { 
            familiesError, residentsError, pendingError, lifeMemberError 
          });
          return;
        }
        
        setStats({
          totalFamilies: familiesCount || 0,
          totalResidents: residentsCount || 0,
          pendingApprovals: pendingCount || 0,
          lifeMemberCount: lifeMembers || 0
        });
        
        // Fetch recent activity
        await fetchRecentActivity();
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        // Get recently registered families/residents
        const { data: recentResidents, error: residentsError } = await supabase
          .from('RESIDENTS')
          .select('first_name, last_name, created_at')
          .order('created_at', { ascending: false })
          .limit(3);
          
        // Get recently approved users
        const { data: recentApprovals, error: approvalsError } = await supabase
          .from('users')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (residentsError || approvalsError) {
          console.error("Error fetching activity:", { residentsError, approvalsError });
          return;
        }
        
        const activity = [];
        
        if (recentResidents?.length) {
          activity.push({
            type: 'residents',
            count: recentResidents.length,
            time: new Date(recentResidents[0].created_at),
            icon: <FaUsers className="text-base sm:text-lg" />
          });
        }
        
        if (recentApprovals?.length) {
          activity.push({
            type: 'approvals',
            count: recentApprovals.length,
            time: new Date(recentApprovals[0].created_at),
            icon: <FaClipboardCheck className="text-base sm:text-lg" />
          });
        }
        
        setRecentActivity(activity);
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      }
    };

    fetchStats();
  }, []);

  const formatActivityTime = (time) => {
    const now = new Date();
    const diffHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return time.toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Families Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Households</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.totalFamilies}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                <FaUsers className="text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          {/* Total Residents Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Residents</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.totalResidents}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                <FaUserPlus className="text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          {/* Pending Approvals Card */}
          <Link to="/admin/approvals" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.pendingApprovals}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-orange-50 text-orange-500 flex-shrink-0">
                <FaClipboardCheck className="text-xl sm:text-2xl" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-orange-500 group-hover:underline">
              <span>Review now</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </Link>
          
          {/* Life Members Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Life Members</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.lifeMemberCount}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-purple-50 text-purple-500 flex-shrink-0">
                <FaChartBar className="text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          {/* View Data Card */}
          <Link to="/admin/residents" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Census Records</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">Manage</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-500 flex-shrink-0">
                <FaDatabase className="text-xl sm:text-2xl" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-500 group-hover:underline">
              <span>View all data</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </Link>
          
          {/* Analytics Card */}
          <Link to="/admin/analytics" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Analytics</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">Reports</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-purple-50 text-purple-500 flex-shrink-0">
                <FaChartBar className="text-xl sm:text-2xl" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-purple-500 group-hover:underline">
              <span>View insights</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Activity</h2>
            <button className="text-xs sm:text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`p-1.5 sm:p-2 ${
                    activity.type === 'residents' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'
                  } rounded-lg mr-3 sm:mr-4 flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-medium">
                      {activity.type === 'residents' 
                        ? `${activity.count} new resident registrations` 
                        : `${activity.count} approvals completed`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                      {formatActivityTime(activity.time)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;