# 🛡️ DevSecOps Project: MediaStream (StreamVibe API)

## 📌 Resumen Ejecutivo
Este repositorio contiene la auditoría, análisis normativo y refactorización de seguridad para **MediaStream (StreamVibe API)** (Caso 9). El proyecto demuestra la transición de una API vulnerable a un entorno seguro aplicando el ciclo de vida DevSecOps, cumpliendo con un estricto *time-to-market* sin sacrificar la seguridad corporativa.

## ⚖️ Gobernanza y Cumplimiento (ISO/IEC 27034)
Toda la refactorización está respaldada por el Marco Normativo Organizacional (ONF) de la empresa, documentado en la carpeta `gobierno-seguridad/`. Se aplicaron los siguientes Controles de Seguridad de Aplicación (ASC):
* **ASC-01 (Validación Estricta):** Uso de Listas Blancas y Expresiones Regulares (Regex).
* **ASC-02 (Zero Trust):** Control de autorización basado en el servidor, no en parámetros del cliente.
* **ASC-03 (Manejo Seguro de Errores):** Supresión de *Stack Traces* mediante bloques `try/catch`.

## 🐛 Mitigación OWASP Top 10
Se neutralizaron exitosamente 5 vectores de ataque críticos:
1. **A01 (Broken Access Control):** Se bloqueó la manipulación del parámetro `is_vip`.
2. **A03 (Injection):** Se neutralizó la inyección SQL en búsquedas usando Regex.
3. **A04 (Insecure Design):** Se validó estrictamente la suscripción para descargas offline.
4. **A05 (Security Misconfiguration):** Se ocultaron dependencias y trazas de Express.
5. **A08 (Software and Data Integrity Failures):** Se sanitizaron etiquetas HTML en formato Markdown contra XSS.

## 🚀 Estructura del Repositorio (Docs-as-Code)
* `/gobierno-seguridad/`: Manifiesto ético y definición de políticas ISO 27034.
* `/src/vulnerable/`: Código original con las 5 vulnerabilidades.
* `/src/seguro/`: Código refactorizado y blindado.
* `/auditoria/fase1/`: Evidencias de los ataques iniciales (Logs de pentesting).
* `/auditoria/fase2/`: Evidencias de cierre certificando la mitigación (Respuestas HTTP 400/500).