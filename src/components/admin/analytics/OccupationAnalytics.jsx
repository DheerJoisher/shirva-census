import React, { useState, useMemo, useEffect } from 'react';
import { FaBriefcase, FaIndustry, FaChartLine, FaSearch } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';

const OccupationAnalytics = () => {
  // State for occupation data and UI
  const [occupationStats, setOccupationStats] = useState({
    employmentRate: '0%',
    topSector: 'N/A',
    topOccupation: 'N/A',
  });

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Fetch residents with occupation data
  useEffect(() => {
    const fetchResidentsWithOccupation = async () => {
      try {
        setLoading(true);
        
        // Join RESIDENTS and OCCUPATION tables
        const { data, error } = await supabase
          .from('RESIDENTS')
          .select(`
            resident_id,
            first_name,
            middle_name,
            last_name,
            OCCUPATION (
              occupation_id,
              occupation,
              profession,
              work_location
            )
          `);
        
        if (error) throw error;
        
        // Transform the data to match our component's expected format
        const transformedData = data.map(resident => {
          const occupation = resident.OCCUPATION?.[0]; // Get the first occupation record
          return {
            id: resident.resident_id,
            name: `${resident.first_name} ${resident.middle_name ? resident.middle_name + ' ' : ''}${resident.last_name}`.trim(),
            occupation: occupation?.occupation || 'Unemployed',
            workLocation: occupation?.work_location || 'N/A',
            sector: occupation?.profession || 'N/A'
          };
        });
        
        setResidents(transformedData);
        calculateStats(transformedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load occupation data');
      } finally {
        setLoading(false);
      }
    };

    fetchResidentsWithOccupation();
  }, []);

  // Calculate occupation statistics
  const calculateStats = (data) => {
    if (!data.length) return;
    
    // Employment rate
    const employed = data.filter(r => r.occupation !== 'Unemployed').length;
    const employmentRate = ((employed / data.length) * 100).toFixed(1) + '%';
    
    // Find top sector/profession
    const sectorCounts = {};
    const occupationCounts = {};
    
    data.forEach(r => {
      if (r.sector !== 'N/A') {
        sectorCounts[r.sector] = (sectorCounts[r.sector] || 0) + 1;
      }
      
      if (r.occupation !== 'Unemployed') {
        occupationCounts[r.occupation] = (occupationCounts[r.occupation] || 0) + 1;
      }
    });
    
    let topSector = 'N/A';
    let maxSectorCount = 0;
    
    Object.entries(sectorCounts).forEach(([sector, count]) => {
      if (count > maxSectorCount) {
        maxSectorCount = count;
        topSector = sector;
      }
    });
    
    let topOccupation = 'N/A';
    let maxOccupationCount = 0;
    
    Object.entries(occupationCounts).forEach(([occupation, count]) => {
      if (count > maxOccupationCount) {
        maxOccupationCount = count;
        topOccupation = occupation;
      }
    });
    
    setOccupationStats({
      employmentRate,
      topSector,
      topOccupation
    });
  };

  // Get unique sectors and locations for filter dropdowns
  const sectors = useMemo(() => [...new Set(residents.map(resident => resident.sector))], [residents]);
  const locations = useMemo(() => [...new Set(residents.map(resident => resident.workLocation))], [residents]);

  // Filter residents based on search and filters
  const filteredResidents = useMemo(() => {
    return residents.filter(resident => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        resident.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resident.occupation.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Sector filter
      const matchesSector = selectedSector === '' || resident.sector === selectedSector;
      
      // Location filter
      const matchesLocation = selectedLocation === '' || resident.workLocation === selectedLocation;
      
      return matchesSearch && matchesSector && matchesLocation;
    });
  }, [residents, searchQuery, selectedSector, selectedLocation]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('');
    setSelectedLocation('');
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Occupation Analytics</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaBriefcase />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Rate</p>
                  <p className="text-xl font-semibold">{occupationStats.employmentRate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaIndustry />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Top Sector</p>
                  <p className="text-xl font-semibold">{occupationStats.topSector}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaChartLine />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Top Occupation</p>
                  <p className="text-xl font-semibold">{occupationStats.topOccupation}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Occupation Distribution by Industry</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Chart placeholder - Occupation distribution chart would go here</p>
            </div>
          </div>

          {/* Resident Occupation List Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Resident Occupation Details</h3>
            
            {/* Search and Filter Controls */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or occupation"
                  className="pl-10 p-2 border rounded w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="p-2 border rounded w-full"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <option value="">All Sectors</option>
                  {sectors.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select 
                  className="p-2 border rounded w-full"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            {/* Residents Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Occupation</th>
                    <th className="py-2 px-4 border-b text-left">Work Location</th>
                    <th className="py-2 px-4 border-b text-left">Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((resident) => (
                      <tr key={resident.id}>
                        <td className="py-2 px-4 border-b">{resident.name}</td>
                        <td className="py-2 px-4 border-b">{resident.occupation}</td>
                        <td className="py-2 px-4 border-b">{resident.workLocation}</td>
                        <td className="py-2 px-4 border-b">{resident.sector}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">No matching residents found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredResidents.length} of {residents.length} residents
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OccupationAnalytics;
