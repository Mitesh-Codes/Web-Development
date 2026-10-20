const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req,res) => {
    if(req.url === '/'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World\n');
    } else if(req.url === '/greetings'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Greetings from the server!\n');
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error 404: Page not found\n');
    }
});

server.listen(port, hostname, ()=> {
    console.log(`Server is listening at http://${hostname}:${port}`);
});