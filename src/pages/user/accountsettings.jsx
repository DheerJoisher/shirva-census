import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar';
import Footer from '../../components/user/footer';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual API endpoint
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change for user data form
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle input change for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle user data update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Replace with your actual API endpoint
      await axios.put('/api/user/profile', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Profile updated successfully!');
      setLoading(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      toast.error('Update failed. Please try again.');
      console.error(err);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Replace with your actual API endpoint
      await axios.put('/api/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
      toast.success('Password changed successfully!');
    } catch (err) {
      setError('Failed to change password. Please ensure your current password is correct.');
      setLoading(false);
      toast.error('Password change failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Container className="max-w-3xl mx-auto my-8 px-4">
          <h2 className="text-center text-2xl font-bold mb-6">Account Settings</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
          
          <Tabs defaultActiveKey="profile" className="mb-4">
            <Tab eventKey="profile" title="Personal Information">
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleUserDataChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleUserDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={userData.address}
                      onChange={handleUserDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </Form>
              </div>
            </Tab>
            
            <Tab eventKey="password" title="Change Password">
              <div className="bg-white shadow-md rounded-lg p-6">
                <Form onSubmit={handleUpdatePassword}>
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700 font-semibold mb-2">Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </Button>
                </Form>
              </div>
            </Tab>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
