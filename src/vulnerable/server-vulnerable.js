const http = require('http');
const url = require('url');

// Base de datos simulada en memoria
const db = {
    podcasts: [{ id: 1, title: "Ciberseguridad 101", category: "Tech" }, { id: 2, title: "Finanzas VIP", category: "Business" }],
    creators: [{ id: 1, email: "admin@streamvibe.com", hash_md5: "5f4dcc3b5aa765d61d8327deb882cf99" }]
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. OWASP A05: Security Misconfiguration (Exposición de Stack Trace)
    if (pathname === '/api/dev/error') {
        // Corrección: Devolvemos el error crudo al cliente sin apagar nuestro servidor
        let fakeError = new Error("FATAL: No se pudo conectar a la base de datos en /var/www/mediastream/node_modules/express/lib/router.js:45");
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(fakeError.stack);
        return;
    }

    // 2. OWASP A03: Injection (Inyección SQL en el buscador)
    if (pathname === '/api/podcasts/search') {
        let q = parsedUrl.query.q || '';
        // Vulnerabilidad: Concatenación directa sin sanitizar
        let simulatedQuery = `SELECT * FROM podcasts WHERE title LIKE '%${q}%'`;
        
        // Simulación de explotación: Si el atacante inyecta "UNION", exponemos contraseñas
        if (q.includes("UNION")) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ executed_sql: simulatedQuery, results: db.creators }));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ executed_sql: simulatedQuery, results: db.podcasts }));
        return;
    }

    // 3. OWASP A01: Broken Access Control (Manipulación de parámetro is_vip)
    if (pathname === '/api/user/upgrade' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let data = JSON.parse(body || '{}');
            // Vulnerabilidad: Confía ciegamente en el booleano que envía el cliente
            if (data.is_vip === true) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ status: "success", role: "VIP_USER", unlocked_content: "Acceso total al catálogo premium concedido" }));
            } else {
                res.writeHead(403, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ error: "Contenido bloqueado. Requiere pago." }));
            }
        });
        return;
    }

    // 4. OWASP A04: Insecure Design (Lógica de descargas sin validación)
    if (pathname === '/api/podcasts/download') {
        let contentId = parsedUrl.query.id;
        // Vulnerabilidad: Permite la descarga directa sin validar en la BD si la suscripción está activa
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ status: "success", download_link: `https://streamvibe.internal/downloads/${contentId}.mp3`, warning: "Descarga generada sin verificar estado de suscripción" }));
        return;
    }

    // 5. OWASP A08: Software and Data Integrity Failures (XSS en comentarios Markdown)
    if (pathname === '/api/comments/add' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let data = JSON.parse(body || '{}');
            res.writeHead(200, {'Content-Type': 'text/html'});
            // Vulnerabilidad: Retorna el contenido directamente sin sanitizar (Cross-Site Scripting)
            res.end(`<div><h3>Nuevo Comentario (Markdown renderizado):</h3><p>${data.comment}</p></div>`);
        });
        return;
    }

    res.writeHead(404).end("Not found");
});

server.listen(8081, () => console.log("Servidor VULNERABLE MediaStream activo en el puerto 8081"));