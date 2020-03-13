const discord = require('discord.js');
const bot = new discord.Client();
const request = require("request");
const fileSystem = require("fs")
const config = require("./config.json");
const prefix = config.prefix

const botName = "Micro-SoundEffects";
const botId = "#0002";
var dispatcher = null;
var voiceChannel = null;

let locations = ["Anarchy", "Dusty", "Fatal", "Flush Factory", "Greasy", "Haunted ♥", "Junk", "Lonely :(", "Loot lake", "'Never' Lucky", "Moisty", "Pleasant", "Retail", "Risky Reels", "Salty", "Shifty", "Snobby", "Tilted Towers and die", "Tomato / Potato Town", "Wailing"];

/* old sfx
var sfxName = ["totalSkill.mp3", "bassie.mp3", 		"mensuh.mp3", 		"bemShockDodge.mp3",		"canYouDoThis.mp3", "doubleKill.mp3", "tripleKill.mp3", "sadViolin.mp3"				, "joke.mp3"
		,"LeeroyJenkins.mp3", 	"megaKill.mp3", "nani.mp3", "onFire.mp3", "spaghet.mp3", "highGround.mp3", "communism.mp3", "yeet.mp3" ,"drum.mp3"];
var sfxBtn = ["☣", 					"🎪" ,			"👲"	, "🌩", 						"♿", 				"✌", 				"🌵"		,						"😭"			, 					"😹"
		, "🗣", "💀", "❓", "🔥", "🍝", "🆙", "❤", "👺", "🥁"];
*/

		//in dit deel van de code mag je files toevogen (hieronder)

let sfxtv = {
	name: 'sfxtv',
	sfxName: ["asthmaLaughing", "drum", "duel", "exodia", "highGround", "itsGone", "leedlelee","mine", "nani", "noGodNo", "someNoise", "spaghet", "stayCalm", "watchOut","whyAreWeYelling"],
	sfxBtn: ["😆", "🥁", "🕐", "💪", "🆙", "◻", "⭐", "🦆", "❓", "😵", "🎵", "🍝", "🤐", "👁‍","😲"]
}

let sfxnl = {
	name: 'sfxnl',
	sfxName: ["agressie", "bassie", "benIkEenMongoolOfwat","buurmanMol","danBelJijVrijdag", "gaTochWeg", "hannessen","helemaalMooi", "jijMotNietDenken(Short)", "mensuh", "metAstroTV", "pelDePindaIsOk", "stopMetSchreeuwen", "tututu", "vegen2", "waarZijnWeMeeBezig","watEenHeld", "zonderKoffieLandIkNiet"],
	sfxBtn: ["😡", "🎪", "🤶","🐀", "🤙", "🤐", "✋", "👌", "🤔", "👲", "🌠", "🥜", "😶", "📞", "🐴", "👪", "👑", "☕"]
}

let sfxyt = {
	name: 'sfxyt',
	sfxName: ["canYouDoThis", "communism", "getAHouse", "illuminati","ILoveYou", "joke", "LeeroyJenkins", "memeReview", "noice", "reee", "yaYeet", "yaYeet2","yeet"],
	sfxBtn: ["♿", "❤", "🏠", "🔺", "😭", "😹", "🗣", "📹", "👌", "😡", "👊", "✊", "👺"]
}

let sfxsongs = {
	name: "sfxSongs",
	sfxName: ["babyShark","helloDarknessMyOldFriend", "ITried", "lonely", "madWorld","mansNotHot", "ponPonWeiWei", "quickMaths", "rawSauce","rescueRangers", "sadViolin", "theThingGoesSkra"], 
	sfxBtn: ["🦈", "⬛", "🙁", "😖", "🗺", "🔥", "🗾", "➕", "🥘", "🥜", "🎻", "🔫"]
}

let sfxgaming={
	name:"sfxgaming",
	sfxName: ["bemShockDodge", "doubleKill", "megaKill", "tripleKill", "onFire", "totalSkill"],
	sfxBtn: ["🌩", "✌", "💀", "🌵", "🔥", "☣"]
}


		//vanaf hier blijf je uit de code (tenzij je weet wat je doet)

var sfxObjects = [sfxtv, sfxnl, sfxyt, sfxsongs, sfxgaming];
var sfxNames = ['tv', 'nl', 'yt', 'songs', 'gaming'];

var playing = false;

console.log('script is running');

