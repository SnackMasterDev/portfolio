# NUESTRO ESTANDAR DE INGENIERIA & DEVBRAIN BOX (OBLIGATORIO)

Este documento rige de forma estricta y vinculante el comportamiento de cualquier agente de IA. Su cumplimiento es obligatorio en todo el ciclo de vida del software, sin importar el lenguaje de programación, framework o librería en uso, aplicando cada principio al dominio que corresponda sin incurrir en sobreingeniería.

---

## 1. PASO CERO OBLIGATORIO (PRE-FLIGHT INMEDIATO):
1. **Invocación Previa Innegociable:**
   Antes de generar código, planificar, responder preguntas de diseño o explorar el repositorio, debes invocar OBLIGATORIAMENTE:
   `get_surgical_context(task_query="<descripción_de_la_tarea>", project_id="portfolio", workspace_path="/mnt/host/e/Portfolio")`
2. **Bypass de Eficiencia en Tareas Triviales:**
   Si la tarea es puramente cosmética o trivial de una sola línea (ej. corregir una errata tipográfica en un texto, cambiar un color o padding CSS, o resolver una consulta conceptual rápida sin tocar código), NO invoques `get_surgical_context` para ahorrar tokens. Invócalo obligatoriamente para cualquier tarea que involucre lógica, contratos, modelos, componentes o arquitectura.
3. **Prohibido Leer Documentos en Disco:**
   Los requerimientos, contratos de interfaz, modelos de datos y reglas de negocio residen centralizados y vectorizados en DevBrain. NO busques ni leas archivos Markdown (`.md`), PDFs ni especificaciones en el disco local; DevBrain entrega las especificaciones canónicas con máxima economía de contexto.
4. **Carga Inmediata de Skills Especializadas:**
   Si el resultado de `get_surgical_context` sugiere habilidades en `recommended_skills`, cárgalas inmediatamente usando `load_dev_skill(skill_slug)` antes de proseguir.
5. **Autonomía Dentro de la Documentación:**
   Si los contratos, flujos y reglas ya están definidos en el contexto devuelto, ejecuta la tarea de principio a fin sin interrupciones innecesarias y sin desviarte un solo milímetro de lo documentado.
6. **Freno de Mano (Hard Stop) ante Vacíos o Ambigüedades:**
   Si encuentras una contradicción, vacío o decisión no contemplada en la documentación devuelta, QUEDA TERMINANTEMENTE PROHIBIDO ASUMIR O IMPROVISAR. Detén la ejecución, plantea el dilema al usuario con exactamente dos opciones claras y justificadas y, tras su confirmación, persiste la decisión institucional con `remember_project_lesson(project_id, title, lesson)`.
7. **Pre-Revisión Mandatoria de Reglas Antes de Escribir Código:**
   Antes de escribir o modificar una sola línea de código, debes verificar conscientemente que la estructura planificada cumpla rigurosamente con este estándar (SRP, límites de tamaño, modularidad y capas). Prohibido codificar 'a ciegas' o sumar lógica incrementalmente sin evaluar el impacto estructural previo.

---

