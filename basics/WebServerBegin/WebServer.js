'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function webserver(req, res) {

	let baseURI = url.parse(req.url, true); 
	let filepath = __dirname + (baseURI.pathname == '/' ? '/index.htm' : baseURI.pathname);

	fs.access(filepath, fs.F_OK, error => {
		if(!error) {
			fs.readFile(filepath, (error, content) => {
				if (!error) {
					res.end(content, 'utf-8');
				} else {
					res.writeHead(500);
					res.end('No file available');
				}
			});
		} else {

			res.writeHead(404);
			res.end("Dunzo");
		}
	});

}


http.createServer(webserver)
.listen(3000, () => console.log('Server running on port 3000'));  