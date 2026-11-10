import React from 'react';
import { useContactForm, type UseContactFormOptions } from './useContactForm';
import { ContactFormField } from './ContactFormField';
import { ContactSubmitButton } from './ContactSubmitButton';
import { useLanguage } from '../../context/useLanguage';
import { getTranslations } from '../../data/translations';

export interface ContactSectionProps extends UseContactFormOptions {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onSubmit,
  className = '',
}) => {
  const { language } = useLanguage();
  const t = getTranslations(language).contact;
  const { formData, status, statusMessage, isSubmitting, handleChange, handleSubmit } =
    useContactForm({ onSubmit });

  return (
    <section
      id="contact"
      data-testid="contact-section"
      aria-labelledby="contact-heading"
      className={`relative z-10 max-w-xl mx-auto px-6 py-16 text-[#1c1c1e] ${className}`}
    >
      <div className="text-center mb-8">
        <h2 id="contact-heading" className="font-rancho text-4xl md:text-5xl font-bold tracking-tight text-[#1c1c1e]">
          {t.title}
        </h2>
        <p className="text-sm text-[#57534e] mt-2">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Formulario de contacto">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <ContactFormField
          id="contact-name"
          name="name"
          label={t.nameLabel}
          required
          value={formData.name}
          onChange={handleChange}
          placeholder={t.namePlaceholder}
        />

        <ContactFormField
          id="contact-email"
          name="email"
          label={t.emailLabel}
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder={t.emailPlaceholder}
        />

        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold text-[#1c1c1e] mb-1.5">
            {t.messageLabel}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder={t.messagePlaceholder}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d6cebf] text-[#1c1c1e] placeholder-[#78716c] focus:outline-none focus:border-[#1c1c1e] focus:ring-1 focus:ring-[#1c1c1e] text-sm shadow-xs transition-colors resize-none"
          />
        </div>

        <ContactSubmitButton
          isSubmitting={isSubmitting}
          status={status}
          statusMessage={statusMessage}
        />
      </form>
    </section>
  );
};

export default ContactSection;
