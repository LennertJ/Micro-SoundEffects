const mode = require('./development.json')
const discord = require('discord.js');
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const paginationEmbed = require('discord.js-pagination');

const config = require("./config.json");
const sfxObjects = require("./sounds.json")
const cmds = require("./soundlist.json")
const allSfx = require("./allSfx")
const sfxcount = Object.keys(cmds.soundlist).length;
const prefix = config.prefix
const fs = require('fs')

const botName = "Micro-SoundEffects";
const botId = "#0002";
let lock = false;
var playing = false;
let timeoutID;

console.log('script is running');
bot.on("ready", () => {
	console.log('Logged in as: ');
	console.log(botName + ' - (' + botId + ')');
	bot.user.setActivity(mode.listeningTo, { type: "LISTENING", });
});

bot.on("message", (message) => {
	if (message.author.bot) return;
	var stringMessage = message.content.toLowerCase();
	if (stringMessage === prefix + "sfx") { message.reply(help()); }
	else if (stringMessage.startsWith(prefix + "sfx ") && !lock) { cmdSFX(message.content.split(" ")[1], message); }
	else if (stringMessage.startsWith(prefix + "sfxkill")) { message.author.id === config.discordID ? console.log("shutting off!") : message.channel.send(" You're not authorized ") }
	else if (stringMessage.startsWith(prefix + "lock") && message.member.user.id == config.discordID) { lock = locks(message); }
	else if(stringMessage === prefix + "sfxlist"){sendAllSfx(message)}
	for (let i = 0; i < sfxcount; i++) {
		if (stringMessage == prefix + cmds.soundlist[i].name ) {
			reactAllSFX(message, sfxObjects[i].sfxBtn);
		}
		if (stringMessage == prefix + cmds.soundlist[i].name + "?") {
			reactAllSFXNames(message, sfxObjects[i].sfxName, sfxObjects[i].sfxBtn, cmds.soundlist[i].name);
		}
	}
});

bot.on('messageReactionAdd', async (messageReaction, user) => {
	if (messageReaction.partial) {//fetch old messages
		try {
			await messageReaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}
	stringMessage = messageReaction.message.content.toLowerCase();
	if (!stringMessage.startsWith(prefix + "sfx")) return;
	if (lock) return;
	if (user.bot) return;
	if (playing) return;
	playing = true;
	try {
		processSFXRequest(messageReaction, stringMessage);
	} catch (err) {
		console.log(err);
	} finally {
		playing = false;
	}
});

function playSFX(directory,voiceChannel){
	if(Math.floor(Math.random() * 200)==69){
		directory = mode.directory + "rickRoll.mp3"
	}
	
	voiceChannel.join().then(function (connection) {
		dispatcher = connection.play(directory);
		connection.voice.setSelfDeaf(mode.selfDeaf)
	}).then(function (){
		resetautoDcTimeOut(10*60*1000, voiceChannel)
	});
}
function resetautoDcTimeOut(timeout, voiceChannel){
	clearTimeout(timeoutID)
	timeoutID = setTimeout(() => {
		voiceChannel.leave()
	},timeout);
}
function locks(message) {
	message.delete();
	if (lock) {
		message.channel.send("🔓").then(msg => msg.delete({ timeout: 3000 })).catch(error => console.log(error));
	} else {
		message.channel.send("🔒").then(msg => msg.delete({ timeout: 3000 })).catch(error => console.log(error));
	}
	return !lock
}

function processSFXRequest(messageReaction, stringMessage) {
	let i = 0; let found = false;
	let voiceChannel = messageReaction.message.member.voice.channel;
	if (voiceChannel == undefined) { console.log("no voice channel found"); return; }
	while (i < sfxcount && !found) {stringMessage == "!sfx" + sfxObjects[i].name ? found = true : i++ }
	if (!found) { return; }
	buttonSFX(messageReaction, i);
}

function cmdSFX(sfxname, message) {
	let i = 0;
	let sfx = [];
	let voiceChannel = message.member.voice.channel;
	if (voiceChannel == undefined) { console.log("no voice channel found"); return; }
	if(mode.isProduction){
		filename = mode.directory + sfxname + ".mp3";
	}
	else{
	  do {
		sfx.push( mode.directory + sfxObjects[i].name + "/" + sfxname + ".mp3");
		i++;
	  } while (i < Object.keys(sfxObjects).length);
  
	  for(let i = 0; i < sfx.length; i++){
		try {
		  if (fs.existsSync(sfx[i])) {
			filename = sfx[i];
		  }
		} catch(err) {
		  console.error("")
		}
	  }
	}
	playSFX(filename,voiceChannel)
}
function buttonSFX(messageReaction, arraynumber) {
	let directory = mode.directory
	if(!mode.isProduction){
		directory = mode.directory + sfxObjects[arraynumber].name;
	}
	let voiceChannel = messageReaction.message.member.voice.channel;
	if (voiceChannel == undefined) { console.log("no voice channel found"); return; }
	let found = false; let i = 0;
	while (i < sfxObjects[arraynumber].sfxBtn.length && !found) { sfxObjects[arraynumber].sfxBtn[i] == messageReaction.emoji.name ? found = true : i++ }
	if (found) {
		playSFX(directory + "/" + sfxObjects[arraynumber].sfxName[i] + ".mp3", voiceChannel);
	}
}

async function reactAllSFX(message, sfxArray) {
	for (var i = 0; i < sfxArray.length; i++) {
		await message.react(sfxArray[i]);
	}
}
function help() {
	let reactionstring = "all soundeffecs can be accessed by: ```";
	for (let i = 0; i < sfxcount; i++) {
		reactionstring += "" + cmds.soundlist[i].name + ": " + cmds.soundlist[i].description + "\n";
	}
	reactionstring += "add a questionmark to the command to see what sounds are available in that class (eg.: !sfxnl?) \n"
	reactionstring += "any soundeffect can be instantly played by typing '!sfx <sfx-name>' (eg. !sfx aaa) \n"
	reactionstring += "!sfxlist: will show all sfx in the database \n"
	reactionstring += "```"
	return reactionstring;
}
function sendAllSfx(msg){
	let pages = []
	let reply = ""
	for (let i = 0; i < Math.ceil(allSfx.length/10); i++){
		reply ="";
		for (let j = 0; j< 10; j++){
			if (i*10 + j >= allSfx.length){
				break;
			}
			reply += "- "+ allSfx[i*10+j].name+ "\n";
		}
		pages[i] =new discord.MessageEmbed()
		.setTitle("all sfx names")
		.setDescription(reply);
	}
	paginationEmbed(msg, pages, ['⏪', '⏩'], 10*60*1000);
}

function reactAllSFXNames(message, sfxArray,btnArray, title) {
	let reply =""
	for (var i = 0; i < sfxArray.length; i++) {
		reply += btnArray[i] + "   "+ sfxArray[i]+ "\n";
	}
	const Embed = new discord.MessageEmbed()
	.setTitle(title)
	.setDescription(reply);

	message.channel.send('', {
	embed: Embed,
	});
}
bot.login(config.token);
