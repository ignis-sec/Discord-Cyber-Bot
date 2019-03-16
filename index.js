
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
client.login(config.token);

var status = require('./status.json').status;



//when the bot is connected and logged in
client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	
	//Get a random status from the list every 5 seconds
	setInterval(function(){
		client.user.setActivity(status[getRandomInt(0,status.length-1)]);
	}, 20000)
});


//On invite to a server
client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

 
//on removal from a server
client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


var commands = require('./commands.js')(client)


//when a message is sent
client.on("message", async message => {

	//log the message
	console.log(message.content)

	//if its written by a bot, return
	if(message.author.bot) return;  


	//commands with prefix
	if(message.content[0]==config.prefix){
		var command = message.content.substr(1).split(' ')[0];
		if(commands.prefix[command]) commands.prefix[command](message);
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
