const http = require('http');

// Vulnerable server with intentional bugs
const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    console.log(`Received ${method} request on ${url}`);
    console.log(`Content-Type: ${headers['content-type']}`);

    let body = '';
    
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        // Skipping 'Content-Type' validation, allowing dangerous MIME sniffing
        // This might lead to a browser guessing the wrong content type
        if (!headers['content-type']) {
            console.log('No Content-Type header provided!');
        }

        // Vulnerability: Not setting the Content-Type header explicitly
        // res.setHeader('Content-Type', 'text/plain');  <-- Missing this line introduces the bug
        
        if (headers['content-type'] === 'application/json') {
            try {
                const parsedBody = JSON.parse(body);
                res.writeHead(200);
                res.end(`Parsed JSON data: ${JSON.stringify(parsedBody)}`);
            } catch (error) {
                // Vulnerability: Weak error handling that doesn't escape user input
                res.writeHead(400);
                res.end(`Invalid JSON format: ${error.message}`);  // Error message could reveal sensitive information
            }
        } else if (headers['content-type'] === 'text/html') {
            res.writeHead(200);
            // Vulnerability: Not sanitizing user input - XSS can occur
            res.end(`Received HTML content: ${body}`);  // Unescaped HTML content could lead to XSS
        } else {
            // Vulnerability: Incorrect error handling for unknown content types
            res.writeHead(200);
            res.end('Unknown Content-Type');  // Should return 415 but doesn't
        }
    });
});

// Start the vulnerable server
server.listen(3000, () => {
    console.log('Vulnerable server running on http://localhost:3000');
});
