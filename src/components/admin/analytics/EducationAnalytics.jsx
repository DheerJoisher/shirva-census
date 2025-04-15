// import React, { useState, useEffect } from 'react';
// import { FaBook, FaUniversity, FaGraduationCap, FaChartPie, FaSearch, FaFilter } from 'react-icons/fa';
// import { supabase } from '../../../supabaseClient';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const EducationAnalytics = () => {
//   const [educationStats, setEducationStats] = useState({
//     literacyRate: '0%',
//     totalSchools: 0,
//     highestEducation: '-',
//     percentageGraduates: '0%',
//   });
//   const [residentEducationData, setResidentEducationData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [educationFilters, setEducationFilters] = useState([]);
//   const [chartData, setChartData] = useState(null);

//   const fetchEducationData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Query only the columns that exist in your database
//       const { data, error } = await supabase
//         .from('education')
//         .select(`
//           resident_id,
//           highest_qualification,
//           school_or_college_name,
//           year_of_completion
//         `)
//         .limit(100);

//       if (error) throw error;
//       if (!data || data.length === 0) throw new Error('No education records found');

//       // Process the data (without resident details since they're not in your schema)
//       const processedData = data.map((item, index) => ({
//         id: item.resident_id || edu-${index}, // Create unique ID
//         residentId: item.resident_id,
//         name: 'Unknown', // Placeholder since resident names aren't in your schema
//         age: '-',        // Placeholder
//         education: item.highest_qualification || '-',
//         field: item.school_or_college_name || '-',
//         profession: '-', // Placeholder
//         year_completed: item.year_of_completion || '-'
//       }));

//       setResidentEducationData(processedData);
//       updateEducationStats(processedData);
//       setEducationFilters([...new Set(processedData.map(item => item.education).filter(Boolean))]);
      
//     } catch (err) {
//       console.error('Data fetch error:', err);
//       setError(err.message || 'Failed to load education data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAge = (dateString) => {
//     if (!dateString) return null;
//     try {
//       const birthDate = new Date(dateString);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       return age;
//     } catch (e) {
//       console.error('Error calculating age:', e);
//       return null;
//     }
//   };
//   const updateEducationStats = (data) => {
//     const totalResidents = data.length;
//     if (totalResidents === 0) return;

//     const graduatesCount = data.filter(r => 
//       ['B.Tech', 'B.E.', 'B.Com', 'B.A.', 'B.Sc.', 'M.Tech', 'MBA', 'Ph.D', 'M.S.', 'MBBS']
//         .some(degree => r.education?.includes(degree))
//     ).length;

//     const uniqueInstitutions = [...new Set(data.map(item => item.field).filter(Boolean))].length;

//     const educationHierarchy = ['Ph.D', 'Post-Doctorate', 'M.Tech', 'MBA', 'MBBS', 'B.Tech'];
//     const highestEdu = educationHierarchy.find(edu => 
//       data.some(r => r.education?.includes(edu))) || '-';

//     setChartData({
//       labels: ['Literate', 'Graduates', 'Others'],
//       datasets: [{
//         data: [totalResidents, graduatesCount, totalResidents - graduatesCount],
//         backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56'],
//         borderWidth: 1
//       }]
//     });

//     setEducationStats({
//       literacyRate: '100%',
//       totalSchools: uniqueInstitutions,
//       highestEducation: highestEdu,
//       percentageGraduates: ${(graduatesCount / totalResidents * 100).toFixed(1)}%,
//     });
//   };

//   // Update filteredResidents to work without resident names
//   const filteredResidents = residentEducationData.filter(resident => {
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch = 
//       resident.education.toLowerCase().includes(searchLower) ||
//       resident.field.toLowerCase().includes(searchLower);

//     const matchesFilter = filterCategory === '' || resident.education === filterCategory;

//     return matchesSearch && matchesFilter;
//   });
  

//   useEffect(() => {
//     fetchEducationData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//         <p className="text-gray-600">Loading education data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-3xl mx-auto">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 text-red-500">
//             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-700">Data Loading Error</h3>
//             <div className="mt-2 text-sm text-red-600">
//               <p>{error}</p>
//             </div>
//             <div className="mt-4">
//               <button
//                 onClick={fetchEducationData}
//                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Retry Loading Data
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold mb-6">Education Analytics</h2>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//               <FaBook />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Literacy Rate</p>
//               <p className="text-xl font-semibold">{educationStats.literacyRate}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//               <FaUniversity />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Schools</p>
//               <p className="text-xl font-semibold">{educationStats.totalSchools}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//               <FaGraduationCap />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Highest Education</p>
//               <p className="text-xl font-semibold">{educationStats.highestEducation}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//               <FaChartPie />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Graduates</p>
//               <p className="text-xl font-semibold">{educationStats.percentageGraduates}</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Education Distribution Chart */}
//       <div className="bg-white p-6 rounded-lg shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Education Level Distribution</h3>
//         <div className="h-64">
//           {chartData ? (
//             <Pie 
//               data={chartData} 
//               options={{ 
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     position: 'right',
//                   }
//                 }
//               }} 
//             />
//           ) : (
//             <div className="h-full flex items-center justify-center text-gray-500">
//               No chart data available
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Resident Education Table */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
//           <h3 className="text-lg font-semibold">Resident Education Details</h3>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search residents..."
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
            
