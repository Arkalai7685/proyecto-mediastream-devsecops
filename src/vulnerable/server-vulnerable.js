const http = require('http');
const url = require('url');

const db = {
    creators: [{ id: 1, email: "admin@streamvibe.com", hash_md5: "5f4dcc3b5aa765d61d8327deb882cf99" }],
    podcasts: [{ id: 1, title: "Ciberseguridad 101" }]
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // OWASP A09: Ausencia de Registro y Monitoreo (Ninguna ruta imprime logs en consola)

    // OWASP A05: Security Misconfiguration
    if (pathname === '/api/dev/error') {
        let fakeError = new Error("FATAL: Fallo en /node_modules/express/lib/router.js:45");
        res.writeHead(500, {'Content-Type': 'text/plain'});
        return res.end(fakeError.stack);
    }

    // OWASP A03: Injection
    if (pathname === '/api/podcasts/search') {
        let simulatedQuery = `SELECT * FROM podcasts WHERE title LIKE '%${query.q}%'`;
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ sql: simulatedQuery, result: query.q.includes("UNION") ? db.creators : db.podcasts }));
    }

    // OWASP A01: Broken Access Control
    if (pathname === '/api/user/upgrade' && req.method === 'POST') {
        let body = ''; req.on('data', chunk => body += chunk);
        req.on('end', () => {
            let data = JSON.parse(body || '{}');
            if (data.is_vip === true) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ status: "VIP_GRANTED", details: "Acceso total a MediaStream" }));
            }
        });
        return;
    }

    // OWASP A04: Insecure Design
    if (pathname === '/api/podcasts/download') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ status: "success", file: `https://streamvibe.internal/dl/${query.id}.mp3` }));
    }

    // OWASP A08: Software and Data Integrity Failures (XSS)
    if (pathname === '/api/comments/add' && req.method === 'POST') {
        let body = ''; req.on('data', chunk => body += chunk);
        req.on('end', () => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`<div>Comentario Markdown: ${JSON.parse(body || '{}').comment}</div>`);
        });
        return;
    }

    // OWASP A02: Cryptographic Failures (Devuelve contraseñas en MD5 sin sal)
    if (pathname === '/api/creator/profile') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ user: db.creators[0].email, password_hash: db.creators[0].hash_md5 }));
    }

    // OWASP A06: Vulnerable and Outdated Components (Librería multimedia vieja)
    if (pathname === '/api/system/decoder') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ status: "Decoder activo", library: "ffmpeg-0.9-vulnerable", RCE_risk: "Alta" }));
    }

    // OWASP A07: Identification and Auth Failures (Enlace predecible estático)
    if (pathname === '/api/auth/recover') {
        let userEmail = query.email;
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ reset_link: `http://streamvibe.com/reset?email=${userEmail}` }));
    }

    // OWASP A10: Server-Side Request Forgery (SSRF)
    if (pathname === '/api/rss/import') {
        let targetUrl = query.url; // Confía en la URL externa e intenta acceder a redes internas
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ status: "Fetching RSS", fetching_from: targetUrl, internal_data: "AWS_METADATA_EXPOSED" }));
    }

    res.writeHead(404).end("Not found");
});

server.listen(8081, () => console.log("Servidor VULNERABLE (10 Dominios) activo en puerto 8081"));