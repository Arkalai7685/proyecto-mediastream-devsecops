# Marco Normativo Organizacional (ONF) - ISO/IEC 27034

## Perfil de Seguridad de Aplicación (MediaStream API)
* **Nombre del Proyecto:** StreamVibe API - Plataforma de Streaming.
* **Nivel de Criticidad del Sistema:** ALTO (Procesa datos de suscripción VIP, propiedad intelectual y perfiles de creadores de contenido).
* **Superficie de Exposición:** Pública (API HTTP expuesta directamente a Internet).

## Controles ASC Seleccionados y Justificación Técnica
Tras revisar los riesgos críticos (OWASP Top 10) presentes en el diseño inicial, este proyecto adopta los siguientes controles obligatorios:

1. **[ASC-01] Validación Estricta de Entradas (Zero Trust Input):**
   * *Regla:* Todo parámetro recibido en la API (especialmente en los endpoints de búsqueda y comentarios) debe ser validado contra una lista blanca utilizando Expresiones Regulares (Regex) en el servidor[cite: 44, 51].
   * *Justificación:* Previene vectores de inyección SQL (A03) en el buscador de podcasts y ataques Cross-Site Scripting - XSS (A08) en el motor de renderizado de Markdown[cite: 50].

2. **[ASC-02] Control de Autorización Centralizado en el Servidor:**
   * *Regla:* Queda estrictamente prohibido confiar en parámetros de estado enviados por el cliente (por ejemplo, el campo `is_vip=true` en el cuerpo de una petición)[cite: 50]. Todo nivel de acceso debe verificarse mediante tokens o validaciones de sesión internas en el backend[cite: 44, 51].
   * *Justificación:* Mitiga la escalada de privilegios y el Control de Acceso Roto (A01), asegurando que los usuarios gratuitos no puedan desbloquear contenido de pago manipulando la solicitud[cite: 50].

3. **[ASC-03] Manejo Seguro de Excepciones y Errores:**
   * *Regla:* Toda la lógica de negocio debe estar envuelta en bloques `try/catch`. En caso de fallo, la aplicación debe retornar códigos HTTP estandarizados (ej. HTTP 400 o 500) y mensajes genéricos, eliminando cualquier traza del framework (Express)[cite: 44, 51].
   * *Justificación:* Elimina los Errores de Configuración de Seguridad (A05), impidiendo que el atacante obtenga información valiosa sobre rutas internas y versiones de dependencias a través de los *Stack Traces*[cite: 50].