import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// User pages
import UserDashboard from './pages/user/dashboard';
import AddMember from './pages/user/addmember';
import FamilySettings from './pages/user/familydetails';
import AccountSettings from './pages/user/accountsettings';

// Admin pages
import AdminDashboard from './pages/admin/dashboard';
import Approvals from './pages/admin/approvals';
import TotalFamilies from './pages/admin/totalfam';
import Residents from './pages/admin/residents';
import Analytics from './pages/admin/analytics';
import Households from './pages/admin/households';

// General pages
import Landing from './pages/landing';
import SignIn from './pages/signin';
import Register from './pages/register';

import AdminRouteGuard from './components/adminRouteGuard';


function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/add-member" element={<AddMember />} />
        <Route path="/user/family-settings" element={<FamilySettings />} />
        <Route path="/user/settings" element={<AccountSettings />} />
        
        {/* Admin Routes */}
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <AdminRouteGuard>
              <Approvals />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/total-families"
          element={
            <AdminRouteGuard>
              <TotalFamilies />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/residents"
          element={
            <AdminRouteGuard>
              <Residents />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRouteGuard>
              <Analytics />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/households"
          element={
            <AdminRouteGuard>
              <Households />
            </AdminRouteGuard>
          }
        />

        
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
