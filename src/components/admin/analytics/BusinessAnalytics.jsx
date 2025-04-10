import React, { useState, useMemo, useEffect } from 'react';
import { FaStore, FaUsers, FaMoneyBillWave, FaChartLine, FaSearch, FaFilter } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';

const BusinessAnalytics = () => {
  // State for loading and business data
  const [businessStats, setBusinessStats] = useState({
    totalBusinesses: 0,
    newBusinesses: 0,
    averageRevenue: '₹0',
    growthRate: '0%',
  });

  const [businessesData, setBusinessesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch business data from Supabase
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        
        // Get occupation data joined with residents for owner information
        const { data: occupations, error } = await supabase
          .from('OCCUPATION')
          .select(`
            occupation_id,
            occupation,
            profession,
            work_location,
            RESIDENTS (
              resident_id,
              first_name,
              middle_name,
              last_name,
              phone_number
            )
          `);

        if (error) throw error;

        // Transform occupation data to business format
        const businesses = occupations.map((occupation, index) => {
          const ownerName = `${occupation.RESIDENTS.first_name} ${occupation.RESIDENTS.last_name}`;
          return {
            id: occupation.occupation_id,
            name: occupation.profession || 'Business', // Use profession as business name
            type: occupation.occupation || 'Unspecified', // Use occupation as business type
            location: occupation.work_location || 'Shirva',
            owner: ownerName,
            // Since we don't have revenue in the DB, we'll use placeholder data
            revenue: `₹${Math.floor(Math.random() * 100000)}` // Random revenue as placeholder
          };
        });

        setBusinessesData(businesses);
        
        // Calculate business stats
        setBusinessStats({
          totalBusinesses: businesses.length,
          newBusinesses: Math.floor(businesses.length * 0.1), // Placeholder for new businesses (10%)
          averageRevenue: `₹${Math.floor(businesses.reduce((acc, business) => 
            acc + parseInt(business.revenue.replace('₹', '').replace(/,/g, '')), 0) / 
            (businesses.length || 1))}`,
          growthRate: '4.2%' // Placeholder growth rate
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business data');
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Get unique locations and business types for filter dropdowns
  const locations = useMemo(() => 
    [...new Set(businessesData.map(business => business.location))],
    [businessesData]
  );
  
  const businessTypes = useMemo(() => 
    [...new Set(businessesData.map(business => business.type))],
    [businessesData]
  );

  // Filter businesses based on search term and filters
  const filteredBusinesses = useMemo(() => {
    return businessesData.filter(business => {
      const matchesSearch = 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === '' || business.location === locationFilter;
      const matchesType = typeFilter === '' || business.type === typeFilter;
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchTerm, locationFilter, typeFilter, businessesData]);

  if (loading) return <div className="p-4 text-center">Loading business data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Analytics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaStore />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Businesses</p>
              <p className="text-xl font-semibold">{businessStats.totalBusinesses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUsers />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Businesses</p>
              <p className="text-xl font-semibold">{businessStats.newBusinesses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Revenue</p>
              <p className="text-xl font-semibold">{businessStats.averageRevenue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaChartLine />
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth Rate</p>
              <p className="text-xl font-semibold">{businessStats.growthRate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Business Distribution by Type</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">Chart placeholder - Business distribution chart would go here</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Business Listings</h3>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by business name or owner"
                className="w-full p-2 pl-10 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-48">
              <select 
                className="w-full p-2 border rounded-md"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="w-48">
              <select 
                className="w-full p-2 border rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Business Types</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Businesses table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map(business => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{business.name}</td>
                    <td className="py-3 px-4">{business.type}</td>
                    <td className="py-3 px-4">{business.location}</td>
                    <td className="py-3 px-4">{business.owner}</td>
                    <td className="py-3 px-4">{business.revenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    No businesses found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredBusinesses.length} of {businessesData.length} businesses
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalytics;
