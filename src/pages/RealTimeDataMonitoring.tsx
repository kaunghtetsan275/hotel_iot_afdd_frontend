// RealtimeDataMonitoring.tsx
import React, { useEffect, useState} from 'react';
import { supabase, SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import RealTimeDataFilterSelect from '../components/ui/RealTimeDataFilterSelect';
// import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// import ErrorBoundary from './ErrorBoundary';
import axios from 'axios';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const defaultFilter = { hotel: '', floor: '', room: '', sensor_type: '', device: '' };

const RealtimeDataMonitoring: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filter = {
    hotel: searchParams.get('hotel') || '',
    floor: searchParams.get('floor') || '',
    room: searchParams.get('room') || '',
    sensor_type: searchParams.get('sensor_type') || '',
    device: searchParams.get('device') || '',
  };

  const setFilter = (newFilter: typeof defaultFilter) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('hotel', newFilter.hotel || '');
    newParams.set('floor', newFilter.floor || '');
    newParams.set('room', newFilter.room || '');
    newParams.set('sensor_type', newFilter.sensor_type || '');
    newParams.set('device', newFilter.device || '');
    setSearchParams(newParams, { replace: false });
  };

  const [hotels, setHotels] = useState<{ id: string; name: string; code: string }[]>([]);
  const [floors, setFloors] = useState<{ id: string; hotel_id: number, floor_id: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string; room_number: string }[]>([]);
  const [devices, setDevices] = useState<{ id: string; room_id: number, sensor_type: string, device_identifier: string }[]>([]);

  type LiveRow = {
    device_identifier: string;
    value: string;
    datetime: string;
  };
  const [liveRows, setLiveRows] = useState<Record<string, LiveRow>>({});

  const filteredDevices = !filter.sensor_type
    ? devices // show all if no sensor_type
    : devices.filter((d) => {
      const map: Record<string, string[]> = {
        IAQ: ['temperature', 'humidity', 'co2'],
        POW: ['power_meter'],
        OCC: ['online_status', 'sensitivity', 'occupancy_status'],
      };
      return map[filter.sensor_type]?.includes(d.sensor_type);
    });
  const deviceIds = filteredDevices.map((d) => d.id);

  useEffect(() => {
    if (deviceIds.length === 0) {
      return;
    }

    const channel = supabase
      .channel('sensor_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensor_data_latest',
          filter: `did=in.(${deviceIds.join(',')})`,
        },
        (payload) => {
          const newData = payload.new as { device_id: string, datapoint: string, value: string; datetime: string };
          setLiveRows(prev => ({
            ...prev,
            [newData.device_id]: {
              device_identifier: newData.device_id,
              value: newData.value,
              datetime: newData.datetime,
            },
          }));

          // setData((prev) => [
          //   ...prev,
          //   {
          //     datetime: newData.datetime,
          //     temperature_value: newData.datapoint === 'temperature' ? newData.value : null,
          //     humidity_value: newData.datapoint === 'humidity' ? newData.value : null,
          //     co2_value: newData.datapoint === 'co2' ? newData.value : null,
          //     power_meter_value: newData.datapoint === 'power_meter' ? newData.value : null,
          //     online_status_value: newData.datapoint === 'online_status' ? newData.value : null,
          //     sensitivity_value: newData.datapoint === 'sensitivity' ? newData.value : null,
          //     occupancy_status_value: newData.datapoint === 'occupancy_status' ? newData.value : null,
          //     device_id: newData.device_id,
          //   } as RealtimeData,
          // ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [devices]);

  useEffect(() => {
    axios.get(`${SUPABASE_URL}/rest/v1/hotels`, { headers: SUPABASE_HEADERS })
      .then(res => setHotels(res.data.map((hotel: { id: string; name: string; code: string }) => ({
        id: hotel.id,
        name: hotel.name,
        code: hotel.code,
      }))));
  }, []);

  useEffect(() => {
    if (filter.hotel) {
      axios.get(`${SUPABASE_URL}/rest/v1/floors?hotel_id=eq.${filter.hotel}`, { headers: SUPABASE_HEADERS })
        .then(res => setFloors(res.data.map((floor: { id: string; floor_id: string; hotel_id: number }) => ({
          id: floor.id,
          floor_id: floor.floor_id,
          hotel_id: floor.hotel_id,
        }))));
    }
  }, [filter.hotel]);

  useEffect(() => {
    if (filter.floor) {
      axios.get(`${SUPABASE_URL}/rest/v1/rooms?floor_id=eq.${filter.floor}`, { headers: SUPABASE_HEADERS })
        .then(res => setRooms(res.data));
    }
  }, [filter.floor]);

  useEffect(() => {
    if (filter.room) {
      axios
        .get(`${SUPABASE_URL}/rest/v1/devices?room_id=eq.${filter.room}`, { headers: SUPABASE_HEADERS })
        .then((res) => setDevices(res.data.map((device: { id: string; sensor_type: string; device_identifier: string; room_id: number }) => ({
          id: device.id,
          sensor_type: device.sensor_type,
          device_identifier: device.device_identifier,
          room_id: device.room_id,
        }))));
    } else {
      setDevices([]);
    }
  }, [filter.room]);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#4c37e73b] gap-3">
      <h2 className="text-xl text-center mb-4 bg-indigo-500 font-sans"><b>Realtime Data Monitoring</b></h2>
      <p>Filter by: </p>
      <div className="flex-1">
      <RealTimeDataFilterSelect
          hotels={hotels}
          floors={floors}
          rooms={rooms}
          devices={devices}
          filter={filter}
          setFilter={(value) => setFilter(typeof value === 'function' ? value(filter) : value)}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border text-sm">
            {(() => {
            let devicesToDisplay;
            if (filter.device) {
              devicesToDisplay = devices.filter((d) => String(d.id) === filter.device);
            } else {
              devicesToDisplay = filteredDevices;
            }

            if (devicesToDisplay.length === 0) {
              return (
              <thead>
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-center">
                No live data available. Select the room first to monitor live data.
                </td>
              </tr>
              </thead>
              );
            }

            return (
              <>
              <thead className="bg-indigo-500">
                <tr>
                <th className="border px-4 py-2">Device</th>
                <th className="border px-4 py-2">Value</th>
                <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {devicesToDisplay.map((device) => {
                const row = liveRows[device.device_identifier];
                return (
                  <tr key={device.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-1">{device.device_identifier}</td>
                  <td className="border px-4 py-1">{row?.value ?? '-'}</td>
                  <td className="border px-4 py-1">
                    {row?.datetime ? new Date(row.datetime).toLocaleString() : '-'}
                  </td>
                  </tr>
                );
                })}
              </tbody>
              </>
            );
            })()}
        </table>
      </div>
    </div>
  );
};

export default RealtimeDataMonitoring;
