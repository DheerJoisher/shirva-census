import React, { useState } from 'react';
import { 
  Container, Box, Typography, TextField, Grid, FormControl, 
  InputLabel, Select, MenuItem, FormControlLabel, Radio, 
  RadioGroup, Checkbox, FormGroup, Button, Paper, Divider,
  FormLabel, FormHelperText, Alert, Snackbar
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import Navbar from '../../components/user/navbar';
import Footer from '../../components/user/footer';
import { supabase } from '../../supabaseClient';
import dayjs from 'dayjs';

const AddMember = () => {
  const [formData, setFormData] = useState({
    // Resident data
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    relation: '', // was relationToHead
    marital_status: '', // was maritalStatus
    date_of_birth: null,
    phone_number: '',
    email: '',
    lifemember: false, // was isLifeMember
    household_id: null, // Will be set based on the household

    // Occupation data
    occupation: '',
    profession: '',
    work_location: '',

    // Education data
    highest_qualification: '',
    school_or_college_name: '', // was schoolName
    year_of_completion: '',

    // Health data
    blood_group: '', // was bloodGroup
    mediclaim: false, // was hasMediclaim
    Thalassamia: '', // matches DB field name
    G6PD: false, // was g6pdChecked

    // WhatsApp group data
    Shirva_Setu: false, // was whatsappGroups.shirvaSetu
    Dukhad_Nidhan: false, // was whatsappGroups.dukhadNidhan
    SGNX: false, // was whatsappGroups.sgnx
    SGNX_Parent: false, // was whatsappGroups.sgnxParent
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              name === 'lifemember' || name === 'mediclaim' ? value === 'yes' : 
              value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date_of_birth: date
    });
  };

  const closeNotification = () => {
    setNotification({...notification, open: false});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format date for database
      const formattedDate = formData.date_of_birth ? 
                            dayjs(formData.date_of_birth).format('YYYY-MM-DD') : 
                            null;
      
      // Step 1: Insert into RESIDENTS table
      const { data: residentData, error: residentError } = await supabase
        .from('RESIDENTS')
        .insert([{
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          gender: formData.gender,
          relation: formData.relation,
          marital_status: formData.marital_status,
          date_of_birth: formattedDate,
          phone_number: formData.phone_number,
          email: formData.email,
          lifemember: formData.lifemember,
          household_id: formData.household_id || 1 // Default value, update as needed
        }])
        .select();

      if (residentError) throw residentError;
      
      const resident_id = residentData[0].resident_id;
      
      // Step 2: Insert into OCCUPATION table
      const { error: occupationError } = await supabase
        .from('OCCUPATION')
        .insert([{
          resident_id: resident_id,
          occupation: formData.occupation,
          profession: formData.profession,
          work_location: formData.work_location
        }]);
      
      if (occupationError) throw occupationError;
      
      // Step 3: Insert into EDUCATION table
      const { error: educationError } = await supabase
        .from('EDUCATION')
        .insert([{
          resident_id: resident_id,
          highest_qualification: formData.highest_qualification,
          school_or_college_name: formData.school_or_college_name,
          year_of_completion: formData.year_of_completion
        }]);
      
      if (educationError) throw educationError;
      
      // Step 4: Insert into HEALTH_RECORDS table
      const { error: healthError } = await supabase
        .from('HEALTH_RECORDS')
        .insert([{
          resident_id: resident_id,
          blood_group: formData.blood_group,
          mediclaim: formData.mediclaim ? 'yes' : 'no',
          Thalassamia: formData.Thalassamia,
          G6PD: formData.G6PD ? 'yes' : 'no'
        }]);
      
      if (healthError) throw healthError;
      
      // Step 5: Insert into WHATSAPP_GROUPS table
      const { error: whatsappError } = await supabase
        .from('WHATSAPP_GROUPS')
        .insert([{
          resident_id: resident_id,
          Shirva_Setu: formData.Shirva_Setu,
          Dukhad_Nidhan: formData.Dukhad_Nidhan,
          SGNX: formData.SGNX,
          SGNX_Parent: formData.SGNX_Parent
        }]);
      
      if (whatsappError) throw whatsappError;
      
      setNotification({
        open: true,
        message: 'Member added successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        relation: '',
        marital_status: '',
        date_of_birth: null,
        phone_number: '',
        email: '',
        lifemember: false,
        household_id: null,
        occupation: '',
        profession: '',
        work_location: '',
        highest_qualification: '',
        school_or_college_name: '',
        year_of_completion: '',
        blood_group: '',
        mediclaim: false,
        Thalassamia: '',
        G6PD: false,
        Shirva_Setu: false,
        Dukhad_Nidhan: false,
        SGNX: false,
        SGNX_Parent: false,
      });
      
    } catch (error) {
      console.error('Error adding member:', error);
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Options for select inputs
  const genderOptions = ['Male', 'Female', 'Other'];
  const relationOptions = ['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Other'];
  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const thalassemiaOptions = ['Major', 'Minor', 'Negative', 'Not Checked'];
  const qualificationOptions = ['Primary', 'Secondary', 'Higher Secondary', 'Diploma', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'];

  return (
    <>
      <Navbar />
      <Box sx={{ py: 4, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
              Add Family Member
            </Typography>
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Middle Name"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        label="Gender"
                      >
                        {genderOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Relation to Head of Family</InputLabel>
                      <Select
                        name="relation"
                        value={formData.relation}
                        onChange={handleChange}
                        label="Relation to Head of Family"
                      >
                        {relationOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Marital Status</InputLabel>
                      <Select
                        name="marital_status"
                        value={formData.marital_status}
                        onChange={handleChange}
                        label="Marital Status"
                      >
                        {maritalOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.date_of_birth}
                        onChange={handleDateChange}
                        slotProps={{ textField: { fullWidth: true, required: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Contact Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      type="tel"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Life Member</FormLabel>
                      <RadioGroup
                        row
                        name="lifemember"
                        value={formData.lifemember ? 'yes' : 'no'}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Professional Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  Professional Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Work Location"
                      name="work_location"
                      value={formData.work_location}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* Educational Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  Educational Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Highest Qualification</InputLabel>
                      <Select
                        name="highest_qualification"
                        value={formData.highest_qualification}
                        onChange={handleChange}
                        label="Highest Qualification"
                      >
                        {qualificationOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name of School/College"
                      name="school_or_college_name"
                      value={formData.school_or_college_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Year of Completion"
                      name="year_of_completion"
                      value={formData.year_of_completion}
                      onChange={handleChange}
                      type="number"
                      InputProps={{ inputProps: { min: 1950, max: new Date().getFullYear() } }}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* Health Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  Health Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Blood Group</InputLabel>
                      <Select
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        label="Blood Group"
                      >
                        {bloodGroupOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Mediclaim</FormLabel>
                      <RadioGroup
                        row
                        name="mediclaim"
                        value={formData.mediclaim ? 'yes' : 'no'}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Thalassemia</InputLabel>
                      <Select
                        name="Thalassamia"
                        value={formData.Thalassamia}
                        onChange={handleChange}
                        label="Thalassemia"
                      >
                        {thalassemiaOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.G6PD} 
                          onChange={handleChange} 
                          name="G6PD" 
                        />
                      }
                      label="G6PD Checked"
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* WhatsApp Groups */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                  WhatsApp Group Membership
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <FormControl component="fieldset" sx={{ ml: 2 }}>
                  <FormLabel component="legend">Member of the following WhatsApp Groups:</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.Shirva_Setu} 
                          onChange={handleChange} 
                          name="Shirva_Setu" 
                        />
                      }
                      label="Shirva Setu"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.Dukhad_Nidhan} 
                          onChange={handleChange} 
                          name="Dukhad_Nidhan" 
                        />
                      }
                      label="Dukhad Nidhan"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.SGNX} 
                          onChange={handleChange} 
                          name="SGNX" 
                        />
                      }
                      label="SGNX"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.SGNX_Parent} 
                          onChange={handleChange} 
                          name="SGNX_Parent" 
                        />
                      }
                      label="SGNX-Parent"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              
              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={closeNotification}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Footer />
    </>
  );
};

export default AddMember;
