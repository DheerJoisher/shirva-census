import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, FormControl,
  FormHelperText, Typography, Divider, CircularProgress,
  Alert, Box, Checkbox, FormControlLabel, Select, InputLabel,
  Radio, RadioGroup, FormLabel, FormGroup
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { supabase } from '../../supabaseClient';
import dayjs from 'dayjs';

const EditMemberModal = ({ show, handleClose, member, onUpdate }) => {
  const [formData, setFormData] = useState({
    // RESIDENTS table
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
    household_id: '',
    
    // EDUCATION table
    highest_qualification: '',
    school_or_college_name: '',
    year_of_completion: '',
    
    // OCCUPATION table
    occupation: '',
    profession: '',
    work_location: '',
    
    // HEALTH_RECORDS table
    blood_group: '',
    mediclaim: false,
    Thalassamia: '',
    G6PD: false,
    
    // WHATSAPP_GROUPS table
    Shirva_Setu: false,
    Dukhad_Nidhan: false,
    SGNX: false,
    SGNX_Parent: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (member) {
      const dob = member.date_of_birth ? dayjs(member.date_of_birth) : null;
      
      setFormData({
        // RESIDENTS table
        first_name: member.first_name || '',
        middle_name: member.middle_name || '',
        last_name: member.last_name || '',
        gender: member.gender || '',
        relation: member.relation || '',
        marital_status: member.marital_status || '',
        date_of_birth: dob,
        phone_number: member.phone_number || '',
        email: member.email || '',
        lifemember: member.lifemember || false,
        household_id: member.household_id || '',
        
        // EDUCATION table
        highest_qualification: member.education?.highest_qualification || '',
        school_or_college_name: member.education?.school_or_college_name || '',
        year_of_completion: member.education?.year_of_completion || '',
        
        // OCCUPATION table
        occupation: member.occupation?.occupation || '',
        profession: member.occupation?.profession || '',
        work_location: member.occupation?.work_location || '',
        
        // HEALTH_RECORDS table
        blood_group: member.health_records?.blood_group || '',
        mediclaim: member.health_records?.mediclaim === 'yes' || false,
        Thalassamia: member.health_records?.Thalassamia || '',
        G6PD: member.health_records?.G6PD === 'yes' || false,
        
        // WHATSAPP_GROUPS table
        Shirva_Setu: member.whatsapp_groups?.Shirva_Setu || false,
        Dukhad_Nidhan: member.whatsapp_groups?.Dukhad_Nidhan || false,
        SGNX: member.whatsapp_groups?.SGNX || false,
        SGNX_Parent: member.whatsapp_groups?.SGNX_Parent || false
      });
    }
  }, [member]);
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : 
              name === 'lifemember' || name === 'mediclaim' ? value === 'yes' : 
              value 
    }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date_of_birth: date
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formattedDate = formData.date_of_birth
        ? dayjs(formData.date_of_birth).format('YYYY-MM-DD')
        : null;
        
      // Organize data according to tables
      const residentData = {
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
        household_id: formData.household_id
      };
      
      const educationData = {
        highest_qualification: formData.highest_qualification,
        school_or_college_name: formData.school_or_college_name,
        year_of_completion: formData.year_of_completion
      };
      
      const occupationData = {
        occupation: formData.occupation,
        profession: formData.profession,
        work_location: formData.work_location
      };
      
      const healthData = {
        blood_group: formData.blood_group,
        mediclaim: formData.mediclaim ? 'yes' : 'no',
        Thalassamia: formData.Thalassamia,
        G6PD: formData.G6PD ? 'yes' : 'no'
      };
      
      const whatsappData = {
        Shirva_Setu: formData.Shirva_Setu,
        Dukhad_Nidhan: formData.Dukhad_Nidhan,
        SGNX: formData.SGNX,
        SGNX_Parent: formData.SGNX_Parent
      };
      
      // Update resident record
      const { data: residentUpdateData, error: residentError } = await supabase
        .from('RESIDENTS')
        .update(residentData)
        .eq('resident_id', member.resident_id);
        
      if (residentError) throw residentError;
      
      // Update education record
      const { error: educationError } = await supabase
        .from('EDUCATION')
        .upsert({ 
          resident_id: member.resident_id,
          ...educationData
        });
        
      if (educationError) throw educationError;
      
      // Update occupation record
      const { error: occupationError } = await supabase
        .from('OCCUPATION')
        .upsert({ 
          resident_id: member.resident_id,
          ...occupationData
        });
        
      if (occupationError) throw occupationError;
      
      // Update health record
      const { error: healthError } = await supabase
        .from('HEALTH_RECORDS')
        .upsert({ 
          resident_id: member.resident_id,
          ...healthData
        });
        
      if (healthError) throw healthError;
      
      // Update whatsapp groups record
      const { error: whatsappError } = await supabase
        .from('WHATSAPP_GROUPS')
        .upsert({ 
          resident_id: member.resident_id,
          ...whatsappData
        });
        
      if (whatsappError) throw whatsappError;
      
      setSuccess(true);
      setLoading(false);
      
      if (onUpdate) onUpdate({
        ...residentData,
        resident_id: member.resident_id,
        education: educationData,
        occupation: occupationData,
        health_records: healthData,
        whatsapp_groups: whatsappData
      });
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to update member');
      setLoading(false);
    }
  };
  
  // Options for select inputs
  const genderOptions = ['Male', 'Female', 'Other'];
  const relationOptions = [
    'Self',
    'Husband',
    'Wife',
    'Son',
    'Daughter-in-law',
    'Grand Son',
    'Grand Daughter',
    'Daughter',
    'Brother',
    'Sister'
  ];
  const maritalOptions = ['Single', 'Married'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const thalassemiaOptions = ['Major', 'Minor', 'Negative', 'Not Checked'];
  const qualificationOptions = ['Primary', 'Secondary', 'Higher Secondary', 'Diploma', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'];
  
  const occupationOptions = [
    'Student',
    'Employed',
    'Self-employed',
    'Business Owner',
    'Homemaker',
    'Retired',
    'Unemployed',
    'Other'
  ];
  
  const professionOptions = [
    'Doctor',
    'Engineer',
    'Teacher/Professor',
    'Lawyer',
    'Accountant',
    'IT Professional',
    'Government Employee',
    'Banking Professional',
    'Business',
    'Agriculture',
    'Skilled Trade',
    'Nurse/Healthcare Worker',
    'Artist/Creative Professional',
    'Not Applicable',
    'Other'
  ];
  
  return (
    <Dialog 
      open={show} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: '8px',
          overflowY: 'auto'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: '#1976d2', 
          color: 'white',
          fontWeight: 'bold',
          pb: 1.5,
          pt: 1.5
        }}
      >
        Edit Member Details
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2, mt: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Member updated successfully!</Alert>}
        
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
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Household ID"
                  name="household_id"
                  value={formData.household_id}
                  variant="outlined"
                  disabled
                  sx={{ bgcolor: '#f5f5f5' }}
                />
                <FormHelperText>Household ID cannot be changed</FormHelperText>
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
                <FormControl fullWidth>
                  <InputLabel>Occupation</InputLabel>
                  <Select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    label="Occupation"
                  >
                    {occupationOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Profession</InputLabel>
                  <Select
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    label="Profession"
                  >
                    {professionOptions.map(option => (
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
        </form>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMemberModal;
