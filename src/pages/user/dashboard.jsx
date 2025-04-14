import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Chip, Divider, IconButton, Paper, TextField, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditMemberModal from '../../components/user/editmember';
import Navbar from '../../components/user/navbar';
import Footer from '../../components/user/footer';
import { supabase } from '../../supabaseClient'; // Import Supabase client
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [householdData, setHouseholdData] = useState(null);
  
  // Add state for the edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch household and family member data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Get household_id from localStorage
        const household_id = localStorage.getItem('household_id');
        if (!household_id) throw new Error('No household_id found in localStorage');
  
        // Get household details
        const { data: household, error: householdError } = await supabase
          .from('household')
          .select('*')
          .eq('household_id', household_id)
          .single();
  
        if (householdError) throw householdError;
        setHouseholdData(household);
  
        // Get all family members in this household
        const { data: members, error: membersError } = await supabase
          .from('residents')
          .select(`
            resident_id,
            first_name,
            middle_name,
            last_name,
            gender,
            relation,
            date_of_birth,
            phone_number,
            email
          
          `)
          .eq('household_id', household_id);
  
        if (membersError) throw membersError;
  
        // Process members data for display
        const processedMembers = members.map(member => {
          const birthDate = new Date(member.date_of_birth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
  
          return {
            id: member.resident_id,
            name: `${member.first_name} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name}`,
            age: age,
            relation: member.relation || 'Member',
            occupation: member.OCCUPATION?.occupation || 'Not specified',
            gender: member.gender || 'Not specified',
            phoneNumber: member.phone_number,
            email: member.email,
            dateOfBirth: member.date_of_birth,
            education: member.EDUCATION?.highest_qualification
          };
        });
  
        setFamilyMembers(processedMembers);
        setFilteredMembers(processedMembers);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Filter members based on search term
  useEffect(() => {
    setFilteredMembers(
      familyMembers.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.occupation && member.occupation.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, familyMembers]);

  // Handle member click to open edit modal
  const handleMemberClick = (member) => {
    setSelectedMember({
      ...member,
      _id: member.id, // Ensure we have _id for the modal
    });
    setShowEditModal(true);
  };

  // Handle member update
  const handleMemberUpdate = async (updatedMember) => {
    try {
      // Prepare the data according to our schema
      const residentData = {
        first_name: updatedMember.name.split(' ')[0],
        last_name: updatedMember.name.split(' ').slice(-1)[0],
        middle_name: updatedMember.name.split(' ').length > 2 ? 
          updatedMember.name.split(' ').slice(1, -1).join(' ') : null,
        gender: updatedMember.gender,
        relation: updatedMember.relation,
        phone_number: updatedMember.phoneNumber,
        email: updatedMember.email,
        date_of_birth: updatedMember.dateOfBirth
      };

      // Update the RESIDENTS table
      const { error: residentError } = await supabase
        .from('residents')
        .update(residentData)
        .eq('resident_id', updatedMember._id);
        
      if (residentError) throw residentError;
      
      // Update occupation information
      // if (updatedMember.occupation) {
      //   const { error: occupationError } = await supabase
      //     .from('OCCUPATION')
      //     .upsert({
      //       resident_id: updatedMember._id,
      //       occupation: updatedMember.occupation
      //     }, { onConflict: 'resident_id' });
          
      //   if (occupationError) throw occupationError;
      // }
      
      // // Update education information
      // if (updatedMember.education) {
      //   const { error: educationError } = await supabase
      //     .from('EDUCATION')
      //     .upsert({
      //       resident_id: updatedMember._id,
      //       highest_qualification: updatedMember.education
      //     }, { onConflict: 'resident_id' });
          
      //   if (educationError) throw educationError;
      // }

      // Refresh the data
      const index = familyMembers.findIndex(m => m.id === updatedMember._id);
      if (index !== -1) {
        const updatedMembers = [...familyMembers];
        updatedMembers[index] = {
          ...updatedMembers[index],
          name: updatedMember.name,
          age: updatedMember.age,
          relation: updatedMember.relation,
          occupation: updatedMember.occupation  || "",
          gender: updatedMember.gender,
          phoneNumber: updatedMember.phoneNumber,
          email: updatedMember.email,
          dateOfBirth: updatedMember.dateOfBirth,
          education: updatedMember.education || ""
        };
        setFamilyMembers(updatedMembers);
      }
      
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  // Calculate demographic counts
  const adults = filteredMembers.filter(m => m.age >= 18 && m.age < 60).length;
  const children = filteredMembers.filter(m => m.age < 18).length;
  const elders = filteredMembers.filter(m => m.age >= 60).length;

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg">
          {/* Dashboard Header */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(to right, #2c3e50, #3498db)',
              color: 'white'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Family Dashboard
                </Typography>
                <Typography variant="subtitle1">
                  {householdData ? `Welcome back! ${householdData.address || ''}` : 'Loading your family data...'}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Link to="/user/add-member">
                <IconButton 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  title="Add Member"
                >
                  <PersonAddIcon />
                </IconButton>
                </Link>
                <Link to="/user/family-settings">
                <IconButton 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  title="Manage Family"
                >
                  <FamilyRestroomIcon />
                </IconButton>
                </Link>
              </Box>
            </Box>

            {/* Summary Stats */}
            <Box display="flex" gap={3} mt={3}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2, flex: 1 }}>
                <Typography variant="h6" fontWeight="medium">{filteredMembers.length}</Typography>
                <Typography variant="body2">Family Members</Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2, flex: 1 }}>
                <Typography variant="h6" fontWeight="medium">{adults}</Typography>
                <Typography variant="body2">Adults</Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2, flex: 1 }}>
                <Typography variant="h6" fontWeight="medium">{children}</Typography>
                <Typography variant="body2">Children</Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2, flex: 1 }}>
                <Typography variant="h6" fontWeight="medium">{elders}</Typography>
                <Typography variant="body2">Elders</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Search and Filter */}
          <Box display="flex" justifyContent="space-between" mb={3} gap={2}>
            <Paper sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2, borderRadius: 2 }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              <TextField
                variant="standard"
                placeholder="Search members..."
                fullWidth
                InputProps={{ disableUnderline: true }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Paper>
            <IconButton sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <FilterListIcon />
            </IconButton>
          </Box>

          {/* Family Members List */}
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#2c3e50' }}>
            Family Members
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <Card 
                      elevation={1}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      <Box
                        sx={{
                          py: 2,
                          px: 2.5,
                          background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {member.relation} • {member.age} years
                        </Typography>
                      </Box>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              label={member.gender}
                              size="small"
                              sx={{ 
                                bgcolor: member.gender === 'Male' ? '#e3f2fd' : '#fce4ec',
                                color: member.gender === 'Male' ? '#1976d2' : '#d81b60' 
                              }}
                            />
                            <Chip
                              // label={member.occupation}
                              size="small"
                              sx={{ bgcolor: '#f5f5f5' }}
                            />
                          </Box>
                          <IconButton size="small">
                            <ArrowForwardIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box textAlign="center" py={5}>
                    <Typography variant="body1" color="text.secondary">
                      No family members found{searchTerm ? ' matching your search' : ''}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* Edit Member Modal */}
          <EditMemberModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            member={selectedMember}
            onUpdate={handleMemberUpdate}
          />
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Dashboard;
