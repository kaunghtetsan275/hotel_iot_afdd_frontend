// ✅ RealtimeDataMonitoring.tsx
import React, { useEffect, useState} from 'react';
import { supabase, SUPABASE_URL, SUPABASE_HEADERS } from './supabaseClient';
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

const RealtimeDataMonitoring: React.FC = () => {
  const [filter, setFilter] = useState({ hotel: '', floor: '', room: '', sensor_type: '', device: '' });

  // const [data, setData] = useState<RealtimeData[]>([]);
  // interface RealtimeData {
  //   datetime: string;
  //   temperature_value: string;
  //   humidity_value: string;
  //   co2_value: string;
  //   power_meter_value: string;
  //   online_status_value: string | null;
  //   sensitivity_value: string | null;
  //   occupancy_status_value: string;
  //   device_id: string;
  // }

  const [hotels, setHotels] = useState<{ id: string; name: string }[]>([]);
  const [floors, setFloors] = useState<{ id: string; floor_id: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string; room_number: string }[]>([]);
  const [devices, setDevices] = useState<{ id: string; sensor_type: string, device_identifier: string }[]>([]);

  type LiveRow = {
    device_identifier: string;
    value: string;
    datetime: string;
  };
  const [liveRows, setLiveRows] = useState<Record<string, LiveRow>>({});

  // const [timeframe, setTimeframe] = useState('1'); // in minutes: '1', '5', '10'
  // const now = new Date();
  // const cutoff = new Date(now.getTime() - parseInt(timeframe) * 60 * 1000);
  // const filteredData = data.filter(d => new Date(d.datetime) >= cutoff);
  // const chartRef = useRef<any>(null); // Ref to manage the chart instance

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
      .then(res => setHotels(res.data));
  }, []);

  useEffect(() => {
    if (filter.hotel) {
      axios.get(`${SUPABASE_URL}/rest/v1/floors?hotel_id=eq.${filter.hotel}`, { headers: SUPABASE_HEADERS })
        .then(res => setFloors(res.data));
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
        .then((res) => setDevices(res.data));
    } else {
      setDevices([]);
    }
  }, [filter.room]);

  // useEffect(() => {
  //   // Cleanup the chart instance before the component unmounts or re-renders
  //   return () => {
  //     if (chartRef.current) {
  //       chartRef.current.destroy();
  //     }
  //   };
  // }, []);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#4c37e73b] gap-3">
      <h2 className="text-xl text-center mb-4 bg-indigo-500 font-sans"><b>Realtime Data Monitoring</b></h2>
      <p>Filter by: </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        <select
          value={filter.hotel}
          onChange={(e) => setFilter({ ...filter, hotel: e.target.value, floor: '', room: '', device: '' })}
          className={`afdd-select`}
        >
          <option value="">--hotel--</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <select
          value={filter.floor}
          onChange={(e) => setFilter({ ...filter, floor: e.target.value, room: '', device: '' })}
          className={`afdd-select`}
          disabled={!filter.hotel}
        >
          <option value="">--floor--</option>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.floor_id}
            </option>
          ))}
        </select>

        <select
          value={filter.room}
          onChange={(e) => setFilter({ ...filter, room: e.target.value, device: '' })}
          className={`afdd-select`}
          disabled={!filter.floor}
        >
          <option value="">--room--</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.room_number}
            </option>
          ))}
        </select>

        <select
          value={filter.sensor_type}
          onChange={(e) => setFilter({ ...filter, sensor_type: e.target.value, device: '' })}
          className={`afdd-select`}
          disabled={!filter.room}
        >
          <option value="">--sensor type--</option>
          <option value="IAQ">IAQ</option>
          <option value="POW">Power Meter</option>
          <option value="OCC">Presence</option>
        </select>

        <select
          value={filter.device}
          onChange={(e) => setFilter({ ...filter, device: e.target.value })}
          className={`afdd-select`}
          disabled={!filter.room}
        >
          <option value="">--device--</option>
          {filteredDevices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.device_identifier}
            </option>
          ))}
        </select>

        {/* <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border px-2 py-1 rounded mb-2"
        >
          <option value="1">Last 1 min</option>
          <option value="5">Last 5 min</option>
          <option value="10">Last 10 min</option>
        </select> */}

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


      {/* <div className="text-center text-xl mt-4 mb-2 bg-amber-300 font-sans">
        Realtime Chart
      </div> */}

      {/* Chart */}
      {/* <div style={{ height: '300px' }}>
        <ErrorBoundary>
          <Line
            className="bg-white shadow-md rounded-lg p-4 overflow-x-auto"
            ref={chartRef}
            data={{
              labels: data.map(d => d.datetime),
              datasets: [
                {
                  label: 'Temperature',
                  data: data.map(d => d.temperature_value),
                  borderColor: 'red',
                  fill: false,
                },
                {
                  label: 'Humditiy',
                  data: data.map(d => d.humidity_value),
                  borderColor: 'green',
                  fill: false,
                },
                {
                  label: 'CO2',
                  data: data.map(d => d.co2_value),
                  borderColor: 'blue',
                  fill: false,
                },
                {
                  label: 'Power Meter',
                  data: data.map(d => d.power_meter_value),
                  borderColor: 'yellow',
                  fill: false,
                },
                {
                  label: 'Online Status',
                  data: data.map(d => d.online_status_value),
                  borderColor: 'black',
                  fill: false,
                },
                {
                  label: 'Sensitivity',
                  data: data.map(d => d.sensitivity_value),
                  borderColor: 'cyan',
                  fill: false,
                },
                {
                  label: 'Occupancy Status',
                  data: data.map(d => d.occupancy_status_value),
                  borderColor: 'magenta',
                  fill: false,
                }
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Timestamp',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Sensor Value',
                  },
                },
              },
            }}
          />
        </ErrorBoundary>
      </div> */}
    </div>
  );
};

export default RealtimeDataMonitoring;
