
const Discord = require("discord.js");
const client = new Discord.Client();
var panel = require('./controlPanel.js')(client)
const config = require("./config.json");
client.login(config.token);

var status = require('./status.json').status;



var newstatus = 'Status will be updated on the next change';
//when the bot is connected and logged in
client.on("ready", () => {
	console.log("Logged in.")
	
	//console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	
	//Get a random status from the list every 5 seconds
	setInterval(function(){
		newstatus=status[getRandomInt(0,status.length-1)]
		panel.io.emit('status-change',{status:newstatus})
		client.user.setActivity(newstatus);
	}, 20000)
});


//On invite to a server
client.on("guildCreate", guild => {
	panel.io.emit('new-guild',{guild:guild})
	//console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

 
//on removal from a server
client.on("guildDelete", guild => {
	panel.io.emit('removed-guild',{guild:guild})
	//console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


var commands = require('./commands.js')(client,panel)


//when a message is sent
client.on("message", async message => {

	//log the message
	console.log(message.content)
	panel.io.emit('message',
		{
			content:message.content,
			author:{
				name:message.author.username
			},
			guild:{
				id:message.guild.id,
				name:message.guild.name
			},
			channel:{
				id:message.channel.id,
				name:message.channel.name
			}
		})

	//if its written by this bot, return
	if(message.author.id=='556245899966414867') return;  


	//commands with prefix
	if(message.content[0]==config.prefix){
		var command = message.content.substr(1).split(' ')[0];
		try{commands.prefix[command](message);}
		catch(err){}
	}
	//special case commands that doesn't have prefix
	else{
		commands.handleNofix(message)
	}

	
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}









