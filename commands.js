const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const opus = require('opusscript');
module.exports = function(client){

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
						$ping: Shows you how bad my connection is\n\
						$test: test\n\
						$help: helps\n\
						$whoami: shows you if you pwn\'d discord yet\n\
						$play [link]: plays bad quality stuttering music from discord\n\
						$leave: give some privacy to the voice channel\n\
						\
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

				//connect to the message senders voice channel
				const connection = await message.member.voiceChannel.join();

				//construct audio stream
				const stream = ytdl(link, { filter : 'audioonly' });
				var streamOptions = { seek: 0, volume: 1 };

				//if --earrape or --FULLPOWER is passed to the command, well, you asked for it
				if(message.content.split(' ')[2] =='--earrape') streamOptions.volume=10;
				if(message.content.split(' ')[2] =='--FULLPOWER') streamOptions.volume=100;
				//dispatch when audio is finished
				const dispatcher = connection.playStream(stream, streamOptions);
					dispatcher.on("end", end => {
						message.member.voiceChannel.leave()
					 });
				
			},
			"leave":async function(message){
				//leave senders voice channel
				message.member.voiceChannel.leave()
			}



		},

		handleNofix:function(message){

			//if someone uses :pog: emote, respond with pog
			if(message.content.match(/.*:pog:.*/)) {
				const pog = client.emojis.find(emoji => emoji.name === "pog");
		  		message.channel.send(`${pog}`);
			}

			//If someones sentence contains root, pog
			if(message.content.match(/.*root.*/)){
				const pog = client.emojis.find(emoji => emoji.name === "pog");
		  		message.channel.send(`${pog}`);
			}




		}
	}
}