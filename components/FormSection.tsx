
import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-50 transition-all hover:shadow-md ${className}`}>
      <h3 className="text-xl font-semibold text-sage-dark mb-6 flex items-center">
        <span className="h-1 w-6 bg-emerald-300 rounded-full mr-3"></span>
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
