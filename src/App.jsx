import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// User pages
import UserDashboard from './pages/user/dashboard';
import AddMember from './pages/user/addmember';

// Admin pages
import AdminDashboard from './pages/admin/dashboard';
import Approvals from './pages/admin/approvals';
import TotalFamilies from './pages/admin/totalfam';
import Residents from './pages/admin/residents';
import Analytics from './pages/admin/analytics';

// General pages
import Landing from './pages/landing';
import SignIn from './pages/signin';
import Register from './pages/register';


function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/add-member" element={<AddMember />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/total-families" element={<TotalFamilies />} />
        <Route path="/admin/residents" element={<Residents />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        
        {/* General Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
