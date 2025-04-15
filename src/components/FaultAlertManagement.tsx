// ✅ FaultAlertManagement.tsx
import React, { useEffect, useState } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_HEADERS } from './supabaseClient';
import axios from 'axios';

const FaultAlertManagement: React.FC = () => {
  const [filter, setFilter] = useState({ hotel: '', floor: '', room: '', sensor_type: '', device: '', status: '' });

  const [hotels, setHotels] = useState<{ id: string; name: string, code: string }[]>([]);
  // const [devices, setDevices] = useState<{ id: string; sensor_type: string, device_identifier: string}[]>([]);

  type LiveRow = {
    id: number;
    device_identifier: string;
    fault_type: string;
    status: string;
    message: string;
    detected_at: Date;
    did: number;
  };
  const [liveRows, setLiveRows] = useState<Record<string, LiveRow>>({});
  const handleAcknowledge = async (id: number) => {
    console.log('id ', id, " dismissed");
      await supabase.from('fault_status').update({ status: 'acknowledged' }).eq('did', id);
    };
  
    const handleDismiss = async (id: number) => {
      console.log('id ', id, " dismissed");
      await supabase.from('fault_status').update({ status: 'dismissed' }).eq('did', id);
    };
  
  useEffect(() => {
    const fetchInitialFaults = async () => {
      const { data, error } = await supabase
        .from('fault_status')
        .select('*')
        .order('detected_at', { ascending: false }); // Optional: sort by latest
  
      if (error) {
        console.error('Error fetching initial faults:', error);
        return;
      }
  
      const initialLiveRows: Record<string, LiveRow> = {};
      data?.forEach((row) => {
        initialLiveRows[row.id] = {
          id: row.id,
          device_identifier: row.device_id,
          fault_type: row.fault_type,
          status: row.status,
          message: row.message || '',
          detected_at: row.detected_at || '',
          did: row.did,
        };
      });
  
      setLiveRows(initialLiveRows);
    };
  
    fetchInitialFaults();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('fault_status_update')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fault_status',
        },
        (payload) => {
          const newData = payload.new as { id: number, device_id: string, datetime: string, fault_type: string, status: string, message: string, detected_at: Date, did: number};

          setLiveRows(prev => ({
            ...prev,
            [newData.id]: {
              id: newData.id,
              device_identifier: newData.device_id,
              fault_type: newData.fault_type,
              status: newData.status,
              message: newData.message || "", 
              detected_at: newData.detected_at || "", 
              did: newData.did,
            },
          }));
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter.hotel]);

  useEffect(() => {
    axios.get(`${SUPABASE_URL}/rest/v1/hotels`, { headers: SUPABASE_HEADERS })
        .then(res => setHotels(res.data));
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#4c37e73b] rounded-2xl gap-5">
      <h2 className="text-xl text-center mb-4 bg-indigo-500 font-sans"><b>Fault Alert Management</b></h2>
      <p>Filter by: </p>
      <div className="flex-1 flex flex-col justify-self-center text-center">
          <div className="flex-1 justify-self-center text-center">
            <select
            value={filter.hotel}
            onChange={(e) => setFilter(prev => ({ ...prev, hotel: e.target.value, floor: '', room: '', device: '' }))}
            className = {`afdd-select`}
            >
              <option value="">--hotel--</option>
              {hotels.map((h) => (
              <option key={h.id} value={h.code}>{h.name}</option>
                ))}
            </select>
            <select 
            className='afdd-select'
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            disabled={!filter.hotel}>
              <option value="">--status--</option>
              <option value="open">open</option>
              <option value="acknowledged">acknowledged</option>
              <option value="dismissed">dismissed</option>  
            </select>

          </div>
      </div>
      
      <div className="flex flex-col max-h-[495px] rounded-2xl gap-2
      overflow-y-scroll">
        {Object.keys(liveRows).length === 0 ? (
          <p className="text-center">No live data available.</p>
        ) : (
          Object.keys(liveRows)
          .filter((key) => {
            const row = liveRows[key];
            const matchesHotel = !filter.hotel || row.device_identifier.startsWith(filter.hotel); // ← change logic if needed
            const matchesStatus = !filter.status || row.status === filter.status;
            return matchesHotel && matchesStatus;
          })
          .reverse()
          .map((key) => (
            <div key={key} className="flex flex-col text-center border rounded bg-indigo-400">
              <p>Fault ID: {String(liveRows[key].id)} :: status is {liveRows[key].status} </p>
              <p>Fault Type: {liveRows[key].fault_type}</p>
              <p>Message: {liveRows[key].message}</p>
              <p>Detected At: {new Date(liveRows[key].detected_at).toLocaleString()}</p>
              <div className='flex flex-col gap-1 justify-self-center'>
                <button onClick={() => handleAcknowledge(liveRows[key].did)}>Acknowledge</button>
                <button onClick={() => handleDismiss(liveRows[key].did)}>Dismiss</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FaultAlertManagement;
