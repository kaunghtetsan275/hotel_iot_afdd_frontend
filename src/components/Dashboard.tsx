import React from 'react';
import RealtimeDataMonitoring from './RealTimeDataMonitoring';
import FaultAlertManagement from './FaultAlertManagement';

const Dashboard: React.FC = () => (
  <div className="flex-1 flex flex-col md:flex-row gap-2">
    <div className="flex-1">
      <RealtimeDataMonitoring />
    </div>
    <div className="flex-1">
      <FaultAlertManagement />
    </div>
  </div>
);

export default Dashboard;
