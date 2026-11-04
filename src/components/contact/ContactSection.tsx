import React from 'react';
import { useContactForm, type UseContactFormOptions } from './useContactForm';
import { ContactFormField } from './ContactFormField';
import { ContactFeedback } from './ContactFeedback';

export interface ContactSectionProps extends UseContactFormOptions {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onSubmit,
  className = '',
}) => {
  const { formData, status, statusMessage, isSubmitting, handleChange, handleSubmit } =
    useContactForm({ onSubmit });

  return (
    <section
      id="contact"
      data-testid="contact-section"
      aria-labelledby="contact-heading"
      className={`relative z-10 max-w-xl mx-auto px-6 py-16 text-[#f2f0ed] ${className}`}
    >
      <div className="text-center mb-8">
        <h2 id="contact-heading" className="text-3xl font-bold tracking-tight">Hablemos</h2>
        <p className="text-sm text-[#aaa7a3] mt-2">
          ¿Tienes un proyecto en mente o quieres conectar? Envíame un mensaje.
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
          label="Nombre"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
        />

        <ContactFormField
          id="contact-email"
          name="email"
          label="Correo Electrónico"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
        />

        <div>
          <label htmlFor="contact-message" className="block text-xs font-medium text-[#aaa7a3] mb-1">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="¿En qué te puedo ayudar?"
            className="w-full px-4 py-2.5 rounded-lg bg-[#262628] border border-[#3c3b3d] text-[#f2f0ed] placeholder-[#71717a] focus:outline-none focus:border-[#f3a4c2] text-sm transition-colors resize-none"
          />
        </div>

        <ContactFeedback status={status} message={statusMessage} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-lg bg-[#f3a4c2] hover:bg-[#e089aa] disabled:opacity-50 text-[#1c1b1d] font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </section>
  );
};

export default ContactSection;
