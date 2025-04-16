import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57'];

const OccupationAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [employmentStats, setEmploymentStats] = useState({
    employed: 0,
    unemployed: 0,
    employmentRate: 0
  });
  const [professionData, setProfessionData] = useState([]);
  const [yearlyTrend, setYearlyTrend] = useState([]);
  const [occupationData, setOccupationData] = useState([]);

  // Define employment categories
  const UNEMPLOYED_CATEGORIES = ['Student', 'Homemaker', 'Retired', 'Unemployed'];
  const EMPLOYED_CATEGORIES = ['Employed', 'Self-employed', 'Business Owner'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from RESIDENTS table
        const { data: residents, error: residentsError } = await supabase
          .from('residents')
          .select(`
            resident_id,
            date_of_birth
          `);
        
        if (residentsError) throw residentsError;

        // Fetch data from OCCUPATION table
        const { data: occupationData, error: occupationError } = await supabase
          .from('occupation')
          .select(`
            resident_id,
            occupation,
            profession,
            work_location
          `);
        
        if (occupationError) throw occupationError;

        // Combine the data
        const combinedData = residents.map(resident => {
          const occupation = occupationData.find(
            record => record.resident_id === resident.resident_id
          ) || {};
          
          return {
            ...resident,
            occupation: occupation.occupation || 'Unknown',
            profession: occupation.profession || 'Unknown',
            work_location: occupation.work_location
          };
        });

        // Calculate employment statistics
        let employed = 0;
        let unemployed = 0;
        const professionCounts = {};
        const occupationCounts = {};

        combinedData.forEach(resident => {
          // Count employment status
          if (UNEMPLOYED_CATEGORIES.includes(resident.occupation)) {
            unemployed++;
          } else if (EMPLOYED_CATEGORIES.includes(resident.occupation)) {
            employed++;
          }

          // Count professions
          if (resident.profession && resident.profession !== 'Unknown') {
            professionCounts[resident.profession] = (professionCounts[resident.profession] || 0) + 1;
          }

          // Count occupations
          if (resident.occupation) {
            occupationCounts[resident.occupation] = (occupationCounts[resident.occupation] || 0) + 1;
          }
        });

        const totalCounted = employed + unemployed;
        const employmentRate = totalCounted > 0 ? Math.round((employed / totalCounted) * 100) : 0;

        setEmploymentStats({
          employed,
          unemployed,
          employmentRate
        });

        // Prepare profession distribution data (top 7)
        const professionDistribution = Object.entries(professionCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 7);

        setProfessionData(professionDistribution.length > 0 ? professionDistribution : [{ name: 'No Data', value: 1 }]);

        // Prepare occupation distribution data
        const occupationDistribution = Object.entries(occupationCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setOccupationData(occupationDistribution.length > 0 ? occupationDistribution : [{ name: 'No Data', value: 1 }]);

        // Calculate 5-year employment trend
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();
        
        const trendData = years.map(year => {
          // Filter residents who would be working age (18-65) in each year
          const minBirthYear = year - 65;
          const maxBirthYear = year - 18;
          
          const yearlyResidents = combinedData.filter(resident => {
            if (!resident.date_of_birth) return false;
            const birthYear = new Date(resident.date_of_birth).getFullYear();
            return birthYear >= minBirthYear && birthYear <= maxBirthYear;
          });

          const yearlyEmployed = yearlyResidents.filter(resident => 
            EMPLOYED_CATEGORIES.includes(resident.occupation)
          ).length;

          const yearlyUnemployed = yearlyResidents.filter(resident => 
            UNEMPLOYED_CATEGORIES.includes(resident.occupation)
          ).length;

          const total = yearlyEmployed + yearlyUnemployed;
          const rate = total > 0 ? Math.round((yearlyEmployed / total) * 100) : 0;

          return {
            year,
            employed: yearlyEmployed,
            unemployed: yearlyUnemployed,
            rate
          };
        });

        setYearlyTrend(trendData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Occupation Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Employment Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Employed</Typography>
              <Typography variant="h3">{employmentStats.employed}</Typography>
              <Typography variant="body2" color="text.secondary">
                {EMPLOYED_CATEGORIES.join(', ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Unemployed</Typography>
              <Typography variant="h3">{employmentStats.unemployed}</Typography>
              <Typography variant="body2" color="text.secondary">
                {UNEMPLOYED_CATEGORIES.join(', ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Employment Rate</Typography>
              <Typography variant="h3">{employmentStats.employmentRate}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Employed / (Employed + Unemployed)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Employment Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              5-Year Employment Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={yearlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="employed" name="Employed" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="unemployed" name="Unemployed" fill="#FF6B6B" />
                <Bar yAxisId="right" dataKey="rate" name="Employment Rate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Profession Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Top Professions
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={professionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {professionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupation Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Occupation Types
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={occupationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {occupationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        UNEMPLOYED_CATEGORIES.includes(entry.name) ? '#FF6B6B' :
                        EMPLOYED_CATEGORIES.includes(entry.name) ? '#8884d8' :
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OccupationAnalytics;