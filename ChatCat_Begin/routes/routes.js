module.exports = function(express, app, passport, rooms){
	var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {
			title: 'Welcome to ChatCAT'
		});
	});

	function securePages(req, res, next) {
		if(req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/');
		}
	};

	router.get('/chatrooms', securePages, function(req, res, next) {
		res.render('chatrooms', {
			title: 'Chatrooms',
			user: req.user,
			config: config
		});
	});

	router.get('/room/:id', securePages, function(req, res, next) {
		
		var room_name = getRoomTitle(req.params.id);
		res.render('room', {
			room_name: room_name,
			user: req.user,
			config: config,
			room_number:req.params.id,
			title: 'Room'
		});

	});

	function getRoomTitle(room_id) {
		var n = 0;
		while (n < rooms.length) {
			if (rooms[n].room_number === room_id) {
				return rooms[n].room_name;
				break;
			} else {
				n++;
				continue;
			}
 		}
	}



	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		sucessRedirect:'/chatrooms',
		failureRedirect:'/'
	}));

	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
}
