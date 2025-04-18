import React from 'react';

interface GenericSelectOption {
  value: string;
  label: string;
}

interface GenericSelectProps {
  options: GenericSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const GenericSelect: React.FC<GenericSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  disabled = false,
  placeholder = '--select--',
}) => (
  <select
    title = "Select an option"
    className={className}
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={disabled}
  >
    <option value="">{placeholder}</option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default GenericSelect;