const keys = require('./libs/api-keys');

const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

let commands = {};
function register(newCmds){
    commands = Object.assign(commands, newCmds);
}

register(require('./commands/music'));
register(require('./commands/rng'));
register(require('./commands/meme'));

const client = new Discord.Client();

//todo more rejects! Handle it!

async function parseMessage(msg){

    let commandName = msg.content.split(' ')[0];
    if (typeof commands[commandName] !== 'undefined'){

        if (!msg.channel.name.includes('bot') && false) {
            let dmChannel = msg.author.dmChannel;
            if (dmChannel === null) {
                dmChannel = await msg.author.createDM();
            }

            dmChannel.send("i can only be used in the bot channel, fool!");
            msg.delete();
            return;
        }

        try {
            commands[commandName].execute(msg);
        }catch (error){
            msg.channel.send('Uh oh! I encountered an error. ```'+error+'```');
        }
    }
}

client.on('message', msg => {
    parseMessage(msg).then();
});

client.login(keys.discord).then(
    console.log(`Logged in!`)
);