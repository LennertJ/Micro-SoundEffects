const discord = require('discord.js');
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./config.json");
const sfxObjects = require("./sounds.json")
const cmds = require("./soundlist.json")
const sfxcount = Object.keys( cmds.soundlist ).length;
const prefix = config.prefix

const botName = "Micro-SoundEffects";
const botId = "#0002";
let lock = false;
var dispatcher = null;
var playing = false;

console.log('script is running');
bot.on("ready", () => {
	console.log('Logged in as: ');
	console.log(botName + ' - (' + botId + ')');
	bot.user.setActivity('silly soundeffecs',{type: "LISTENING",});    
});

bot.on("message", (message) =>{   
	if (message.author.bot) return;
	var stringMessage = message.content.toLowerCase();

	if (stringMessage === prefix + "sfx")				 	{message.reply( getAllcommands() );}
	else if (stringMessage.startsWith(prefix + "sfx " && lock)) 	{playCmdsfx(stringMessage.split(" ")[1],message);} 
	else if (stringMessage.startsWith(prefix + "sfxkill")) 	{message.author.id === config.discordID ? console.log("shutting off!")  : message.channel.send(" You're not authorized ")}
	else if (stringMessage.startsWith(prefix + "r")) 		{roll(stringMessage.split(" ")[1], message); }
	else if (stringMessage.startsWith(prefix + "lock") 
		&& message.member.user.id == config.discordID)	{lock = locks(message);}
		
	for(let i = 0; i < sfxcount; i++){
		if(stringMessage.startsWith(prefix + cmds.soundlist[i].name)){
			reactAllSFX(message, sfxObjects[i].sfxBtn);
		}
	}
});

bot.on('messageReactionAdd', async(messageReaction, user)=>{
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
	try{
		processSFXRequest(messageReaction, stringMessage);
	}catch(err){
		console.log(err);
	}finally{
		playing = false;
	}
});

function locks(message){
    message.delete();
    if (lock){
        message.channel.send("🔓").then(msg => msg.delete({timeout: 3000})).catch(error => console.log(error));
    } else{
        message.channel.send("🔒").then(msg => msg.delete({timeout: 3000})).catch(error => console.log(error));
	}
	return !lock
}

function processSFXRequest(messageReaction,  stringMessage){
	let i = 0;let found = false;
	let voiceChannel = messageReaction.message.member.voice.channel;
	if (voiceChannel == undefined){ console.log("no voice channel found");return;}
	while (i < sfxcount && !found) { stringMessage.indexOf(sfxObjects[i].name) !== -1 ? found = true : i++}
	if (!found) {return;}
	playSFX(messageReaction, i);
}

function playCmdsfx(sfxname, message){
	let voiceChannel = message.member.voice.channel; let directory = "sfx/_allSfx";
	voiceChannel.join().then(function (connection) {
		dispatcher = connection.play(directory + "/"+ sfxname + ".mp3");
		startautoDcTimeOut(100000, voiceChannel);
	});
}

function playSFX(messageReaction, arraynumber) {
	let directory = "sfx/" + sfxObjects[arraynumber].name;
	let voiceChannel = messageReaction.message.member.voice.channel;
	if (voiceChannel == undefined){ console.log("no voice channel found");return;}
	let found = false; let i = 0;
	while (i < sfxObjects[arraynumber].sfxBtn.length && !found) 
		{sfxObjects[arraynumber].sfxBtn[i] == messageReaction.emoji.name ? found = true : i ++}
	if (found)	{
		voiceChannel.join().then(function (connection) {
			dispatcher = connection.play(directory + "/"+sfxObjects[arraynumber].sfxName[i] + ".mp3");
			connection.voice.setSelfDeaf(true)
			startautoDcTimeOut(100000, voiceChannel);
		});
	}
}

async function startautoDcTimeOut(duration, channelId) {
	setTimeout(function(){	channelId.leave(); }, duration);
}



async function reactAllSFX(message, sfxArray){
	for (var i = 0; i < sfxArray.length; i++) {
		await message.react(sfxArray[i]);
	}
}

function getAllcommands(){
	let reactionstring = "all soundeffecs can be accessed by: ```";
	for(let i = 0; i < sfxcount; i++){
		reactionstring += "" + cmds.soundlist[i].name + ": " + cmds.soundlist[i].description + "\n";
	}
	reactionstring += "```"
	return reactionstring;
}
bot.login(config.token);