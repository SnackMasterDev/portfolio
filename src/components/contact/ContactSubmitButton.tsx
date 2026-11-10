import React from 'react';
import type { FormSubmissionStatus } from './useContactForm';
import { useLanguage } from '../../context/useLanguage';
import { getTranslations } from '../../data/translations';

export interface ContactSubmitButtonProps {
  isSubmitting: boolean;
  status: FormSubmissionStatus;
  statusMessage?: string;
  className?: string;
}

export const ContactSubmitButton: React.FC<ContactSubmitButtonProps> = ({
  isSubmitting,
  status,
  statusMessage,
  className = '',
}) => {
  const { language } = useLanguage();
  const t = getTranslations(language).contact;

  const getButtonStyles = () => {
    if (status === 'success') {
      return 'bg-[#14532d] hover:bg-[#166534] text-[#f0fdf4] border border-[#15803d]/40 shadow-[0_4px_16px_rgba(20,83,45,0.25)]';
    }
    if (status === 'error') {
      return 'bg-[#7f1d1d] hover:bg-[#991b1b] text-[#fef2f2] border border-[#b91c1c]/40 shadow-[0_4px_16px_rgba(127,29,29,0.25)]';
    }
    if (isSubmitting) {
      return 'bg-[#2c2c2e] text-[#d6cebf] opacity-80 cursor-wait border border-[#2c2c2e]';
    }
    return 'bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f4eee5] border border-[#1c1c1e] shadow-[0_4px_16px_rgba(28,28,30,0.12)] hover:shadow-[0_6px_20px_rgba(28,28,30,0.2)] active:scale-[0.99] cursor-pointer';
  };

  const getButtonText = () => {
    if (isSubmitting) return t.submitSubmitting;
    if (status === 'success') return t.submitSuccess;
    if (status === 'error') {
      return statusMessage || t.submitErrorGeneric;
    }
    return t.submitIdle;
  };

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c1c1e] disabled:cursor-not-allowed select-none ${getButtonStyles()} ${className}`}
      aria-live="polite"
    >
      {getButtonText()}
    </button>
  );
};

export default ContactSubmitButton;
