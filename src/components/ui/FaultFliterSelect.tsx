import React from 'react';
import GenericSelect from './GenericSelect';

interface Hotel {
  id: string;
  name: string;
  code: string;
}

interface FaultFilterSelectProps {
  hotels: Hotel[];
  filter: { fhotel: string; status: string };
  setFilter: (filter: { fhotel: string; status: string }) => void;
}

const statusOptions = [
  { value: 'open', label: 'open' },
  { value: 'acknowledged', label: 'acknowledged' },
  { value: 'dismissed', label: 'dismissed' },
];

const FaultFilterSelect: React.FC<FaultFilterSelectProps> = ({ hotels, filter, setFilter }) => (
  <div className="flex-1 justify-self-center text-center">
    <GenericSelect
      options={hotels.map((h: Hotel) => ({ value: h.code, label: h.name }))}
      value={filter.fhotel}
      onChange={(val: string) => setFilter({ ...filter, fhotel: val, status: '' })}
      className="afdd-select"
      placeholder="--hotel--"
    />
    <GenericSelect
      options={statusOptions}
      value={filter.status}
      onChange={(val: string) => setFilter({ ...filter, status: val })}
      className="afdd-select"
      disabled={!filter.fhotel}
      placeholder="--status--"
    />
  </div>
);

export default FaultFilterSelect;