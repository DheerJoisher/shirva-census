import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Grid, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, Radio,
  RadioGroup, Checkbox, FormGroup, Button, Paper, Divider,
  FormLabel, Alert, Snackbar
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

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    genderOptions: [],
    relationOptions: [],
    maritalOptions: [],
    bloodGroupOptions: [],
    thalassemiaOptions: [],
    qualificationOptions: [],
    occupationOptions: [],
    professionOptions: []
  });

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const fetchOptions = async (category, fallback) => {
          const { data } = await supabase
            .from('dropdown_options')
            .select('options')
            .eq('category', category)
            .single();
          return data?.options || fallback;
        };

        setDropdownOptions({
          genderOptions: await fetchOptions('gender', ['Male', 'Female', 'Other']),
          relationOptions: await fetchOptions('relation', ['Self', 'Husband', 'Wife', 'Son', 'Daughter-in-law', 'Grand Son', 'Grand Daughter', 'Daughter', 'Brother', 'Sister']),
          maritalOptions: await fetchOptions('marital_status', ['Single', 'Married']),
          bloodGroupOptions: await fetchOptions('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']),
          thalassemiaOptions: await fetchOptions('thalassemia', ['Major', 'Minor', 'Negative', 'Not Checked']),
          qualificationOptions: await fetchOptions('qualification', ['Primary', 'Secondary', 'Higher Secondary', 'Diploma', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other']),
          occupationOptions: await fetchOptions('occupation', ['Student', 'Employed', 'Self-employed', 'Business Owner', 'Homemaker', 'Retired', 'Unemployed', 'Other']),
          professionOptions: await fetchOptions('profession', ['Doctor', 'Engineer', 'Teacher/Professor', 'Lawyer', 'Accountant', 'IT Professional', 'Government Employee', 'Banking Professional', 'Business', 'Agriculture', 'Skilled Trade', 'Nurse/Healthcare Worker', 'Artist/Creative Professional', 'Not Applicable', 'Other'])
        });
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
        setDropdownOptions({
          genderOptions: ['Male', 'Female', 'Other'],
          relationOptions: ['Self', 'Husband', 'Wife', 'Son', 'Daughter-in-law', 'Grand Son', 'Grand Daughter', 'Daughter', 'Brother', 'Sister'],
          maritalOptions: ['Single', 'Married'],
          bloodGroupOptions: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
          thalassemiaOptions: ['Major', 'Minor', 'Negative', 'Not Checked'],
          qualificationOptions: ['Primary', 'Secondary', 'Higher Secondary', 'Diploma', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'],
          occupationOptions: ['Student', 'Employed', 'Self-employed', 'Business Owner', 'Homemaker', 'Retired', 'Unemployed', 'Other'],
          professionOptions: ['Doctor', 'Engineer', 'Teacher/Professor', 'Lawyer', 'Accountant', 'IT Professional', 'Government Employee', 'Banking Professional', 'Business', 'Agriculture', 'Skilled Trade', 'Nurse/Healthcare Worker', 'Artist/Creative Professional', 'Not Applicable', 'Other']
        });
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'lifemember' || name === 'mediclaim') ? value === 'yes' : 
              value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date_of_birth: date }));
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formattedDate = formData.date_of_birth
        ? dayjs(formData.date_of_birth).format('YYYY-MM-DD')
        : null;
  
      const isHeadOfFamily = formData.relation === 'Self';
      let household_id = null;
  
      // Insert into RESIDENTS (including occupation and profession)
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
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
          occupation: formData.occupation,
          profession: formData.profession,
          household_id: null
        }])
        .select();
  
      if (residentError) throw residentError;
  
      const resident_id = residentData[0].resident_id;
  
      if (isHeadOfFamily) {
        const { data: householdData, error: householdError } = await supabase
          .from('household')
          .insert([{
            head_of_family_id: resident_id,
            address: '',
            chapter: '',
            number_of_members: 1
          }])
          .select();
  
        if (householdError) throw householdError;
  
        household_id = householdData[0].household_id;
  
        const { error: updateResidentError } = await supabase
          .from('residents')
          .update({ household_id })
          .eq('resident_id', resident_id);
  
        if (updateResidentError) throw updateResidentError;
  
        localStorage.setItem('household_id', household_id);
      } else {
        household_id = localStorage.getItem('household_id');
        if (!household_id) throw new Error("Head of family must register first");
  
        const { error: updateResidentError } = await supabase
          .from('residents')
          .update({ household_id })
          .eq('resident_id', resident_id);
  
        if (updateResidentError) throw updateResidentError;
      }
  
      // Insert into OCCUPATION table (with additional work_location)
      const { error: occupationError } = await supabase
        .from('occupation')
        .insert([{
          resident_id,
          occupation: formData.occupation,
          profession: formData.profession,
          work_location: formData.work_location
        }]);
  
      if (occupationError) throw occupationError;
  
      // Insert into other tables with better error handling
      try {
        const [educationResult, healthResult, whatsappResult] = await Promise.all([
          // Education table
          supabase.from('education').insert([{
            resident_id,
            highest_qualification: formData.highest_qualification,
            school_or_college_name: formData.school_or_college_name,
            year_of_completion: formData.year_of_completion
          }]),
          
          // Health records table - fixed to ensure proper data format
          supabase.from('health_records').insert([{
            resident_id,
            blood_group: formData.blood_group || 'Unknown',
            mediclaim: formData.mediclaim ? 'yes' : 'no',
            thalassamia: formData.Thalassamia || 'Not Checked',
            g6pd: formData.G6PD ? 'yes' : 'no'
          }]),
          
          // WhatsApp groups table - fixed to use boolean values consistently
          supabase.from('whatsapp_groups').insert([{
            resident_id,
            shirva_setu: formData.shirva_setu || false,
            dukhad_nidhan: formData.dukhad_nidhan || false,
            sgnx: formData.sgnx || false,
            sgnx_parent: formData.sgnx_parent || false
          }])
        ]);
        
        // Check for errors in each result
        if (educationResult.error) throw new Error(`Education data error: ${educationResult.error.message}`);
        if (healthResult.error) throw new Error(`Health records error: ${healthResult.error.message}`);
        if (whatsappResult.error) throw new Error(`WhatsApp groups error: ${whatsappResult.error.message}`);
        
      } catch (tableError) {
        console.error('Error inserting into secondary tables:', tableError);
        throw tableError;
      }
  
      setNotification({
        open: true,
        message: 'Member added successfully!',
        severity: 'success'
      });
  
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
                        required
                      >
                        {dropdownOptions.genderOptions.map(option => (
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
                        required
                      >
                        {dropdownOptions.relationOptions.map(option => (
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
                        required
                      >
                        {dropdownOptions.maritalOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth *"
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
                      required
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
                      required
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
                    <FormControl fullWidth required>
                      <InputLabel>Occupation</InputLabel>
                      <Select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        label="Occupation"
                        required
                      >
                        {dropdownOptions.occupationOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Profession</InputLabel>
                      <Select
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        label="Profession"
                        required
                      >
                        {dropdownOptions.professionOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Work Location"
                      name="work_location"
                      value={formData.work_location}
                      onChange={handleChange}
                      required
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
                    <FormControl fullWidth required>
                      <InputLabel>Highest Qualification</InputLabel>
                      <Select
                        name="highest_qualification"
                        value={formData.highest_qualification}
                        onChange={handleChange}
                        label="Highest Qualification"
                        required
                      >
                        {dropdownOptions.qualificationOptions.map(option => (
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
                      required
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
                      required
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
                    <FormControl fullWidth required>
                      <InputLabel>Blood Group</InputLabel>
                      <Select
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        label="Blood Group"
                        required
                      >
                        {dropdownOptions.bloodGroupOptions.map(option => (
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
                    <FormControl fullWidth required>
                      <InputLabel>Thalassemia</InputLabel>
                      <Select
                        name="Thalassamia"
                        value={formData.Thalassamia}
                        onChange={handleChange}
                        label="Thalassemia"
                        required
                      >
                        {dropdownOptions.thalassemiaOptions.map(option => (
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