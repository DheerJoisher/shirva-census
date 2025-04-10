import React, { useState } from 'react';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import SideBar from '../../components/admin/SideBar';
import BusinessAnalytics from '../../components/admin/analytics/BusinessAnalytics';
import StudentAnalytics from '../../components/admin/analytics/StudentAnalytics';
import EducationAnalytics from '../../components/admin/analytics/EducationAnalytics';
import OccupationAnalytics from '../../components/admin/analytics/OccupationAnalytics';

const Analytics = () => {
  const [selectedOption, setSelectedOption] = useState('business');

  const renderComponent = () => {
    switch (selectedOption) {
      case 'business':
        return <BusinessAnalytics />;
      case 'student':
        return <StudentAnalytics />;
      case 'education':
        return <EducationAnalytics />;
      case 'occupation':
        return <OccupationAnalytics />;
      default:
        return <BusinessAnalytics />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideBar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
          {renderComponent()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Analytics;
