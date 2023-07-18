const mode = require("./production.json");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
} = require("@discordjs/voice");
const bot = new Client({
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
    ],
});
const fs = require("fs");

const config = require("./config.json");
const sfxObjects = require("./sounds.json");
const cmds = require("./soundlist.json");
const allSfx = require("./allSfx");
const sfxcount = Object.keys(cmds.soundlist).length;
const prefix = config.prefix;

let playing = false;
let timeoutID;

console.log("script is running");
bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(mode.listeningTo, { type: "LISTENING" });
});

bot.on("messageCreate", (message) => {
    if (message.author.bot) return;
    let stringMessage = message.content.toLowerCase();
    if (stringMessage === prefix + "sfx") {
        message.reply(help());
    } else if (stringMessage.startsWith(prefix + "sfx ")) {
        cmdSFX(message.content.split(" ")[1], message);
    } else if (stringMessage.startsWith(prefix + "sfxkill")) {
        message.author.id === config.discordID
            ? console.log("shutting off!")
            : message.channel.send(" You're not authorized ");
    }
    for (let i = 0; i < sfxcount; i++) {
        if (stringMessage == prefix + cmds.soundlist[i].name) {
            reactAllSFX(message, sfxObjects[i].sfxBtn);
        }
        if (stringMessage == prefix + cmds.soundlist[i].name + "?") {
            reactAllSFXNames(
                message,
                sfxObjects[i].sfxName,
                sfxObjects[i].sfxBtn,
                cmds.soundlist[i].name
            );
        }
    }
});

bot.on("messageReactionAdd", async (messageReaction, user) => {
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log(
                "Something went wrong when fetching the message: ",
                error
            );
            return;
        }
    }
    let stringMessage = messageReaction.message.content.toLowerCase();

    if (!stringMessage.startsWith(prefix + "sfx")) return;
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

function playSFX(directory, voiceChannel) {
    if (Math.floor(Math.random() * 420) == 69) {
        directory = mode.directory + "rickRoll.mp3";
    }
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        const resource = createAudioResource(fs.createReadStream(directory));
        const player = createAudioPlayer();
        player.play(resource);

        connection.subscribe(player);
        resetautoDcTimeOut(10 * 60 * 1000, voiceChannel);
    } catch (err) {
        console.error(err);
    }
}

function resetautoDcTimeOut(timeout, voiceChannel) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        voiceChannel.leave();
    }, timeout);
}

function processSFXRequest(messageReaction, stringMessage) {
    let i = 0;
    let found = false;
    while (i < sfxcount && !found) {
        stringMessage == "!sfx" + sfxObjects[i].name ? (found = true) : i++;
    }
    if (!found) {
        console.log("no sfx found");
        return;
    }
    buttonSFX(messageReaction, i);
}

function cmdSFX(sfxname, message) {
    let i = 0;
    let sfx = [];
    let voiceChannel = message.member.voice.channel;
    let filename;
    if (voiceChannel == undefined) {
        console.log("no voice channel found");
        return;
    }
    if (mode.isProduction) {
        filename = mode.directory + sfxname + ".mp3";
    } else {
        do {
            sfx.push(
                mode.directory + sfxObjects[i].name + "/" + sfxname + ".mp3"
            );
            i++;
        } while (i < Object.keys(sfxObjects).length);

        for (const element of sfx) {
            try {
                if (fs.existsSync(element)) {
                    filename = element;
                }
            } catch (err) {
                console.error("");
            }
        }
    }
    playSFX(filename, voiceChannel);
}
function buttonSFX(messageReaction, arraynumber) {
    let directory = mode.directory;
    if (!mode.isProduction) {
        directory = mode.directory + sfxObjects[arraynumber].name;
    }
    let voiceChannel = messageReaction.message.member.voice.channel;
    if (voiceChannel == undefined) {
        console.log("no voice channel found");
        return;
    }
    let found = false;
    let i = 0;
    while (i < sfxObjects[arraynumber].sfxBtn.length && !found) {
        sfxObjects[arraynumber].sfxBtn[i] == messageReaction.emoji.name
            ? (found = true)
            : i++;
    }
    if (found) {
        playSFX(
            directory + "/" + sfxObjects[arraynumber].sfxName[i] + ".mp3",
            voiceChannel
        );
    } else {
        console.log("no sfx found in folder");
    }
}

async function reactAllSFX(message, sfxArray) {
    for (const element of sfxArray) {
        await message.react(element);
    }
}
function help() {
    let reactionstring = "all soundeffecs can be accessed by: ```";
    for (let i = 0; i < sfxcount; i++) {
        reactionstring +=
            "" +
            cmds.soundlist[i].name +
            ": " +
            cmds.soundlist[i].description +
            "\n";
    }
    reactionstring +=
        "add a questionmark to the command to see what sounds are available in that class (eg.: !sfxnl?) \n";
    reactionstring +=
        "any soundeffect can be instantly played by typing '!sfx <sfx-name>' (eg. !sfx aaa) \n";
    reactionstring += "!sfxlist: will show all sfx in the database \n";
    reactionstring += "```";
    return reactionstring;
}

bot.login(config.token);
