# Especificación EARS: Ciclo 09 - Formulario de Contacto Seguro Antispam

## 1. Alcance
Implementar el componente de contacto `src/components/contact/ContactSection.tsx` (<100 líneas) y el servicio de validación antispam `src/utils/antiSpam.ts` con protección triple (Honeypot invisible, validación de tiempo mínimo y tipado estricto).

---

## 2. Requisitos EARS

- **CUANDO** el usuario ingrese al formulario:
  - EL SISTEMA debe registrar la marca de tiempo de inicio.
- **SI** el campo oculto `website` (honeypot) contiene algún valor o el tiempo de envío es inferior a 2.5 segundos:
  - EL SISTEMA debe descartar el envío silenciosamente como ataque de bot.
- **CUANDO** el formulario se valide satisfactoriamente:
  - EL SISTEMA debe notificar el estado de éxito con retroalimentación visual accesible.
