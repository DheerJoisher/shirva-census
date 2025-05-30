import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import { FaUsers, FaClipboardCheck, FaDatabase, FaChartBar, FaChevronRight, FaUserPlus } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalresidents: 0,
    pendingApprovals: 0,
    lifeMemberCount: 0
  });
  
  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Get total households count
        const { count: familiesCount, error: familiesError } = await supabase
          .from('household')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get total residents count
        const { count: residentsCount, error: residentsError } = await supabase
          .from('residents')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get pending approvals count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('pending_users')
          .select('*', { count: 'exact', head: 'count' });
        
        // Get life members count
        const { count: lifeMembers, error: lifeMemberError } = await supabase
          .from('residents')
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
          totalresidents: residentsCount || 0,
          pendingApprovals: pendingCount || 0,
          lifeMemberCount: lifeMembers || 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

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
          <Link to="/admin/households" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total households</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.totalFamilies}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                <FaUsers className="text-xl sm:text-2xl" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-blue-600 group-hover:underline">
              <span>View all</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </Link>
          
          {/* Total residents Card */}
          <Link to="/admin/residents" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total residents</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.totalresidents}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                <FaUserPlus className="text-xl sm:text-2xl" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600 group-hover:underline">
              <span>View all</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </Link>
          
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;