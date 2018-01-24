const Command = require('./command');
const parser = require('../parsing/arg-parser');
const music = require('../execution/audio');

module.exports = {
    "rook.mp3": new Command(async function(msg){
        let [voiceChannel, channel] = parser(msg, ['voiceChannel', 'channel']);

        await music.joinVoiceChannel(voiceChannel);
        let id = await music.getAudioFromUrl("https://www.youtube.com/watch?v=2cjbSgy3vSw");

        let dispatcher = await music.playFile(id);
    }, "youre going to love this, trust me."),
    "jihad": new Command(async function(msg){
        let [voiceChannel, channel] = parser(msg, ['voiceChannel', 'channel']);

        await music.joinVoiceChannel(voiceChannel);
        let id = await music.getAudioFromUrl("https://www.youtube.com/watch?v=4cSJyZp6quQ");

        let dispatcher = await music.playFile(id);
    }, "salil swarim."),
    "xxdd": new Command(function(msg){
        let [str, ch] = parser(msg, ['string', 'channel']);
        for (let i = 0; i < 5; i++){
            ch.send(str)
        }
    }, "meme"),
    "crash-bandicoot": new Command(function(msg){
        let a = null;
        a.value = 3;
    }, "meme"),
};