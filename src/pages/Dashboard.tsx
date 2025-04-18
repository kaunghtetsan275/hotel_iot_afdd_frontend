import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RealtimeDataMonitoring from './RealTimeDataMonitoring';
import FaultAlertManagement from './FaultAlertManagement';

const Dashboard: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={
        <div className="flex-1 flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <RealtimeDataMonitoring />
          </div>
          <div className="flex-1">
            <FaultAlertManagement />
          </div>
        </div>
      }
    />
    {/* Example: add more dashboard subroutes if needed */}
    {/* <Route path="monitoring" element={<RealtimeDataMonitoring />} /> */}
    {/* <Route path="alerts" element={<FaultAlertManagement />} /> */}
    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
  </Routes>
);

export default Dashboard;