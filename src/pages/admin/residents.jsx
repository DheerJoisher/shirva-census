import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, TextField
} from '@mui/material';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import { supabase } from '../../supabaseClient';

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // Fetch residents with all related data
        const { data: residentsData, error: residentsError } = await supabase
          .from('residents')
          .select('*');

        if (residentsError) throw residentsError;

        // Fetch occupation data
        const { data: occupationData, error: occupationError } = await supabase
          .from('occupation')
          .select('*');
        
        if (occupationError) throw occupationError;

        // Fetch education data
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*');
        
        if (educationError) throw educationError;

        // Fetch health records
        const { data: healthData, error: healthError } = await supabase
          .from('health_records')
          .select('*');
        
        if (healthError) throw healthError;

        // Fetch whatsapp groups
        const { data: whatsappData, error: whatsappError } = await supabase
          .from('whatsapp_groups')
          .select('*');
        
        if (whatsappError) throw whatsappError;

        // Map all the data together
        const transformedData = residentsData.map(resident => {
          // Find related data for this resident
          const occupation = occupationData.find(o => o.resident_id === resident.resident_id) || {};
          const education = educationData.find(e => e.resident_id === resident.resident_id) || {};
          const health = healthData.find(h => h.resident_id === resident.resident_id) || {};
          const whatsapp = whatsappData.find(w => w.resident_id === resident.resident_id) || {};

          return {
            resident_id: resident.resident_id,
            first_name: resident.first_name,
            middle_name: resident.middle_name,
            last_name: resident.last_name,
            gender: resident.gender,
            relation: resident.relation,
            marital_status: resident.marital_status,
            date_of_birth: resident.date_of_birth,
            phone_number: resident.phone_number,
            email: resident.email,
            lifemember: resident.lifemember ? 'Yes' : 'No',

            // Occupation data
            occupation: occupation.occupation || '—',
            profession: occupation.profession || '—',
            work_location: occupation.work_location || '—',
            
            // Education data
            highest_qualification: education.highest_qualification || '—',
            school_name: education.school_or_college_name || '—',
            year_of_completion: education.year_of_completion || '—',
            
            // Health data
            blood_group: health.blood_group || '—',
            mediclaim: health.mediclaim || '—',
            thalassemia: health.thalassamia || '—',
            g6pd: health.g6pd || '—',
            
            // Whatsapp groups
            whatsapp_groups: {
              shirva_Setu: whatsapp.shirva_setu || false,
              dukhad_nidhan: whatsapp.dukhad_nidhan || false,
              sgnx: whatsapp.sgnx || false,
              sgnx_parent: whatsapp.sgnx_parent || false
            }
          };
        });

        setResidents(transformedData);
        setFilteredResidents(transformedData);
      } catch (error) {
        console.error('Error fetching residents:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredResidents(
      residents.filter((resident) =>
        Object.values(resident).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      )
    );
  };
  return (
    <>
      <Navbar />
      <Box sx={{ py: 4, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
              Residents List
            </Typography>

            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mb: 4 }}
            />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Middle Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Relation</TableCell>
                      <TableCell>Marital Status</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Life Member</TableCell>
                      <TableCell>Occupation</TableCell>
                      <TableCell>Profession</TableCell>
                      <TableCell>Work Location</TableCell>
                      <TableCell>Qualification</TableCell>
                      <TableCell>School/College</TableCell>
                      <TableCell>Year of Completion</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Mediclaim</TableCell>
                      <TableCell>Thalassemia</TableCell>
                      <TableCell>G6PD</TableCell>
                      <TableCell>WhatsApp Groups</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredResidents.map((resident, index) => (
                      <TableRow key={resident.resident_id || index}>
                        <TableCell>{resident.first_name}</TableCell>
                        <TableCell>{resident.middle_name}</TableCell>
                        <TableCell>{resident.last_name}</TableCell>
                        <TableCell>{resident.gender}</TableCell>
                        <TableCell>{resident.relation}</TableCell>
                        <TableCell>{resident.marital_status}</TableCell>
                        <TableCell>{resident.date_of_birth}</TableCell>
                        <TableCell>{resident.phone_number}</TableCell>
                        <TableCell>{resident.email}</TableCell>
                        <TableCell>{resident.lifemember}</TableCell>
                        <TableCell>{resident.occupation}</TableCell>
                        <TableCell>{resident.profession}</TableCell>
                        <TableCell>{resident.work_location}</TableCell>
                        <TableCell>{resident.highest_qualification}</TableCell>
                        <TableCell>{resident.school_name}</TableCell>
                        <TableCell>{resident.year_of_completion}</TableCell>
                        <TableCell>{resident.blood_group}</TableCell>
                        <TableCell>{resident.mediclaim}</TableCell>
                        <TableCell>{resident.thalassemia}</TableCell>
                        <TableCell>{resident.g6pd}</TableCell>
                        <TableCell>
                          {resident.whatsapp_groups && 
                            Object.entries(resident.whatsapp_groups)
                              .filter(([_, value]) => value)
                              .map(([key]) => key.replace(/_/g, ' '))
                              .join(', ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Residents;
