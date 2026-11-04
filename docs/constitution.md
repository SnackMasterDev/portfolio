# Constitución Suprema: Portfolio Juan Camilo García (SnackMasterDev)

1. **Rendimiento Innegociable:** Carga FCP < 0.8s y 60 FPS estables (120 FPS en pantallas compatibles). Cero tirones en scroll o canvas.
2. **Aislamiento Gráfico:** El motor de físicas y partículas NUNCA se sincroniza con el estado de React (`useState`); opera imperativamente en su propio ciclo `requestAnimationFrame`.
3. **Modularidad Estricta:** Ningún componente de interfaz (UI) excederá ~100 líneas; ningún servicio superará ~250 líneas.
4. **Respeto a la Accesibilidad:** Soporte estricto de `prefers-reduced-motion` y contraste accesible (WCAG AA).
5. **Seguridad y Confianza:** Formulario de contacto con triple protección (Honeypot, control de tiempo, validación Zod). Cero secretos expuestos.
