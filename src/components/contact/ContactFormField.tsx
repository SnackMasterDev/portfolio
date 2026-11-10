import React, { type InputHTMLAttributes } from 'react';

interface ContactFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const ContactFormField: React.FC<ContactFormFieldProps> = ({
  id,
  label,
  className = '',
  ...props
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-[#1c1c1e] mb-1.5">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl bg-white border border-[#d6cebf] text-[#1c1c1e] placeholder-[#78716c] focus:outline-none focus:border-[#1c1c1e] focus:ring-1 focus:ring-[#1c1c1e] text-sm shadow-xs transition-colors ${className}`}
    />
  </div>
);
