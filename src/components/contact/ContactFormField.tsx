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
    <label htmlFor={id} className="block text-xs font-medium text-[#aaa7a3] mb-1">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg bg-[#262628] border border-[#3c3b3d] text-[#f2f0ed] placeholder-[#71717a] focus:outline-none focus:border-[#f3a4c2] text-sm transition-colors ${className}`}
    />
  </div>
);
