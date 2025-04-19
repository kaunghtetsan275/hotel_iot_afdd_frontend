import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RealtimeDataMonitoring from './RealTimeDataMonitoring';
import FaultAlertManagement from './FaultAlertManagement';

const Dashboard: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={
        <div className="flex-1 flex flex-col lg:flex-row-reverse gap-2">
          <div className="flex-[1]">
            <RealtimeDataMonitoring />
          </div>
          <div className="flex-[2]">
            <FaultAlertManagement />
          </div>
        </div>
      }
    />
  </Routes>
);

export default Dashboard;