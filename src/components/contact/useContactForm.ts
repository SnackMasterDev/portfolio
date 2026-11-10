import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  validateContactForm,
  type ContactPayload,
  type ValidationErrorReason,
} from '../../utils/antiSpam';
import { useLanguage } from '../../context/useLanguage';

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const ERROR_MESSAGES_ES: Record<ValidationErrorReason, string> = {
  SPAM_DETECTED: 'Envío bloqueado por protección del santuario.',
  TOO_FAST: 'Un instante de calma antes de enviar el trazo.',
  INVALID_EMAIL: 'La dirección no parece auténtica.',
  MISSING_FIELDS: 'El pergamino está incompleto.',
};

const ERROR_MESSAGES_EN: Record<ValidationErrorReason, string> = {
  SPAM_DETECTED: 'Submission blocked by sanctuary protection.',
  TOO_FAST: 'A moment of calm before sending the stroke.',
  INVALID_EMAIL: 'The address does not appear authentic.',
  MISSING_FIELDS: 'The scroll is incomplete.',
};

export interface UseContactFormOptions {
  onSubmit?: (data: ContactPayload) => Promise<void> | void;
}

export function useContactForm(options: UseContactFormOptions = {}) {
  const { language } = useLanguage();
  const errorMessages = language === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES_ES;

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

  // Reseteo automático tras 2 segundos al estado inicial por defecto
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = window.setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 2000);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

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
        validation.error
          ? errorMessages[validation.error]
          : language === 'en'
            ? 'Message could not reach destination — Retry'
            : 'El mensaje no alcanzó destino — Reintentar'
      );
      return;
    }

    try {
      setStatus('submitting');
      setStatusMessage(language === 'en' ? 'Sending...' : 'Enviando...');

      if (options.onSubmit) {
        await options.onSubmit(payload);
      } else {
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
          throw new Error('VITE_WEB3FORMS_ACCESS_KEY no está configurada.');
        }

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: payload.name,
            email: payload.email,
            message: payload.message,
            subject: `Nuevo mensaje de portfolio de: ${payload.name}`,
            from_name: 'Portfolio SnackMasterDev',
            botcheck: payload.honeypot,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Error al conectar con Web3Forms');
        }
      }

      setStatus('success');
      setStatusMessage(
        language === 'en' ? 'Message delivered with honor' : 'Mensaje entregado con honor'
      );
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      startTimeRef.current = Date.now();
    } catch {
      setStatus('error');
      setStatusMessage(
        language === 'en'
          ? 'Message could not reach destination — Retry'
          : 'El mensaje no alcanzó destino — Reintentar'
      );
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
