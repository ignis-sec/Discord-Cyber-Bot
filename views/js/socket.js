var socket = io.connect('http://localhost:8008');
socket.emit('request-stats',{})
socket.emit('request-guilds',{})


var guilds = {}



socket.on('stats', function (data) {
	console.log(data)
	$('#stats').html('Running on '+ data.guild + ' guilds with ' + data.channels + ' channels and ' + data.users + ' users.')
	$('#status').html(data.status)
});

socket.on('message', message=>{
	console.log(message)
	if(!guilds[message.guild.id]){
		guilds[message.guild.id]=message.guild.name
		appendGuild(message.guild)
	}
	$('#'+ message.guild.id + '-messages').append('@'+ message.channel.name + '> ' + message.author.name + ': ' +message.content+ '<br>')
 
})

socket.on('status-change',data=>{
	$('#status').html(data.status)
})

socket.on('audio', data=>{
	console.log(data)
})

function appendGuild(server){
	var serverDiv = 
	'<div class="card">\
      <div class="card-header" id="heading-'+ server.id + '">\
         <h5 class="mb-0">\
            <button class="btn btn-link primary-color" type="button" data-toggle="collapse" data-target="#collapse-'+ server.id + '" aria-expanded="true" aria-controls="collapse-'+ server.id + '">\
            '+ server.name + '<i style="color:#ddd">'+ server.id + '</i>\
            </button>\
         </h5>\
      </div>\
      <div id="collapse-'+ server.id + '" class="collapse" aria-labelledby="heading-'+ server.id + '" data-parent="#server-container">\
         <div class="card-body" id="'+ server.id + '-messages">\
            <br>\
         </div>\
      </div>\
    </div>\
    '
	$('#server-container').append(serverDiv)
	
}