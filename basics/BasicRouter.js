'use strict';

const http = require('http');
const url = require('url');

let routes = {
	'GET': {
		'/': (req, res) => {
				res.writeHead(200, {'Content-type': 'text/html'});
				res.end('<h1>Hello Router</h1>');
		},
		'/about': (req, res) => {
				res.writeHead(200, {'Content-type': 'text/html'});
				res.end('<h1>This is the About page</h1>');
		},
		'/api/getinfo': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end(JSON.stringify(req.queryParams));
		}
	},
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', data => {
				body += data;
			});

			req.on('end', () => {
				console.log(body);;
				res.end();
			});

		}

	},
	'NA': (req, res) => {
		res.writeHead(404);
		res.end('Content Not Found');
	}
}

function router(req, res) {
	let baseURI = url.parse(req.url, true); 
	let resolvedRoute = routes[req.method][baseURI.pathname];

	//console.log(baseURI.path);
	//console.log(resolvedRoute);
	if (resolvedRoute != undefined) {
		req.queryParams = baseURI.query;
		resolvedRoute(req, res);
	} else {
		routes['NA'](req, res);
	}
}


http.createServer(router)
.listen(3000, () => console.log('Server running on port 3000'));  