import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import TopSection from '../components/common/TopSection';
import NavigationBar from '../components/common/NavigationBar';
import Dashboard from './Dashboard';
import Configuration from './Configuration';
import Analytics from './Analytics';


const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab from path
  const tab = location.pathname.split('/')[1] || 'dashboard';

  const handleTabChange = (newTab: string) => {
    navigate(`/${newTab}${location.search}`);
  };

  return (
    // frame
    <div className="flex flex-col p-4 h-screen w-screen box-border gap-5">
        <TopSection />
        <NavigationBar activeTab={tab} setActiveTab={handleTabChange} />
        {/* main.body */}
        <div className="flex-1 flex flex-col px-5 py-5 gap-10">
        <Routes>
          <Route path="/" element={<Navigate to="/" replace />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
        </div>
    </div>
    );
};

export default MainPage;