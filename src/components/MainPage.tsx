import React, { useState } from 'react';
import TopSection from './TopSection';
import NavigationBar from './NavigationBar';
import Dashboard from './Dashboard';
import Configuration from './Configuration';
import Analytics from './Analytics';

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'configuration': return <Configuration />;
      case 'analytics': return <Analytics />;
      default: return null;
    }
  };

  return (
    // frame
    <div className="flex flex-col p-4 h-screen w-screen box-border gap-5">
        <TopSection />
        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* main.body */}
        <div className="flex-1 flex flex-col px-5 py-5 gap-10">
          {renderTab()}
        </div>
    </div>
    );
};

export default MainPage;