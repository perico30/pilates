
import React from 'react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition-all text-sm ${value === option ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
            <input
              type="radio"
              className="hidden"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