//             <div className="relative">
//               <select
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//               >
//                 <option value="">All Education</option>
//                 {educationFilters.map(filter => (
//                   <option key={filter} value={filter}>{filter}</option>
//                 ))}
//               </select>
//               <FaFilter className="absolute left-3 top-3 text-gray-400" />
//             </div>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Name</th>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Age</th>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Qualification</th>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Institution</th>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Year</th>
//                 <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Profession</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredResidents.length > 0 ? (
//                 filteredResidents.map((resident) => (
//                   <tr key={resident.id} className="hover:bg-gray-50">
//                     <td className="py-3 px-4 border-b">{resident.name}</td>
//                     <td className="py-3 px-4 border-b">{resident.age}</td>
//                     <td className="py-3 px-4 border-b">{resident.education}</td>
//                     <td className="py-3 px-4 border-b">{resident.field}</td>
//                     <td className="py-3 px-4 border-b">{resident.year_completed}</td>
//                     <td className="py-3 px-4 border-b">{resident.profession}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
//                     No residents found matching your search criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="flex justify-end mt-4">
//           <p className="text-sm text-gray-500">
//             Showing {filteredResidents.length} of {residentEducationData.length} residents
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EducationAnalytics;
import React, { useState, useEffect } from 'react';
import { FaBook, FaVenus, FaMars, FaSearch, FaFilter } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, PointElement, LineElement, Title
);

