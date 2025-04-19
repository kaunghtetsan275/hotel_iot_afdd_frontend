import React from 'react';

interface NavigationBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['dashboard', 'configuration', 'analytics'];

  return (
    <div className="flex flex-col md:flex-row justify-center">
      {tabs.map(tab => (
        <button
          key={tab}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: activeTab === tab ? '#6683a3' : '',
            border: '1px solid #aaa'
          }}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default NavigationBar;
