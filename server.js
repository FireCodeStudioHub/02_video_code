const http = require('http');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

// Define a directory to extract the files
const extractDir = path.join(__dirname, 'uploads');

// Vulnerable server that accepts and unpacks ZIP files
const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    console.log(`Received ${method} request on ${url}`);
    console.log(`Content-Type: ${headers['content-type']}`);

    if (headers['content-type'] === 'application/zip') {
        // Ensure the extraction directory exists
        if (!fs.existsSync(extractDir)) {
            fs.mkdirSync(extractDir);
        }

        // Handle ZIP file extraction without path normalization (vulnerable to ZIP Slip)
        req.pipe(unzipper.Parse())
            .on('entry', (entry) => {
                // Directly use the path without normalizing or sanitizing it
                const filePath = path.join(extractDir, entry.path);

                console.log(`Extracting file to: ${filePath}`);
                
                // Vulnerably write files, even if they attempt to overwrite outside of `uploads`
                entry.pipe(fs.createWriteStream(filePath))
                    .on('finish', () => {
                        console.log(`File extracted to: ${filePath}`);
                    })
                    .on('error', (err) => {
                        console.error(`Error writing file to: ${filePath}`, err);
                    });
            })
            .on('close', () => {
                console.log('ZIP file extracted successfully');
                res.writeHead(200);
                res.end('ZIP file unpacked and saved');
            })
            .on('error', (err) => {
                console.error('Error extracting ZIP file:', err);
                res.writeHead(500);
                res.end('Error unpacking ZIP file');
            });
    } else {
        res.writeHead(400);
        res.end('Unsupported Content-Type');
    }
});

// Start the vulnerable server
server.listen(3000, () => {
    console.log('Vulnerable server running on http://localhost:3000');
});
