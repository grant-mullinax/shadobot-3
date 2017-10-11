const keys = require('./libs/api-keys');

const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const baseCommands = require('./commands');

let commands = baseCommands;

const client = new Discord.Client();

//todo more rejects! Handle it!

async function parseMessage(msg){
    let commandName = msg.content.split(' ')[0];
    if (typeof commands[commandName] !== 'undefined'){
        if (msg.channel.name.includes('bot')){
            try {
                commands[commandName].execute(msg);
            }catch (error){
                msg.channel.send('Uh oh! I encountered an error. ```'+error+'```');
            }
        }else{
            let dmChannel = msg.author.dmChannel;
            if (dmChannel === null) {
                dmChannel = await msg.author.createDM();
            }

            dmChannel.send("i can only be used in the bot channel, fool!");
            msg.delete();
        }
    }
}

client.on('message', msg => {
    parseMessage(msg).then();
});

client.login(keys.discord).then(
    console.log(`Logged in!`)
);