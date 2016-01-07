var express = require('express');
	app = express(), 
	path = require('path'),
	config = require('./config/config.js'),
	knox = require('knox');


app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public')));

app.set('port', process.env.PORT || 3000);
var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {
			title: 'Welcome to PhotoGrid'
		});
	});

app.use('/', router);
app.set('host', config.host);

var knoxClient = knox.createClient({
	key: "AKIAJIYZPWJHHHF5PWVQ",
	secret: "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",
	bucket: "photogrid-ks"
})

var server = require('http').createServer(app);
var io = require('socket.io')(server);
//require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function() {
	console.log("PhotoGrid running on Port " + app.get('port'));
})



