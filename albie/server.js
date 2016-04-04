'use strict';

const http = require('http');
const url = require('url');
var querystring = require('querystring')
var request = require('request')

let routes = {
	'GET': {
		'/': (req, res) => {
				res.writeHead(200, {'Content-type': 'text/html'});
				res.end('<h1>Hello Router</h1>');
		}
	},
	'POST': {
		'/message': (req, res) => {
			let body = '';
			req.on('data', data => {
				body += data;
			});

			req.on('end', () => {
        var messageParams = querystring.parse(body)
				console.log(messageParams);

        if (messageParams && messageParams.user_name != 'slackbot' && messageParams.bot_name != 'incoming-webhook') {
          request.post('https://sweltering-heat-2285.firebaseio.com/messages.json', {
            json: {
            "imageUrl": "",
            "sender": "Slack",
            "text": messageParams.text} }, function(error, response, body) {});
        }
				res.end();
			});

		}

	}
};

function router(req, res) {
	let baseURI = url.parse(req.url, true);
	let resolvedRoute = routes[req.method][baseURI.pathname];

	//console.log(baseURI.path);
	//console.log(resolvedRoute);
	if (resolvedRoute != undefined) {
		req.queryParams = baseURI.query;
		resolvedRoute(req, res);
	}
}


http.createServer(router)
.listen(3000, () => console.log('Server running on port 3000'));
