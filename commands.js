const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const opus = require('opusscript');
module.exports = function(client,panel){




//create a list of dispatchers for every instance of audio playing
var dispatchers = {};
var playlists = {};
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
				const m = message.channel.send('testing')
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
						# $show-playlist:\n\
						    shows playlist\n\
						# $clears-playlist:\n\
						    Clears playlist\n\
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

				//check if user is in a voicechannel
				if(!message.member.voiceChannel){
					message.channel.send('Join a voice channel first');
					return;
				}

				//check if a playlist is created for this server, if not, initialize it as empty.
				if(!playlists[message.guild.id]) playlists[message.guild.id] = []

				//if a link was passed, push it to playlist
				if(link) playlists[message.guild.id].push(link)

				//play the song of bots people.
				play(message.guild, message.member.voiceChannel,message.content.split(' ')[2],message.channel)
				
			},
			"leave":async function(message){
				//leave senders voice channel
				message.member.voiceChannel.leave()
				message.channel.send('I\'ll show myself out then.')
				delete dispatchers[message.guild.id];
			},
			//set audio level
			"set-boost": async function(message){
				var level = message.content.split(' ')[1];
				dispatchers[message.guild.id].setVolume(level)
				if(level<=1) message.channel.send('Okay normie.');
				else if(level<=10) message.channel.send('', {file:'https://i.kym-cdn.com/entries/icons/original/000/028/207/Screen_Shot_2019-01-17_at_4.22.43_PM.jpg'});
				else message.channel.send('COWABUNGA IT IS!', {file:'https://i.kym-cdn.com/entries/icons/original/000/027/747/michelangelo.jpg'})
			},
			"normal-volume": async function(message){
				dispatchers[message.guild.id].setVolume(1)
			},
			"haxor": async function(message){
				const m = message.channel.send('!help')
			},
			"echo": async function(message){
				message.delete();
				const m = message.channel.send(message.content.split('$echo ')[1])
			},
			"show-playlist": async function(message){
				const m = message.channel.send('Playlist contains: ' + playlists[message.guild.id])
			},
			"clear-playlist": async function(message){
				const m = message.channel.send('Clearing playlist.')
			},
			"skip": async function(message){
				const m = message.channel.send('Skipping current song.')
				dispatchers[message.guild.id].end()
				delete dispatchers[message.guild.id];
				play(message.guild, message.channel,null,null);
			},




			admin:{
				//clear n messages
				"clear":async function(message){
					if(!message.member.roles.find(r => r.name === "Admin")){
						message.reply('ALERT! ALERT! This command is not for plebs')
						return;
					}
					var n = message.content.split(' ')[1]
					message.channel.fetchMessages({limit:n}).then(async collected=>{
						message.channel.bulkDelete(collected,true).then(()=>{
							message.channel.send('Cleared last '+n+ ' messages.')
						})
					})
				},
				//collect at max last 500 messages and delete them
				"purge":async function(message){
					if(!message.member.roles.find(r => r.name === "Admin")){
						message.reply('ALERT! ALERT! This command is not for plebs')
						return;
					}
					message.channel.fetchMessages({limit:100}).then(async collected=>{
						message.channel.bulkDelete(collected,true).then(()=>{
							message.channel.send('Purge commencing. Please do not resist.')
						});
					})
				}
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
				message.channel.send("", {file: "https://discordemoji.com/assets/emoji/6976_OMEGAWHEELCHAIR.gif"});
				message.delete()
			}

			//cute haxor interaction
			if(message.author.id=="556627466433593354" && message.content=="570p"){
				const dans = client.emojis.find(emoji => emoji.name === "dansgame");
		  		message.channel.send(`${dans}`);
			}



		}
	}


async function play(guild,channel,param,messageChannel){

	//check if there are any songs in the playlist, if there arent and user requested song from a channel, notify
	if(!playlists[guild.id] && messageChannel){
		messageChannel.send('No more songs.')
	}

	//console.log(playlists)

	//if dispatcher is online, a song is running. Add to playlist instead
	if(dispatchers[guild.id]){
		if(messageChannel) messageChannel.send('Adding to playlist')
		return;
	}

	//get link from playlist
	link = playlists[guild.id][0];

	//if requested through a channel, notify
	if(messageChannel) messageChannel.send('Now playing: The song of my people.')
	
	//construct audio stream
	const stream = ytdl(link, { filter : 'audioonly' });
	
	//if --earrape or --FULLPOWER is passed to the command, well, you asked for it
	if(param =='--earrape') streamOptions.volume=10;
	if(param =='--FULLPOWER') streamOptions.volume=100;
	
	//connect to the audio channel
	const connection = await channel.join();

	//create a new dispatcher to interfere with this audio stream later
	var dispatcher = connection.playStream(stream, streamOptions);
	
	//store it inside dispatchers json, use guild id as key
	dispatchers[guild.id] = dispatcher;

	//when audio ends, 
	dispatcher.on("end", end => {

		//pop front the playlist
		playlists[guild.id].shift()

		//and delete the dispatcher
		delete dispatchers[guild.id];

		//if there are any more songs in the playlist, play them
		if(playlists[guild.id] && playlists[guild.id]!=0){
			play(guild,channel,null,null)
		}else{
		//if there arent, leave the voice channel
			channel.leave()
		}
	});
}

}



