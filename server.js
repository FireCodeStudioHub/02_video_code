const http = require('http');
const fs = require('fs');
const path = require('path');

// Vulnerable server with file handling (images, SVGs, ZIPs)
const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    console.log(`Received ${method} request on ${url}`);
    console.log(`Content-Type: ${headers['content-type']}`);

    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        // Allow file types like images, SVGs, or ZIP files
        if (headers['content-type'] === 'image/png' || headers['content-type'] === 'image/jpeg') {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end('Image received successfully');  // We won't actually process the image in this example.
        } else if (headers['content-type'] === 'application/zip') {
            // Vulnerable ZIP file handling (this is intentionally weak)
            res.writeHead(200);
            res.end('ZIP file received, but not processed.');
        } else if (headers['content-type'] === 'image/svg+xml') {
            // Potentially dangerous SVG handling without sanitization
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(body);  // Simply return the SVG back, vulnerable to XSS
        } else {
            res.writeHead(400);
            res.end('Unsupported Content-Type');
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