const EducationAnalytics = () => {
  const [literacyStats, setLiteracyStats] = useState({
    overall: '0%',
    male: '0%',
    female: '0%'
  });
  const [residentEducationData, setResidentEducationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educationFilters, setEducationFilters] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [selectedLineChartMetric, setSelectedLineChartMetric] = useState('graduationYear');

  const fetchEducationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch education data with resident details
      const { data: educationData, error: educationError } = await supabase
        .from('education')
        .select(`
          resident_id,
          highest_qualification,
          school_or_college_name,
          year_of_completion,
          residents (
            resident_id,
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender
          )
        `)
        .limit(1000);

      if (educationError) throw educationError;
      if (!educationData || educationData.length === 0) throw new Error('No education records found');

      // Process data
      const processedData = educationData.map(item => {
        const resident = item.residents || {};
        const fullName = [
          resident.first_name,
          resident.middle_name,
          resident.last_name
        ].filter(Boolean).join(' ');

        return {
          id: item.resident_id,
          name: fullName || 'Unknown',
          gender: resident.gender || 'Unknown',
          education: item.highest_qualification || '-',
          institution: item.school_or_college_name || '-',
          graduationYear: item.year_of_completion || null,
          dateOfBirth: resident.date_of_birth || null
        };
      });

      setResidentEducationData(processedData);
      updateLiteracyStats(processedData);
      updateCharts(processedData);
      
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message || 'Failed to load education data');
    } finally {
      setLoading(false);
    }
  };

  const updateLiteracyStats = (data) => {
    const totalResidents = data.length;
    if (totalResidents === 0) return;

    const maleResidents = data.filter(r => r.gender === 'Male');
    const femaleResidents = data.filter(r => r.gender === 'Female');

    // Assuming all records indicate literacy since they have education data
    setLiteracyStats({
      overall: '100%',
      male: maleResidents.length > 0 ? '100%' : '0%',
      female: femaleResidents.length > 0 ? '100%' : '0%'
    });
  };

  const updateCharts = (data) => {
    // Dynamic Pie Chart - Group by actual education levels found in data
    const educationLevels = {};
    
    data.forEach(resident => {
      const edu = resident.education;
      if (!edu) return;
      
      // Clean and standardize education levels
      const standardizedEdu = standardizeEducationLevel(edu);
      
      if (standardizedEdu) {
        educationLevels[standardizedEdu] = (educationLevels[standardizedEdu] || 0) + 1;
      }
    });

    // Sort by count descending and take top 10 for readability
    const sortedLevels = Object.entries(educationLevels)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    setPieChartData({
      labels: sortedLevels.map(([level]) => level),
      datasets: [{
        data: sortedLevels.map(([_, count]) => count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC24A', '#F06292',
          '#7986CB', '#4DB6AC'
        ],
        borderWidth: 1
      }]
    });

    // Update Line Chart
    updateLineChart(data, selectedLineChartMetric);
    
    // Set filters for table
    setEducationFilters(sortedLevels.map(([level]) => level));
  };

  const standardizeEducationLevel = (education) => {
    // Standardize common education levels
    const mappings = {
      'primary': 'Primary',
      'elementary': 'Primary',
      'secondary': 'Secondary',
      'high school': 'Secondary',
      '10th': 'Secondary',
      'higher secondary': 'Higher Secondary',
      '12th': 'Higher Secondary',
      'intermediate': 'Higher Secondary',
      'bachelor': 'Bachelor',
      'b\.?tech': 'B.Tech',
      'b\.?e\.?': 'B.E.',
      'b\.?com': 'B.Com',
      'b\.?a\.?': 'B.A.',
      'b\.?sc\.?': 'B.Sc.',
      'master': 'Master',
      'm\.?tech': 'M.Tech',
      'mba': 'MBA',
      'm\.?s\.?': 'M.S.',
      'ph\.?d': 'Ph.D',
      'post doctorate': 'Post-Doctorate',
      'mbbs': 'MBBS',
      'ca': 'CA',
      'cs': 'CS',
      'llb': 'LLB'
    };

    const lowerEdu = education.toLowerCase();
    for (const [pattern, standardized] of Object.entries(mappings)) {
      if (new RegExp(pattern).test(lowerEdu)) {
        return standardized;
      }
    }

    // Return original if no match found (capitalize first letters)
    return education.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const updateLineChart = (data, metric) => {
    if (metric === 'graduationYear') {
      // Group by graduation year
      const yearCounts = {};
      data.forEach(item => {
        const year = item.graduationYear;
        if (year) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      });

      const sortedYears = Object.keys(yearCounts).sort();
      
      setLineChartData({
        labels: sortedYears,
        datasets: [{
          label: 'Graduations per Year',
          data: sortedYears.map(year => yearCounts[year]),
          borderColor: '#4BC0C0',
          tension: 0.1,
          fill: false
        }]
      });
    } else if (metric === 'educationTrend') {
      // Group by year and education level
      const trends = {};
      data.forEach(item => {
        const year = item.graduationYear;
        if (!year) return;
        
        const standardizedEdu = standardizeEducationLevel(item.education);
        if (standardizedEdu) {
          if (!trends[standardizedEdu]) trends[standardizedEdu] = {};
          trends[standardizedEdu][year] = (trends[standardizedEdu][year] || 0) + 1;
        }
      });

      const allYears = [...new Set(data.map(item => item.graduationYear).filter(Boolean))].sort();
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

      setLineChartData({
        labels: allYears,
        datasets: Object.entries(trends)
          .slice(0, 5) // Limit to top 5 for readability
          .map(([category, yearData], idx) => ({
            label: category,
            data: allYears.map(year => yearData[year] || 0),
            borderColor: colors[idx % colors.length],
            tension: 0.1,
            fill: false
          }))
      });
    }
  };

  const filteredResidents = residentEducationData.filter(resident => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchLower) ||
      resident.education.toLowerCase().includes(searchLower) ||
      resident.institution.toLowerCase().includes(searchLower);

    const matchesFilter = filterCategory === '' || 
      resident.education.toLowerCase().includes(filterCategory.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchEducationData();
  }, []);

  useEffect(() => {
    if (residentEducationData.length > 0) {
      updateLineChart(residentEducationData, selectedLineChartMetric);
    }
  }, [selectedLineChartMetric]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading education data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-3xl mx-auto">
        <div className="text-red-700">{error}</div>
        <button
          onClick={fetchEducationData}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Education Analytics</h2>
      
      {/* Literacy Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaBook />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Literacy Rate</p>
              <p className="text-xl font-semibold">{literacyStats.overall}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaMars />
            </div>
            <div>
              <p className="text-sm text-gray-500">Male Literacy Rate</p>
              <p className="text-xl font-semibold">{literacyStats.male}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
              <FaVenus />
            </div>
            <div>
              <p className="text-sm text-gray-500">Female Literacy Rate</p>
              <p className="text-xl font-semibold">{literacyStats.female}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Education Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Education Level Distribution</h3>
        <div className="h-96">
          {pieChartData ? (
            <Pie 
            data={pieChartData} 
            options={{ 
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }} 
          />
          
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No education data available
            </div>
          )}
        </div>
      </div>

      {/* Education Trends Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Education Trends</h3>
          <select
            className="border rounded px-3 py-1"
            value={selectedLineChartMetric}
            onChange={(e) => setSelectedLineChartMetric(e.target.value)}
          >
            <option value="graduationYear">Graduations by Year</option>
            <option value="educationTrend">Education Level Trends</option>
          </select>
        </div>
        <div className="h-96">
          {lineChartData ? (
            <Line 
              data={lineChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Resident Education Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold">Resident Education Details</h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Education Levels</option>
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
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Gender</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Education</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Institution</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.length > 0 ? (
                filteredResidents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{resident.name}</td>
                    <td className="py-3 px-4 border-b">{resident.gender}</td>
                    <td className="py-3 px-4 border-b">{resident.education}</td>
                    <td className="py-3 px-4 border-b">{resident.institution}</td>
                    <td className="py-3 px-4 border-b">{resident.graduationYear || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EducationAnalytics;
