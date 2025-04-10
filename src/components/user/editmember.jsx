import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, FormControl,
  FormHelperText, Typography, Divider, CircularProgress,
  Alert, Box, Checkbox, FormControlLabel, Select, InputLabel
} from '@mui/material';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

const EditMemberModal = ({ show, handleClose, member, onUpdate }) => {
  const [formData, setFormData] = useState({
    // RESIDENTS table
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    relation: '',
    marital_status: '',
    date_of_birth: '',
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
    mediclaim: '',
    Thalassamia: '',
    G6PD: '',
    
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
      setFormData({
        // RESIDENTS table
        first_name: member.first_name || '',
        middle_name: member.middle_name || '',
        last_name: member.last_name || '',
        gender: member.gender || '',
        relation: member.relation || '',
        marital_status: member.marital_status || '',
        date_of_birth: member.date_of_birth || '',
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
        mediclaim: member.health_records?.mediclaim || '',
        Thalassamia: member.health_records?.Thalassamia || '',
        G6PD: member.health_records?.G6PD || '',
        
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
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Organize data according to tables
      const residentData = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        gender: formData.gender,
        relation: formData.relation,
        marital_status: formData.marital_status,
        date_of_birth: formData.date_of_birth,
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
        mediclaim: formData.mediclaim,
        Thalassamia: formData.Thalassamia,
        G6PD: formData.G6PD
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
  
  const sectionStyle = {
    marginTop: '24px',
    marginBottom: '16px'
  };
  
  const sectionTitleStyle = {
    color: '#1976d2',
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: '8px'
  };
  
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
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>Personal Information</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter first name"
              />
            </Grid>
            
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter middle name"
              />
            </Grid>
            
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter last name"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                variant="outlined"
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                helperText="Format: YYYY-MM-DD"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                select
                label="Marital Status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Relation to Head"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g. Son, Daughter, Spouse"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.lifemember}
                    onChange={handleChange}
                    name="lifemember"
                    color="primary"
                  />
                }
                label="Life Member"
              />
            </Grid>
          </Grid>
          
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>Education</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Highest Qualification"
                name="highest_qualification"
                value={formData.highest_qualification}
                onChange={handleChange}
                variant="outlined"
                placeholder="E.g. B.Tech, MBA, Ph.D"
              />
            </Grid>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="School/College Name"
                name="school_or_college_name"
                value={formData.school_or_college_name}
                onChange={handleChange}
                variant="outlined"
                placeholder="Name of institution"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year of Completion"
                name="year_of_completion"
                type="number"
                value={formData.year_of_completion}
                onChange={handleChange}
                variant="outlined"
                placeholder="E.g. 2018"
                inputProps={{ min: 1950, max: new Date().getFullYear() }}
              />
            </Grid>
          </Grid>
          
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>Occupation</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                variant="outlined"
                placeholder="E.g. Engineer, Doctor"
              />
            </Grid>
            
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                variant="outlined"
                placeholder="E.g. Software Developer, Surgeon"
              />
            </Grid>
            
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Work Location"
                name="work_location"
                value={formData.work_location}
                onChange={handleChange}
                variant="outlined"
                placeholder="City or place of work"
              />
            </Grid>
          </Grid>
          
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>Health Information</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                select
                label="Blood Group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">Select Blood Group</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label="Mediclaim"
                name="mediclaim"
                value={formData.mediclaim}
                onChange={handleChange}
                variant="outlined"
                placeholder="Mediclaim details"
              />
            </Grid>
            
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label="Thalassamia"
                name="Thalassamia"
                value={formData.Thalassamia}
                onChange={handleChange}
                variant="outlined"
                placeholder="Thalassamia status"
              />
            </Grid>
            
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label="G6PD"
                name="G6PD"
                value={formData.G6PD}
                onChange={handleChange}
                variant="outlined"
                placeholder="G6PD status"
              />
            </Grid>
          </Grid>
          
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>WhatsApp Groups</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.Shirva_Setu}
                    onChange={handleChange}
                    name="Shirva_Setu"
                    color="primary"
                  />
                }
                label="Shirva Setu"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.Dukhad_Nidhan}
                    onChange={handleChange}
                    name="Dukhad_Nidhan"
                    color="primary"
                  />
                }
                label="Dukhad Nidhan"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.SGNX}
                    onChange={handleChange}
                    name="SGNX"
                    color="primary"
                  />
                }
                label="SGNX"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.SGNX_Parent}
                    onChange={handleChange}
                    name="SGNX_Parent"
                    color="primary"
                  />
                }
                label="SGNX Parent"
              />
            </Grid>
          </Grid>
          
          <Box sx={sectionStyle}>
            <Typography sx={sectionTitleStyle}>Contact Information</Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g. 9876543210"
              />
            </Grid>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                placeholder="example@email.com"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 0 }}>
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
