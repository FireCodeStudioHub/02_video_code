const http = require('http');
const sanitizeHtml = require('sanitize-html');

// Secure server with SVG sanitization
const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    console.log(`Received ${method} request on ${url}`);
    console.log(`Content-Type: ${headers['content-type']}`);

    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        if (headers['content-type'] === 'image/svg+xml') {
            // Sanitize the SVG content before returning it
            const sanitizedSVG = sanitizeHtml(body, {
                allowedTags: ['svg', 'rect'],
                allowedAttributes: {
                    'rect': ['width', 'height', 'style'],
                },
            });

            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(sanitizedSVG);  // Now safe to return
        } else {
            res.writeHead(400);
            res.end('Unsupported Content-Type');
        }
    });
});

// Start the secure server
server.listen(3000, () => {
    console.log('Secure server running on http://localhost:3000');
});
