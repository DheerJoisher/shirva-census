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
        // Fetch residents with joined data from related tables
        const { data, error } = await supabase
          .from('RESIDENTS')
          .select(`
            resident_id,
            first_name,
            middle_name,
            last_name,
            gender,
            relation,
            marital_status,
            date_of_birth,
            phone_number,
            email,
            lifemember,
            OCCUPATION (
              occupation,
              profession,
              work_location
            ),
            EDUCATION (
              highest_qualification,
              school_or_college_name,
              year_of_completion
            ),
            HEALTH_RECORDS (
              blood_group,
              mediclaim,
              Thalassamia,
              G6PD
            ),
            WHATSAPP_GROUPS (
              Shirva_Setu,
              Dukhad_Nidhan,
              SGNX,
              SGNX_Parent
            )
          `);

        if (error) throw error;
        
        // Transform data to flatten the structure for easier display
        const transformedData = data.map(resident => ({
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
          // Occupation details
          occupation: resident.OCCUPATION?.[0]?.occupation || '',
          profession: resident.OCCUPATION?.[0]?.profession || '',
          work_location: resident.OCCUPATION?.[0]?.work_location || '',
          // Education details
          highest_qualification: resident.EDUCATION?.[0]?.highest_qualification || '',
          school_name: resident.EDUCATION?.[0]?.school_or_college_name || '',
          year_of_completion: resident.EDUCATION?.[0]?.year_of_completion || '',
          // Health details
          blood_group: resident.HEALTH_RECORDS?.[0]?.blood_group || '',
          mediclaim: resident.HEALTH_RECORDS?.[0]?.mediclaim || '',
          thalassemia: resident.HEALTH_RECORDS?.[0]?.Thalassamia || '',
          g6pd: resident.HEALTH_RECORDS?.[0]?.G6PD || '',
          // WhatsApp groups
          whatsapp_groups: resident.WHATSAPP_GROUPS?.[0] || {
            Shirva_Setu: false,
            Dukhad_Nidhan: false,
            SGNX: false,
            SGNX_Parent: false
          }
        }));

        setResidents(transformedData);
        setFilteredResidents(transformedData);
      } catch (error) {
        console.error('Error fetching residents:', error);
        // Fallback to dummy data in case of error
        const dummyData = [
          {
            first_name: 'John',
            middle_name: 'A.',
            last_name: 'Doe',
            gender: 'Male',
            relation: 'Self',
            marital_status: 'Single',
            date_of_birth: '1990-01-01',
            phone_number: '1234567890',
            email: 'john.doe@example.com',
            lifemember: 'Yes',
            occupation: 'Engineer',
            profession: 'Software Developer',
            work_location: 'New York',
            highest_qualification: 'Master\'s',
            school_name: 'XYZ University',
            year_of_completion: '2015',
            blood_group: 'O+',
            mediclaim: 'Yes',
            thalassemia: 'Negative',
            g6pd: 'Negative',
            whatsapp_groups: {
              Shirva_Setu: true,
              Dukhad_Nidhan: false,
              SGNX: true,
              SGNX_Parent: false
            }
          },
          {
            first_name: 'Jane',
            middle_name: 'B.',
            last_name: 'Smith',
            gender: 'Female',
            relation: 'Spouse',
            marital_status: 'Married',
            date_of_birth: '1992-05-15',
            phone_number: '0987654321',
            email: 'jane.smith@example.com',
            lifemember: 'No',
            occupation: 'Doctor',
            profession: 'Pediatrician',
            work_location: 'Los Angeles',
            highest_qualification: 'Doctorate',
            school_name: 'ABC Medical College',
            year_of_completion: '2018',
            blood_group: 'A+',
            mediclaim: 'No',
            thalassemia: 'Not Checked',
            g6pd: 'Not Checked',
            whatsapp_groups: {
              Shirva_Setu: false,
              Dukhad_Nidhan: true,
              SGNX: false,
              SGNX_Parent: true
            }
          }
        ];
        setResidents(dummyData);
        setFilteredResidents(dummyData);
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
