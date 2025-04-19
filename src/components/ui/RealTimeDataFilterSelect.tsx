import React from 'react';
import GenericSelect from './GenericSelect';

interface RealTimeDataFilterSelectProps {
  hotels: {id: string; name: string; code: string;}[];
  floors: { id: string; hotel_id: number, floor_id: string }[];
  rooms: { id: string; name: string; room_number: string }[];
  devices: { id: string; room_id: number, sensor_type: string; device_identifier: string }[];
  filter: { hotel: string; floor: string; room: string; sensor_type: string; device: string};
  setFilter: React.Dispatch<React.SetStateAction<{ hotel: string; floor: string; room: string; sensor_type: string; device: string}>>;
}

const sensorTypeOptions = [
  { value: 'IAQ', label: 'IAQ Sensors' },
  { value: 'POW', label: 'Power Meter' },
  { value: 'OCC', label: 'Presence' }
];

const RealTimeDataFilterSelect: React.FC<RealTimeDataFilterSelectProps> = ({ hotels, floors, rooms, devices,filter, setFilter }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
    <GenericSelect
      options={hotels.map(h => ({ value: h.id, label: h.name }))}
      value={filter.hotel}
      onChange={val => setFilter(prev => ({ ...prev, hotel: val, floor: '', room: '', device: ''}))}
      className="afdd-select"
      placeholder="--hotel--"
    />
    <GenericSelect
      options={floors
        .filter(f => f.hotel_id === Number(filter.hotel))
        .map((f: { id: string; floor_id: string }) => ({ value: f.id, label: `Floor ${f.floor_id}` }))}
      value={filter.floor}
      onChange={val => setFilter(prev => ({ ...prev, floor: val, room: '', device: '' }))}
      className="afdd-select"
      disabled={!filter.hotel}
      placeholder="--floor--"
    />
    <GenericSelect
      options={rooms.map((r: { id: string; name: string; room_number: string }) => ({ value: r.id, label: `${r.room_number}: ${r.name}` }))}
      value={filter.room}
      onChange={val => setFilter(prev => ({ ...prev, room: val, device: '' }))}
      className="afdd-select"
      disabled={!filter.floor}
      placeholder="--room--"
    />
    <GenericSelect
      options={sensorTypeOptions}
      value={filter.sensor_type}
      onChange={val => setFilter(prev => ({ ...prev, sensor_type: val, device: ''}))}
      className="afdd-select"
      disabled={!filter.room}
      placeholder="--sensor type--"
    />
    <GenericSelect
      options={devices
        .filter((d) => {
          if (filter.sensor_type) {
            const map: Record<string, string[]> = {
              IAQ: ['temperature', 'humidity', 'co2'],
              POW: ['power_meter'],
              OCC: ['online_status', 'sensitivity', 'occupancy_status'],
            };
            return map[filter.sensor_type]?.includes(d.sensor_type);
          }
          return d.room_id == Number(filter.room);
        })
        .map((d: { id: string; sensor_type: string; device_identifier: string }) => ({ value: d.id, label: d.device_identifier }))}
      value={filter.device}
      onChange={val => setFilter(prev => ({ ...prev, device: val}))}
      className="afdd-select"
      disabled={!filter.room}
      placeholder="--device--"
    />
  </div>
);

export default RealTimeDataFilterSelect;