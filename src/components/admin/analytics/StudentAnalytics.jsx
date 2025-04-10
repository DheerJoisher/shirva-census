import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaSchool, FaAward, FaChartBar, FaSearch } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';

const StudentAnalytics = () => {
  const [studentStats, setStudentStats] = useState({
    totalStudents: 0,
    highSchool: 0,
    college: 0,
    graduationRate: '0%',
  });
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch students with education information
        const { data, error } = await supabase
          .from('EDUCATION')
          .select(`
            resident_id,
            highest_qualification,
            school_or_college_name,
            year_of_completion,
            RESIDENTS (
              first_name,
              middle_name,
              last_name,
              gender
            )
          `);
          
        if (error) throw error;
        
        // Transform the data to a more usable format
        const formattedData = data.map(item => ({
          id: item.resident_id,
          name: `${item.RESIDENTS.first_name} ${item.RESIDENTS.middle_name || ''} ${item.RESIDENTS.last_name}`.trim(),
          educationLevel: item.highest_qualification,
          institution: item.school_or_college_name,
          completionYear: item.year_of_completion,
          gender: item.RESIDENTS.gender
        }));
        
        setStudents(formattedData);
        
        // Calculate statistics
        const highSchoolCount = data.filter(item => 
          ['High School', 'Secondary', 'SSC', 'SSLC', 'HSC', 'Class 10', 'Class 12'].some(
            term => item.highest_qualification?.includes(term)
          )
        ).length;
        
        const collegeCount = data.filter(item => 
          ['Bachelor', 'Master', 'PhD', 'Diploma', 'Degree'].some(
            term => item.highest_qualification?.includes(term)
          )
        ).length;
        
        // Calculate graduation rate (simplified calculation for demo)
        // In a real app, you would need more complex logic to calculate this
        const graduatesCount = data.filter(item => item.year_of_completion).length;
        const graduationRate = data.length > 0 ? 
          Math.round((graduatesCount / data.length) * 100) + '%' : '0%';
        
        setStudentStats({
          totalStudents: data.length,
          highSchool: highSchoolCount,
          college: collegeCount,
          graduationRate: graduationRate
        });
        
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Get unique education levels for filter dropdown
  const educationLevels = [...new Set(students.map(student => student.educationLevel))]
    .filter(Boolean) // Remove any undefined or null values
    .sort();
  
  // Get unique completion years for filter dropdown
  const completionYears = [...new Set(students.map(student => student.completionYear))]
    .filter(Boolean) // Remove any undefined or null values
    .sort((a, b) => a - b);

  // Filter students based on search query and filters
  const filteredStudents = students.filter(student => {
    // Search by name
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by education level
    const matchesEducation = educationFilter ? student.educationLevel === educationFilter : true;
    
    // Filter by completion year
    const matchesYear = yearFilter ? student.completionYear === parseInt(yearFilter) : true;
    
    return matchesSearch && matchesEducation && matchesYear;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading student data...</p>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{error}</p>
    </div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Student Analytics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-xl font-semibold">{studentStats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaSchool />
            </div>
            <div>
              <p className="text-sm text-gray-500">High School</p>
              <p className="text-xl font-semibold">{studentStats.highSchool}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaSchool />
            </div>
            <div>
              <p className="text-sm text-gray-500">College/University</p>
              <p className="text-xl font-semibold">{studentStats.college}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaAward />
            </div>
            <div>
              <p className="text-sm text-gray-500">Graduation Rate</p>
              <p className="text-xl font-semibold">{studentStats.graduationRate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Students by Education Level</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">Chart placeholder - Student education level distribution chart would go here</p>
        </div>
      </div>

      {/* Student Listing Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Student Directory</h3>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaSearch />
            </span>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
            >
              <option value="">All Qualifications</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">All Completion Years</option>
              {completionYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSearchQuery('');
                setEducationFilter('');
                setYearFilter('');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Highest Qualification</th>
                <th className="py-3 px-4 text-left font-semibold">Institution</th>
                <th className="py-3 px-4 text-left font-semibold">Completion Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">{student.educationLevel || 'N/A'}</td>
                    <td className="py-3 px-4">{student.institution || 'N/A'}</td>
                    <td className="py-3 px-4">{student.completionYear || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 px-4 text-center text-gray-500" colSpan="4">
                    {students.length > 0 
                      ? 'No students match your search criteria' 
                      : 'No student education records available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-gray-500 text-sm">
          Showing {filteredStudents.length} out of {students.length} students
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