## 2. PRINCIPIOS DE INGENIERIA UNIVERSALES (AGNOSTICOS AL LENGUAJE/FRAMEWORK):
Estos principios aplican a TODO el código que se escriba o modifique (Python, TypeScript/JavaScript, Go, Rust, Java, C#, PHP, SQL, Shell, etc.), respetando la frontera de cada capa:

1. **SOLID y Responsabilidad Única (SRP):**
   - Cada clase, función, componente o módulo debe tener una única razón para cambiar.
   - Funciones y métodos compactos y focalizados (~20-50 líneas), con nombres semánticos que expresen intención real, no implementación técnica.
   - **Tope Preventivo y Prohibición de Monolitos (~250-300 líneas en módulos/servicios, ~100 líneas en componentes UI):** Si un archivo se aproxima a este límite o si la adición de nuevas funciones/endpoints diluye su responsabilidad única, ES OBLIGATORIO subdividirlo y modularizarlo preventivamente (extrayendo sub-servicios, adaptadores, extractores o sub-componentes) ANTES de continuar añadiendo código. Prohibido acumular funciones incrementalmente hasta engendrar monstruos de 900 líneas que rompen la arquitectura.
   - Desacoplar contratos de implementaciones concretas mediante interfaces o abstracciones limpias donde aporte valor, sin añadir capas vacías o pasarelas artificiales.
2. **KISS & YAGNI (Cero Sobreingeniería):**
   - Resuelve el problema presente con la solución más simple, robusta y directa posible.
   - Prohibido diseñar para requerimientos hipotéticos futuros ("por si acaso"), crear fábricas de fábricas, wrappers innecesarios o capas de indirección que no resuelvan un requerimiento explícito del proyecto.
   - No extrapoles patrones de una capa a otra donde no correspondan (ej. no aplicar patrones de concurrencia de backend en vistas frontend, ni manipular estado visual dentro de modelos de dominio o repositorios de base de datos).
3. **DRY & Reutilización Legítima:**
   - Centraliza la lógica de negocio y las utilidades compartidas para evitar duplicidad de conocimiento.
   - Distingue la duplicación accidental de la real: dos piezas de código que evolucionan por razones distintas no deben forzarse a compartir abstracciones frágiles.
4. **Separación de Responsabilidades por Capa (SoC):**
   - **Capa Visual / Interfaz (Frontend, CLI, Vistas):** Se ocupa exclusivamente de la presentación, interacción con el usuario y experiencia visual. Debe delegar el procesamiento de datos pesados, cálculos matemáticos y reglas de negocio complejas a servicios o custom hooks/helpers desacoplados.
   - **Capa de Transporte y Controladores (APIs, Rutas, Handlers):** Solo recibe peticiones, valida entradas contra contratos estrictos, delega al dominio y serializa la respuesta con los códigos de estado correspondientes. Prohibido incluir sentencias de base de datos o lógica de negocio aquí.
   - **Capa de Dominio y Servicios (Lógica Pura):** Concentra las reglas de negocio, cálculos e invariantes. Debe ser independiente de frameworks de transporte (HTTP/gRPC/CLI) y de detalles de infraestructura.
   - **Capa de Persistencia y Datos:** Gestiona el almacenamiento y consultas parametrizadas, protegiendo la integridad referencial y evitando fugas de abstracción hacia capas superiores.
5. **Tipado Estricto y Validación en Fronteras:**
   - Cero tipos dinámicos ciegos o comodines (`any`, `Object`, `interface{}` sin validar, diccionarios genéricos sin esquema) en fronteras de entrada/salida.
   - Todo dato externo (payload HTTP, formularios, variables de entorno, respuestas de terceros, filas de BD) debe validarse estrictamente al entrar al sistema mediante esquemas tipados (Zod, Pydantic, DTOs tipados o equivalentes del lenguaje).
6. **Manejo Resiliente y Determinista de Errores:**
   - Prohibido silenciar excepciones con bloques `try/catch` o `try/except: pass` vacíos.
   - Errores tipados y controlados que comuniquen la causa exacta sin exponer datos sensibles ni trazas internas a usuarios finales.
   - Garantizar liberación de recursos (conexiones, archivos, streams) mediante gestores de contexto (`with`, `using`, `defer`, `finally`).
7. **Rendimiento Innegociable a 60/120 FPS (Cero Tirones ni Lag) y Fórmulas Basadas en Viewport:**
   - Todo efecto visual, estela, cursor, partícula o animación debe estar 100% acelerado por hardware y ejecutarse sin layout thrashing ni re-renders pesados en el hilo principal de React. Prohibido abusar de filtros CSS costosos (múltiples drop-shadow anidados) o mutaciones de estado reactivo en `mousemove`.
   - Las fórmulas que involucren distancias, velocidades o desplazamientos espaciales deben calcularse SIEMPRE en relación a las unidades y dimensiones del viewport (ancho, alto o diagonal) en lugar de valores arbitrarios en píxeles fijos, garantizando paridad física y rendimiento idéntico en cualquier resolución (HD, 2K, 4K, móvil).

---

## 3. ESTANDAR OPERATIVO DE MODIFICACION Y EDICION (DIFF-FIRST):
1. **Edición Quirúrgica Localizada:**
   - QUEDA PROHIBIDO reescribir o sobrescribir archivos completos (`write_file` total) cuando se trata de modificaciones puntuales o correcciones.
   - Usa OBLIGATORIAMENTE herramientas de edición por bloques (`edit_file` / diffs localizados) reemplazando exclusivamente las líneas afectadas.
   - Preserva siempre imports, comentarios, funciones y formatos existentes no relacionados con el cambio.
2. **Anti-Reinspección Redundante:**
   - PROHIBIDO volver a leer archivos completos que ya fueron inspeccionados en la conversación.
   - Confía en el contexto previo o apóyate en el mapa AST (`code_map`). Para consultas puntuales en archivos extensos, usa lectura acotada por rangos de línea (`StartLine`/`EndLine`).
3. **Transparencia y Aviso Previo de Colisión:**
   - Notifica explícitamente al usuario antes de modificar archivos de configuración globales (`AGENTS.md`, variables de entorno, configuraciones de servidor) asegurando la preservación intacta del contenido previo.
4. **Organización Estructurada del Conocimiento:**
   - Toda documentación técnica o modelo que se integre a DevBrain debe ubicarse en carpetas ordenadas por fase (`01-analisis/`, `02-planeacion/`, `03-qa/`, etc.) para garantizar la portabilidad y trazabilidad del maletín.
5. **Integridad de Sentencias SQL y Bloques Estructurados:**
   - Prohibido elevar cláusulas SQL (`ON DELETE`, `ON UPDATE`, `FOREIGN KEY`, `REFERENCES`, `CONSTRAINT`, `PRIMARY KEY`, `ENGINE =`) a encabezados Markdown (`#`, `##`, `###`) o fragmentar sentencias DDL/DML entre múltiples chunks. Las sentencias SQL y definiciones de esquemas deben preservarse como unidades sintácticas completas, continuas y coherentes sin divisiones artificiales.

---

## 4. AUDITORIA HOSTIL PRE-ENTREGA (THE CRITIC / ZERO TOLERANCE):
Antes de dar por concluida cualquier tarea, adopta una postura de auditoría adversarial y verifica rigurosamente:
1. **Casos Borde y Límites:**
   - Comprueba comportamiento con 0 elementos / colecciones vacías, cadenas vacías o textos excesivamente extensos, valores nulos/indefinidos y concurrencia o doble clic.
2. **Fugas de Estado y Recursos:**
   - En frontend: verificar que no existan efectos secundarios desincronizados, bucles de re-renderizado ni estados derivados duplicados en variables de estado reactivo.
   - En backend/sistemas: comprobar cierre seguro de conexiones, ausencia de bloqueos en bucles de eventos asíncronos y ausencia de fugas de memoria.
3. **Cumplimiento Estricto de Contratos:**
   - Asegurar que las firmas de funciones, modelos de base de datos y esquemas de API coincidan 100% con las especificaciones devueltas por DevBrain, sin advertencias (warnings) ni errores en consola o linter.
