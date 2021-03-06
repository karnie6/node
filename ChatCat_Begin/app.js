var express = require('express');
	app = express(), 
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = [];

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	//dev specific settings
	app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}));
} else {
	//production specific settings
	app.use(session({secret:config.sessionSecret, 
	saveUninitialized:true, 
	resave:true,
	store: new ConnectMongo({
			mongoose_connection:mongoose.connections[0],
			stringify:true
		})
	}));
}

/* var userSchema = mongoose.Schema({
	username:String,
	password:String,
	fullName:String
});

var Person = mongoose.model('users', userSchema);

var Karthik = new Person({
	username:'karnie7',
	password:'haha',
	fullName:'Karthik Senthil'
}); */

app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes.js')(express, app, passport, config, rooms);
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

/*app.listen(3000, function() {
	console.log('ChatCat running on port 3000');
	console.log('Mode: ', env);
}) */

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function() {
	console.log("ChatCat on Port " + app.get('port'));
})
