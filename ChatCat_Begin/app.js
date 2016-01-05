var express = require('express');
	app = express(), 
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL);

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


require('./routes/routes.js')(express, app);

app.listen(3000, function() {
	console.log('ChatCat running on port 3000');
	console.log('Mode: ', env);
})