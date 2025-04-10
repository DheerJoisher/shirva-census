import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  FaStore, 
  FaUserGraduate, 
  FaUserTie, 
  FaGraduationCap
} from 'react-icons/fa';

// Import the analytics components
import BusinessAnalytics from './analytics/BusinessAnalytics';
import StudentAnalytics from './analytics/StudentAnalytics';
import EducationAnalytics from './analytics/EducationAnalytics';
import OccupationAnalytics from './analytics/OccupationAnalytics';

const SideBar = ({ selectedOption, setSelectedOption }) => {
  const options = [
    { id: 'business', label: 'Business Analytics', icon: <FaStore /> },
    { id: 'student', label: 'Student Analytics', icon: <FaUserGraduate /> },
    { id: 'education', label: 'Education Analytics', icon: <FaGraduationCap /> },
    { id: 'occupation', label: 'Occupation Analytics', icon: <FaUserTie /> },
  ];

  return (
    <Box 
      sx={{ 
        width: 250, 
        backgroundColor: 'white', 
        borderRight: '1px solid #e0e0e0',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <List>
        {options.map((option) => (
          <ListItem
            button
            key={option.id}
            selected={selectedOption === option.id}
            onClick={() => setSelectedOption(option.id)}
            sx={{
              mb: 0.5,
              py: 1.5,
              borderRadius: '0 24px 24px 0',
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                },
              },
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: selectedOption === option.id ? '#1976d2' : 'inherit',
              minWidth: 40 
            }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
