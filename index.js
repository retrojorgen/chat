var server = require('http').createServer();
var io = require('socket.io')(server);
var fs = require('fs');
var usernames = [];
var users = {};
io.set('origins', '*:*');


var writeToFile = function (message) {
	var newMessage = '[' + new Date(message.date) + '] <' + message.username + '> ' + message.message + '\n';
	fs.appendFile('chat.log', newMessage, function (err) {

	});
}

console.log('server running');

io.on('connection', function(socket){
	
	console.log('koblet til ', socket.id);

	users[socket.id] = {
		socket: socket
	};

	socket.on('message', function(message){
		console.log('message');
		if(message.message.length > 1000) {
			socket.emit('message too long');
			message.message = message.message + ' (Message not posted, too long)';
			writeToFile(message);
		} else {
			io.emit('message', message);
			writeToFile(message);
		}
	});

	socket.on('register username', function(username) {
		console.log('trying to register username -> ', username, usernames, usernames.indexOf(username));
		if(usernames.indexOf(username) === -1) {
			socket.emit('username registered', username);
			io.emit('user joined', username);
			usernames.push(username);
			users[socket.id].username = username;
			writeToFile({
				date: new Date(),
				username: 'Spillmuseet Bot',
				message: 'User ' + username + ' joined chat'
			});
		} else {
			socket.emit('username registration failed', username);
		}
	});

	socket.on('disconnect', function () {
		if(users[socket.id]) {
			if(users[socket.id].username) {
				var username = users[socket.id].username;
				io.emit('user disconnected', username);
				console.log(username);
				usernames.splice(usernames.indexOf(users[socket.id].username), 1);
				console.log(users[socket.id].username, usernames);
				
				writeToFile({
					date: new Date(),
					username: 'Spillmuseet Bot',
					message: 'User ' + username + ' left the chat'
				});
			}
			delete users[socket.id];		
		}
	});
});
server.listen(3000);