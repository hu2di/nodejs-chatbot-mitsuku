var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Include .html file
app.get('/', function(req, res) {
	//res.send('<h1>RoboChat</h1>');
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	//User connected
	console.log('A user connected! id = ' + socket.id);
	robotAnswer(socket, "", "");
	
	//User disconnected
	socket.on('disconnect', function() {
		console.log('A user disconnected! id = ' + socket.id);
	});
	
	//Show message send from user
	socket.on('new message', function(strJson) {
		console.log('message: ' + strJson);
		//Resent message to user
		io.to(socket.id).emit('new message', strJson);
		
		robotAnalyze(socket, strJson);
	});
});

//Robot Analyze
function robotAnalyze(socket, strJson) {
	var json = JSON.parse(strJson);
	var username = json.username;
	var message = json.message;
	message = message.toLowerCase();
	
	robotAnswer(socket, username, message);
}

//Robot answer
function robotAnswer(socket, username, message) {
	if (message == "") {
		res = "Hi there."
		var strJson = '{ "username": "Robot", "message": "' + res + '" }';;
		io.to(socket.id).emit('new message', strJson);
	} else {
		var m = require('mitsuku-api')();
		m.send(message)
		.then(function (response) {
			console.log(response);
			var strJson = '{ "username": "Robot", "message": "' + response + '" }';;
			io.to(socket.id).emit('new message', strJson);
		});
	}
}

//Listen port 3000
http.listen(3000, function() {
	console.log('listening on *:3000');
});