bot.on("ready", () => {
	console.log('Logged in as: ');
	console.log(botName + ' - (' + botId + ')');
	bot.user.setActivity('silly soundeffecs',{type: "LISTENING",});    
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
	try{
		if (newMember.id == '259770140361621514') 		 {//arthuur
			playWelcomeSFX("Arthuur", newMember);
		} else if (newMember.id == '366525102248165376') {//els
			playWelcomeSFX("Els", newMember);
		} else if (newMember.id == '295269125880676362') {//jochen
			playWelcomeSFX("Jochen", newMember);
		} else if (newMember.id == '228499662607351809') {//lennert
			playWelcomeSFX("Lennert", newMember);
		} else if (newMember.id == '249263888388980736') {//michael
			playWelcomeSFX("Michael", newMember);
		} else if (newMember.id == '219054459886632960') {//sara
			playWelcomeSFX("Sara", newMember);
		} else if (newMember.id == '241273372892200963') {//stephan
			playWelcomeSFX("Stephan", newMember);
		} else if (newMember.id == '205691277067550720') {//tom
			playWelcomeSFX("Tom", newMember);
		} 
		
		/*else if (newMember.id == '275270122082533378') {//music bot
		    playWelcomeSFX("Bot", newMember);
		}*/
	}catch(err){
		console.log(err);
	}finally{
		playing = false;
	}
});

bot.on("message", (message) =>{    //kill the bot
	if (message.author.bot) return;
	var stringMessage = message.content.toLowerCase();
	if (stringMessage === prefix + "sfx") {
		message.reply(" all soundeffecs can be accessed by: ```sfxtv: English tv related sfx \nsfxnl: Nederlandstalige sfx \nsfxyt: YouTube related sfx \nsfxsongs: everything comming form a song \nsfxgaming: sounds relating to games``` ")
	}
	if (stringMessage.startsWith(prefix + "sfxkill")) {
		if (message.author.id === config.discordID){
			console.log("shutting off!");
			message.reply("Wanted me dead, goodbye cruel world")
			bot.destroy((err) => {
				console.log(err);
			});
			return;
		}else{
			message.channel.send(" ┍ ┞ ⊟⸎⥮ ⥯ ⊠ ┟ ┠┎ ⌆ ⌇◴ ლ(｀ー´ლ) ⎃ ◶ ◈ ⬖ ☍ ⌃ ⥮ ⥯ ◷ ┏ ");
			return;
		}
	}else if(stringMessage.startsWith(prefix + "sfxtv")){
		reactAllSFX(message, sfxObjects[0].sfxBtn);
	}else if (stringMessage.startsWith(prefix + "sfxnl")) {
		reactAllSFX(message, sfxObjects[1].sfxBtn);
	}else if (stringMessage.startsWith(prefix + "sfxyt")) {
		reactAllSFX(message, sfxObjects[2].sfxBtn);
	}else if (stringMessage.startsWith(prefix + "sfxsongs")) {
		reactAllSFX(message, sfxObjects[3].sfxBtn);
	}else if (stringMessage.startsWith(prefix + "sfxgaming")) {
		reactAllSFX(message, sfxObjects[4].sfxBtn);
	}
	
});

bot.on('messageReactionAdd', (messageReaction, user)=>{
	stringMessage = messageReaction.message.content.toLowerCase();
	if (!stringMessage.startsWith(prefix + "sfx")) return;
	if (user.bot) return;
	if (playing) return;
	playing = true;
	try{
		processSFXRequest(messageReaction, user, stringMessage);
	}catch(err){
		console.log(err);
	}finally{
		messageReaction.remove(user.id);
		playing = false;
	}
});

function processSFXRequest(messageReaction, user, stringMessage){
	var message = messageReaction.message;
	voiceChannel = message.member.voiceChannel;
	if (voiceChannel == undefined){ return}

	var i = 0;
	var found = false;
	while (i < sfxNames.length && !found) {
		if (stringMessage.indexOf(sfxNames[i]) !== -1) {
			found = true
		} else {
			i++;
		}
	}

	if (!found) {
		console.log(stringMessage);
		return;
	}
	playSFX(messageReaction, user, i);

}

function playSFX(messageReaction, user, arraynumber) {
	var directory = "sfx/" + sfxNames[arraynumber];
	var found = false;
	var i = 0;
	while (i < sfxObjects[arraynumber].sfxBtn.length && !found) {
		if (sfxObjects[arraynumber].sfxBtn[i] == messageReaction.emoji.name) {
			found = true;
		} else {
			i++;
		}
	}
	var message = messageReaction.message
	voiceChannel = message.member.voiceChannel;
	voiceChannel.join().then(function (connection) {

		if (found) {
			dispatcher = connection.playFile(directory + "/"+sfxObjects[arraynumber].sfxName[i] + ".mp3");
			dispatcher.on('end', function () {
				voiceChannel.leave();
			});
		}
	});
}

function reactAllSFX(message, sfxArray){
	for (var i = 0; i < sfxArray.length; i++) {
		message.react(sfxArray[i]);
	}
}

function playWelcomeSFX(sfct, member) {
	voiceChannel = member.voiceChannel;
	if (voiceChannel == null || playing) { return; }
	playing = true;
	voiceChannel.join().then(function (connection) {

		dispatcher = connection.playFile('sfx/entrySounds/' + sfct + ".mp3");
		dispatcher.on('end', function () {
			voiceChannel.leave();
		});
	});
}


bot.login(config.token);
