const Command = require('./command');
const parser = require('./arg-parser');

const music = require('../audio-playing');
const ytSearch = require('../libs/youtube-wrapper');
const spotify = require('../libs/spotify-wrapper');


let queue = [];
let playingMusic = false;
let spotifyPlaylist = ""; //todo less bad

async function playNextInQueue() {
    if (queue.length>0){
        let dispatcher = await music.playFile(queue.shift());
        dispatcher.on('end',playNextInQueue);
    }else{
        playingMusic = false;
    }
}

async function playNextSongFromSpotifyPlaylist(){
    if (spotifyPlaylist!==""){
        let [name, spotifyId] = spotify.parseNameAndIdFromURI(spotifyPlaylist);
        search = await spotify.getRandomSongDescriptionFromPlayist(
            name, spotifyId
        );

        let searchResults = await ytSearch(search);
        let url = searchResults['link'];
        let id = await music.downloadFile(url);

        let dispbatcher = await music.playFile(id);
        dispbatcher.on('end', playNextSongFromSpotifyPlaylist);
    }
}


//todo add search, download, and play func
//todo ignore playlists

module.exports = {
    "spotify": new Command(async function (msg) {
        let [playlist, member, voiceChannel, channel] = parser(msg, ['string','member','voiceChannel', 'channel']);
        if (!playlist.includes("spotify"))
            return;

        await music.joinVoiceChannel(voiceChannel);

        spotifyPlaylist = playlist;
        playNextSongFromSpotifyPlaylist().then();
        channel.send("Now playing "+member.displayName+"'s playlist on shuffle!");
    }, "plays a spotify playlist"),
    "play": new Command(async function (msg) {
        let [voiceChannel, channel] = parser(msg, ['voiceChannel', 'channel']);

        let param = msg.content.substring(msg.content.indexOf(' ') + 1);
        let url;
        if (!param.includes("youtube.com") || param.includes("spotify")) {
            let search = "";

            if (param.includes("spotify")) {
                let [name, spotifyId] = spotify.parseNameAndIdFromURI(param);
                search = await spotify.getRandomSongDescriptionFromPlayist(
                    name, spotifyId
                );
            } else {
                search = param;
            }

            let searchResults = await ytSearch(search);
            url = searchResults['link'];
        } else {
            url = param;
        }
        await music.joinVoiceChannel(voiceChannel);
        let id = await music.downloadFile(url);

        if (playingMusic) {
            queue.push(id);
            channel.send('Added '+url+' to the queue!');
        }else{
            playingMusic = true;
            let dispatcher = await music.playFile(id);
            dispatcher.on('end', playNextInQueue);
            channel.send('Now playing '+url+' !');
        }
    }, "plays music"),
    "volume": new Command(function (msg) {
        let [volumeString] = parser(msg, ['string']);
        music.volume(parseInt(volumeString) / 100);
    }, "changes volume of music"),
    "skip": new Command(function () {
        music.stop()
    }, "skips music"),
    "stop": new Command(function () {
        spotifyPlaylist = "";
        queue = [];
        music.stop()
    }, "stops music"),
    "pause": new Command(function () {
        music.pause()
    }, "pauses music"),
    "resume": new Command(function () {
        music.resume()
    }, "resumes music"),
    "clear": new Command(function (msg) {
        queue = [];
        msg.channel.send("The queue has been cleared!");
    }, "clears the queue"),
    "display": new Command(function (msg) {
        let text = "The songs in queue are: \n ```";
        for (let i = 0; i < queue.length; i++){
            text += "https://www.youtube.com/watch?v=" + queue[i]
        }
        text += "```";
        msg.channel.send(text);
    }, "displays the content of the queue in chat"),
    "disconnect": new Command(function () {
        music.disconnect()
    }, "disconnects the bot"),
    "rec": new Command(function (msg) {
        music.recordAudio(msg.author)
    }, "records")
};