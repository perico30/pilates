
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text", required = false, className = "", placeholder = "" }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 ml-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
      />
    </div>
  );
};

export default InputField;
