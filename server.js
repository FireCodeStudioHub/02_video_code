const http = require('http');

// Define the server
const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    // Log some basic request info
    console.log(`Received ${method} request on ${url}`);
    console.log(`Content-Type: ${headers['content-type']}`);

    let body = '';
    
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        // Set the response headers
        res.setHeader('Content-Type', 'text/plain');
        
        if (headers['content-type'] === 'application/json') {
            try {
                const parsedBody = JSON.parse(body);
                res.writeHead(200);
                res.end(`Parsed JSON data: ${JSON.stringify(parsedBody)}`);
            } catch (error) {
                res.writeHead(400);
                res.end('Invalid JSON format');
            }
        } else if (headers['content-type'] === 'text/html') {
            res.writeHead(200);
            res.end(`Received HTML content: ${body}`);
        } else {
            // Default response for unknown content types
            res.writeHead(415);
            res.end('Unsupported Media Type');
        }
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
