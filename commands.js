const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const opus = require('opusscript');
module.exports = function(client,panel){

//create a list of dispatchers for every instance of audio playing
var dispatchers = {};
var streamOptions = { seek: 0, volume: 1 };
	return {
		//noprefix commands are relatively slower because every message needs to be checked through regex, so try to keep their number at a minimum
		//and try to keep majority of commands with prefix
		prefix:{
			"ping": async function(message){
			const m = await message.channel.send("Ping?");
			m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
			},

			"test": async function(message){
				const m = await message.channel.send('testing')
			},

			"help": async function(message){
				const m = await message.channel.send('Try harder')
				setTimeout(function(){
					message.channel.send('jk. Here are some commands\n\
						\`\`\`markdown\n\
						# $ping:\n\
						    Shows you how bad my connection is\n\
						# $test:\n\
						    test\n\
						# $help: \n\
						    helps\n\
						# $whoami: \n\
						    shows you if you pwn\'d discord yet\n\
						# $play [link]: \n\
						    plays bad quality stuttering music from discord\n\
						# $leave: \n\
						    give some privacy to the voice channel\n\
						# $clear [n]: \n\
						    Clears the last n messages\n\
						# $purge: \n\
						    Purges up to last 500 messages\n\
						# $set-boost [level 0-1 normal, 1-1000 deepfried]: \n\
						    Deep fries the music\n\
						# $normal-volume: \n\
						    guess what it does\n\
						\`\`\`\
					'.replace(/\t/g,''))//remove tabs
				},3000)
			},

			"whoami": async function(message){
				const m = await message.channel.send('root');
				//wait 2 seconds to send this
				setTimeout(function(){message.channel.send('just kidding, not even user lol');},2000)
			},
			//$play https://youtube.com/watch?url 
			"play": async function(message){
				//get link from the string
				var link = message.content.split(' ')[1];

				if(!message.member.voiceChannel){
					message.channel.send('Join a voice channel first');
					return;
				}
				//connect to the message senders voice channel
				const connection = await message.member.voiceChannel.join();

				//construct audio stream
				const stream = ytdl(link, { filter : 'audioonly' });
				
				//if --earrape or --FULLPOWER is passed to the command, well, you asked for it
				if(message.content.split(' ')[2] =='--earrape') streamOptions.volume=10;
				if(message.content.split(' ')[2] =='--FULLPOWER') streamOptions.volume=100;
				
				//create a new dispatcher to interfere with this audio stream later
				var dispatcher = connection.playStream(stream, streamOptions);
				
				//store it inside dispatchers json, use guild name as key
				dispatchers[message.guild] = dispatcher;

				//when audio ends, remove dispatcher and leave voice channel
				dispatcher.on("end", end => {
					message.member.voiceChannel.leave()
					delete dispatchers[message.guild];
				 });
				
			},
			"leave":async function(message){
				//leave senders voice channel
				message.member.voiceChannel.leave()
				delete dispatchers[message.guild];
			},
			//clear n messages
			"clear":async function(message){
				var n = message.content.split(' ')[1]
				message.channel.fetchMessages({limit:n}).then(async collected=>{
					message.channel.bulkDelete(collected,true);
				})
			},
			//collect at max last 500 messages and delete them
			"purge":async function(message){
				message.channel.fetchMessages({limit:100}).then(async collected=>{
					message.channel.bulkDelete(collected,true);
				})
			},
			//set audio level
			"set-boost": async function(message){
				var level = message.content.split(' ')[1];
				dispatchers[message.guild].setVolume(level)
			},
			"normal-volume": async function(message){
				dispatchers[message.guild].setVolume(1)
			}



		},

		handleNofix:async function(message){

			//if someone uses :pog: emote, respond with pog
			if(message.content.match(/.*:pog:.*/)) {
				const pog = client.emojis.find(emoji => emoji.name === "pog");
		  		message.channel.send(`${pog} ${pog} ${pog} `);
			}

			//if someone uses :pog: emote, respond with pog
			if(message.content.match(/.*:poggers:.*/)) {
				const pog = client.emojis.find(emoji => emoji.name === "poggers");
		  		message.channel.send(`${pog}`);
			}

			//If someones sentence mentions rooting
			if(message.content.match(/.*(got.*root)|(rooted).*/)){
				const pog = client.emojis.find(emoji => emoji.name === "pog");
		  		message.channel.send(`${pog}`);
			}

			//If someones sentence mentions rooting
			if(message.content.match(/.*www-data.*/)){
				const head = client.emojis.find(emoji => emoji.name === "4head");
		  		message.channel.send(`lel www-data, just get a root ${head}`);
			}

			if(message.content.match(/.*:omegawheel:.*/)){
				await message.channel.send("", {file: "https://discordemoji.com/assets/emoji/6976_OMEGAWHEELCHAIR.gif"});
				message.delete()
			}

		}
	}
}