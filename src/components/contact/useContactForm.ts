import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  validateContactForm,
  type ContactPayload,
  type ValidationErrorReason,
} from '../../utils/antiSpam';

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const ERROR_MESSAGES: Record<ValidationErrorReason, string> = {
  SPAM_DETECTED: 'Envío rechazado por seguridad.',
  TOO_FAST: 'Por favor, tómate un momento antes de enviar el formulario.',
  INVALID_EMAIL: 'Por favor ingresa un correo electrónico válido.',
  MISSING_FIELDS: 'Por favor completa todos los campos requeridos.',
};

export interface UseContactFormOptions {
  onSubmit?: (data: ContactPayload) => Promise<void> | void;
}

export function useContactForm(options: UseContactFormOptions = {}) {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<FormSubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (status === 'submitting') {
      return;
    }

    const payload: ContactPayload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      honeypot: formData.honeypot,
      startTime: startTimeRef.current ?? Date.now(),
    };

    const validation = validateContactForm(payload, Date.now());

    if (!validation.isValid) {
      setStatus('error');
      setStatusMessage(
        validation.error ? ERROR_MESSAGES[validation.error] : 'Error al enviar.'
      );
      return;
    }

    try {
      setStatus('submitting');
      setStatusMessage('Enviando mensaje...');

      if (options.onSubmit) {
        await options.onSubmit(payload);
      } else {
        // Default simulated network transmission
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setStatus('success');
      setStatusMessage('¡Mensaje enviado con éxito! Te responderé pronto.');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      startTimeRef.current = Date.now();
    } catch {
      setStatus('error');
      setStatusMessage('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    }
  };

  return {
    formData,
    status,
    statusMessage,
    isSubmitting: status === 'submitting',
    handleChange,
    handleSubmit,
  };
}
