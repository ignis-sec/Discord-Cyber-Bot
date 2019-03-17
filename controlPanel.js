const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'views')));
var server = require('http').Server(app);
const port = 8008

module.exports = function(client){

server.listen(port,()=>{
	console.log('Interface is listening at localhost:' + port)
})

var io = require('socket.io')(server);


io.on('connection', function (socket) {

	console.log('new connection to UI')

	socket.on('request-stats',(data)=>{
		io.emit('stats', {guild:client.guilds.size, channels:client.channels.size, users:client.users.size})
	})

	socket.on('request-guilds', (data)=>{
		io.emit('guilds', {guilds:client.guilds})
	})
});

app.get('/', (req,res)=>{
	res.sendFile(__dirname + '/views/panel.html')
})

return {
	io:io,
	app:app
}

}
