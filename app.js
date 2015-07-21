var express = require('express');
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	nicknames = [" "];

	server.listen(3000);

	app.get('/', function(req, res){
		res.sendfile(__dirname + '/index.html');
	});
	app.use('/styles', express.static(__dirname + '/styles'));
	app.use('/scripts', express.static(__dirname + '/scripts'));


	// like jQuery ready 
	io.sockets.on('connection', function(socket){

		socket.on('new user', function(data, callback){
			if (nicknames.indexOf(data) != -1){
				callback(false);
			} else{
				callback(true);
				socket.nickname = data;
				nicknames.push(socket.nickname);
				io.sockets.emit('username', socket.nickname);
				updateNicknames();
			}
		});


		function updateNicknames(){
			io.sockets.emit('usernames', nicknames);
		}

		//receiving data 
		socket.on('send position', function(data){
			
			io.sockets.emit('username', socket.nickname);
			io.sockets.emit('new position', {idx: data, nick: socket.nickname});
		});

		socket.on('disconnect', function(data){
			if(!socket.nickname) return;
			nicknames.splice(nicknames.indexOf(socket.nickname), 1);
			updateNicknames();
		});
	});

