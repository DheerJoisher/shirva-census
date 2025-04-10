import React, { useState, useEffect } from 'react';
import { FaBook, FaUniversity, FaGraduationCap, FaChartPie, FaSearch, FaFilter } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';

const EducationAnalytics = () => {
  const [educationStats, setEducationStats] = useState({
    literacyRate: '0%',
    totalSchools: 0,
    highestEducation: '-',
    percentageGraduates: '0%',
  });

  const [residentEducationData, setResidentEducationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [educationFilters, setEducationFilters] = useState([]);

  useEffect(() => {
    async function fetchEducationData() {
      setLoading(true);
      try {
        const { data: educationData, error: educationError } = await supabase
          .from('EDUCATION')
          .select(`
            highest_qualification,
            school_or_college_name,
            year_of_completion,
            RESIDENTS(
              resident_id,
              first_name,
              middle_name,
              last_name,
              date_of_birth
            ),
            OCCUPATION(
              profession,
              occupation
            )
          `);

        if (educationError) throw educationError;

        if (educationData) {
          const processedData = educationData.map(item => {
            const resident = item.RESIDENTS;
            const occupation = item.OCCUPATION?.[0] || {};

            const birthDate = new Date(resident.date_of_birth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            const fullName = [resident.first_name, resident.middle_name, resident.last_name]
              .filter(Boolean)
              .join(' ');

            return {
              id: resident.resident_id,
              name: fullName,
              age: age,
              education: item.highest_qualification,
              field: item.school_or_college_name,
              profession: occupation.profession || "-",
              year_completed: item.year_of_completion
            };
          });

          setResidentEducationData(processedData);

          const uniqueEducation = [...new Set(processedData.map(item => item.education))].filter(Boolean);
          setEducationFilters(uniqueEducation);

          const totalResidents = processedData.length;
          const graduatesCount = processedData.filter(r => 
            ['B.Tech', 'B.E.', 'B.Com', 'B.A.', 'B.Sc.', 'M.Tech', 'MBA', 'Ph.D', 'M.S.', 'MBBS']
              .some(degree => r.education?.includes(degree))
          ).length;

          const uniqueInstitutions = [...new Set(processedData
            .map(item => item.field)
            .filter(Boolean))];

          const educationHierarchy = ['Ph.D', 'Post-Doctorate', 'M.Tech', 'MBA', 'MBBS', 'B.Tech'];
          let highestEdu = '-';
          for (const edu of educationHierarchy) {
            if (processedData.some(r => r.education?.includes(edu))) {
              highestEdu = edu;
              break;
            }
          }

          setEducationStats({
            literacyRate: totalResidents ? `${((totalResidents) / totalResidents * 100).toFixed(1)}%` : '0%',
            totalSchools: uniqueInstitutions.length,
            highestEducation: highestEdu,
            percentageGraduates: totalResidents ? `${(graduatesCount / totalResidents * 100).toFixed(1)}%` : '0%',
          });
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEducationData();
  }, []);

  const filteredResidents = residentEducationData.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (resident.profession && resident.profession.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterCategory === '' || resident.education === filterCategory;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Education Analytics</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading education data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaBook />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Literacy Rate</p>
                  <p className="text-xl font-semibold">{educationStats.literacyRate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaUniversity />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Schools</p>
                  <p className="text-xl font-semibold">{educationStats.totalSchools}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <FaGraduationCap />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Highest Education</p>
                  <p className="text-xl font-semibold">{educationStats.highestEducation}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaChartPie />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Graduates</p>
                  <p className="text-xl font-semibold">{educationStats.percentageGraduates}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Education Level Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Chart placeholder - Education level distribution chart would go here</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resident Education Details</h3>
              
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search residents..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <div className="relative">
                  <select
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Education</option>
                    {educationFilters.map(filter => (
                      <option key={filter} value={filter}>{filter}</option>
                    ))}
                  </select>
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Age</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Qualification</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Institution</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Year</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Profession</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{resident.name}</td>
                        <td className="py-3 px-4 border-b">{resident.age}</td>
                        <td className="py-3 px-4 border-b">{resident.education || '-'}</td>
                        <td className="py-3 px-4 border-b">{resident.field || '-'}</td>
                        <td className="py-3 px-4 border-b">{resident.year_completed || '-'}</td>
                        <td className="py-3 px-4 border-b">{resident.profession || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                        No residents found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-4">
              <p className="text-sm text-gray-500">Showing {filteredResidents.length} of {residentEducationData.length} residents</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EducationAnalytics;
