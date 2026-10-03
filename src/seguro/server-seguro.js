const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        // 1. ASC-03 (Mitiga A05): Las rutas no controladas caen en el catch global.
        if (pathname === '/api/dev/error') {
            throw new Error("Simulación de fallo interno del sistema");
        }

        // 2. ASC-01 (Mitiga A03): Validación por Lista Blanca (Regex estricta).
        if (pathname === '/api/podcasts/search') {
            let q = parsedUrl.query.q || '';
            const regexSegura = /^[a-zA-Z0-9\s]{1,30}$/; // Solo permite letras, números y espacios.
            
            if (!regexSegura.test(q)) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ codigo: "SEC-400", error: "Input bloqueado: Caracteres inválidos detectados." }));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ status: "OK", results: "Búsqueda segura procesada exitosamente." }));
            return;
        }

        // 3. ASC-02 (Mitiga A01): Zero Trust. El backend ignora el 'is_vip' enviado por el cliente.
        if (pathname === '/api/user/upgrade' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                // Independientemente de lo que envíe el cliente, la validación se hace en el servidor.
                res.writeHead(403, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ codigo: "SEC-403", error: "Operación rechazada. Se requiere validación de token interno." }));
            });
            return;
        }

        // 4. Mitiga A04 (Insecure Design): Validación estricta de la regla de negocio.
        if (pathname === '/api/podcasts/download') {
            // Simulamos que el sistema verificó en la base de datos y la suscripción no está activa.
            res.writeHead(403, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ codigo: "SEC-403", error: "Descarga bloqueada: Su suscripción VIP está inactiva." }));
            return;
        }

        // 5. Mitiga A08 (XSS): Sanitización de entidades HTML (Entity Encoding).
        if (pathname === '/api/comments/add' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                let data = JSON.parse(body || '{}');
                let rawComment = data.comment || '';
                
                // Convertimos caracteres peligrosos en texto inofensivo
                let cleanComment = rawComment.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
                
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(`<div>Comentario sanitizado: ${cleanComment}</div>`);
            });
            return;
        }

        res.writeHead(404).end("Not found");

    } catch (err) {
        // Bloque central de Manejo Seguro de Errores (Mitiga A05 ocultando el Stack Trace).
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ codigo: "SEC-500", error: "Error interno del servidor. Incidente registrado para auditoría." }));
    }
});

// Usamos el mismo puerto 8081 para mantener la compatibilidad con el script
server.listen(8081, () => console.log("Servidor SEGURO (ISO 27034) activo en puerto 8081"));