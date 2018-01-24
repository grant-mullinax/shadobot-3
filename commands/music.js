const Command = require('./command');
const parser = require('../parsing/arg-parser');
const parseMusic = require('../parsing/music-url-parser');

const audio = require('../execution/audio');
const ytSearch = require('../libs/youtube-wrapper');
const spotify = require('../libs/spotify-wrapper');

let queue = [];
let playingMusic = false;
let spotifyPlaylist = ""; //todo less bad
let spotifyChannel;

async function playNextInQueue() {
    if (queue.length>0){
        let dispatcher = await audio.playFile(queue.shift());
        dispatcher.on('end',playNextInQueue);
    }else{
        playingMusic = false;
    }
}

async function playNextSongFromSpotifyPlaylist(channel){
    if (spotifyPlaylist!==""){
        let [name, spotifyId] = spotify.parseNameAndIdFromURI(spotifyPlaylist);
        search = await spotify.getRandomSongDescriptionFromPlayist(
            name, spotifyId
        );

        let searchResults = await ytSearch(search);
        let url = searchResults['link'];
        let id = await audio.getAudioFromUrl(url);
        spotifyChannel.send("Now playing... "+ url +" from "+name+"'s playlist!\nWith search: "+search);
        let dispbatcher = await audio.playFile(id);
        dispbatcher.on('end', function() { playNextSongFromSpotifyPlaylist(channel).then() });
    }
}


//todo add search, download, and play func
//todo ignore playlists

module.exports = {
    "spotify": new Command(async function (msg) {
        let [playlist, member, voiceChannel, channel] = parser(msg, ['string','member','voiceChannel', 'channel']);
        if (!playlist.includes("spotify"))
            return;

        await audio.joinVoiceChannel(voiceChannel);

        spotifyPlaylist = playlist;
        spotifyChannel = channel;
        try {
            await playNextSongFromSpotifyPlaylist(channel);
        }catch (e){
            channel.send('An error has occured while trying to play a spotify playlist! Skipping...\n ``` ' + e + '```');
            audio.stop()
        }
        channel.send("Now playing "+member.displayName+"'s playlist on shuffle!");
    }, "plays a spotify playlist"),
    "play": new Command(async function (msg) {
        let [voiceChannel, channel] = parser(msg, ['voiceChannel', 'channel']);

        try {
            await audio.joinVoiceChannel(voiceChannel);

            let content = msg.content.substring(msg.content.indexOf(' ') + 1);
            let url = await parseMusic(content);
            let id = await audio.getAudioFromUrl(url);

            if (playingMusic) {
                queue.push(id);
                channel.send('Added ' + url + ' to the queue!');
            } else {
                playingMusic = true;
                let dispatcher = await audio.playFile(id);
                dispatcher.on('end', playNextInQueue);
                channel.send('Now playing ' + url + ' !');
            }
        }catch (e){
            channel.send('An error has occured while trying to play music! \n ``` ' + e + '```');
        }
    }, "plays music"),
    "volume": new Command(function (msg) {
        let [volumeString] = parser(msg, ['string']);
        audio.volume(parseInt(volumeString) / 100);
    }, "changes volume of music"),
    "skip": new Command(function () {
        audio.stop()
    }, "skips music"),
    "stop": new Command(function () {
        spotifyPlaylist = "";
        queue = [];
        audio.stop()
    }, "stops music"),
    "pause": new Command(function () {
        audio.pause()
    }, "pauses music"),
    "resume": new Command(function () {
        audio.resume()
    }, "resumes music"),
    "clear": new Command(function (msg) {
        queue = [];
        msg.channel.send("The queue has been cleared!");
    }, "clears the queue"),
    "escalators": new Command(function (msg) {
        let [repeat] = parser(msg, ['string']);
        repeat = parseInt(repeat);
        for (let i = 0; i<repeat;i++)
            setTimeout(function () {
                audio.volume(i*0.005);
            },200*i);
    }, "ESCALATORS ESCALATORS ESCALATORS!"),
    "display": new Command(function (msg) {
        let text = "The songs in queue are: \n ```";
        for (let i = 0; i < queue.length; i++){
            text += "https://www.youtube.com/watch?v=" + queue[i] + '\n'
        }
        text += "```";
        msg.channel.send(text);
    }, "displays the content of the queue in chat"),
    "disconnect": new Command(function () {
        audio.disconnect()
    }, "disconnects the bot"),
    "rec": new Command(function (msg) {
        audio.recordAudio(msg.author)
    }, "records")
};