
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.login(config.token);

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


//On invite
client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


//on removal
client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
	console.log(message.content)
	if(message.author.bot) return;  
});

