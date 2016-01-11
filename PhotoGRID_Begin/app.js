var express = require('express');
	app = express(), 
	path = require('path'),
	config = require('./config/config.js'),
	knox = require('knox'),
	fs = require('fs'),
	os = require('os'),
	formidable = require('formidable'),
	mongoose = require('mongoose').connect(config.dbURL);


app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public')));

app.set('port', process.env.PORT || 3000);

var singleImage = new mongoose.Schema({
	filename:String,
	votes:Number
})

var singleImageModel = mongoose.model('singleImage', singleImage);
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var Socket;
io.on('connection', function(socket) {
	Socket = socket;
});


var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {
			title: 'Welcome to PhotoGrid',
			host: app.get('host')
		});
	});

	router.get('/getimages', function(req,res,next) {
		singleImageModel.find({}, function(error, result) {
			res.send(JSON.stringify(result));
//			Socket.emit('')

		});
	})

	router.post('/upload', function(req, res, next) {

		function generateFilename(filename) {
			var charBank = "abcdefghi";
			var fstring = '';

			for(var i = 0; i < 10; i++) {
				fstring += charBank[parseInt(Math.random()*9)];
			}

			return fstring + '.jpg';
		}

		var tmpFile, nfile, fname;
		var newForm = new formidable.IncomingForm();
		newForm.keepExtensions = true;
		newForm.parse(req, function(err, fields, files) {
			tmpFile = files.upload.path;
			fname = generateFilename(files.upload.name);
			nfile = os.tmpDir() + '/' + fname;
			res.writeHead(200, {'Content-type':'text/plain'});
			res.end();
		})

		newForm.on('end', function() {
			fs.rename(tmpFile, nfile, function(){
				fs.readFile(nfile, function(err, buf) {
					var req = knoxClient.put(fname, {
						'Content-Length':buf.length,
						'Content-Type':'image/jpeg'
					})

					req.on('response', function(res) {
						if (res.statusCode == 200) {
							var newImage = new singleImageModel({
								filename: fname,
								votes: 0
							}).save();

						Socket.emit('status', {'msg' : 'Saved!', 'delay':3000});
						Socket.emit('doUpdate', {});

						fs.unlink(nfile, function() {
							console.log('Local File Deleted');
						});

						}
					});

					req.end(buf);

				})
			})
		})
	});

app.use('/', router);
app.set('host', config.host);

var knoxClient = knox.createClient({
	key: "AKIAJIYZPWJHHHF5PWVQ",
	secret: "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",
	bucket: "photogrid-ks"
})


//require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function() {
	console.log("PhotoGrid running on Port " + app.get('port'));
})



