
import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, values, onChange }) => {
  const toggleOption = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${values.includes(option) ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
            <input
              type="checkbox"
              className="w-5 h-5 accent-sage rounded border-gray-300 focus:ring-emerald-400"
              checked={values.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <span className="ml-3 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
