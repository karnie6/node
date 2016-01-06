module.exports = function(io, rooms) {

	var chatrooms = io.of('/roomlist').on('connection', function(socket) {
		console.log('Connection Established on the Server!')
		socket.emit('roomupdate', JSON.stringify(rooms))

		socket.on('newroom', function(data) {
			rooms.push(data);
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms))
		})

	});

	var messages = io.of('/messages').on('connection', function(socket) {
		socket.on('joinroom', function(data) {
			socket.username = data.user;
			socket.userPic = data.userPic;
			socket.join(data.room);
			console.log('Connected to chatroom ' + data.room);
		})

		socket.on('newMessage', function(data) {
			socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
		})

	});

}