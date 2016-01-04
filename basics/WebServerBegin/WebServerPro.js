'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');


function fileAccess(filePath) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.F_OK, error => {
			if(!error) {
				resolve(filePath);
			} else {
				reject(error);
			}
		});
	});
}

function streamFile(filePath) {
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(filePath);

		fileStream.on('open', () => {
			resolve(fileStream);
		});

		fileStream.on('error', () => {
			reject(fileStream);
		});
	});

}

function webserver(req, res) {

	let baseURI = url.parse(req.url, true); 
	let filepath = __dirname + (baseURI.pathname == '/' ? '/index.htm' : baseURI.pathname);

	fileAccess(filepath)
		.then(streamFile)
		.then(content2 => {
				//res.writeHead(200, {'Content-type': 'text/html'});
				//res.end(content2, 'utf-8');
				content2.pipe(res);
		}).catch(error => {
				res.writeHead(404);
				res.end("Dunzo");
		});

}


http.createServer(webserver)
.listen(3000, () => console.log('Server running on port 3000'));  