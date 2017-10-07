const music = require('./audio-playing');
let ytSearch = require('./youtube-search-wrapped');
const parser = require('./arg-parser');

class Command{
    constructor(execute, description){
        this.execute = execute;
        this.description = description;
    }
}

module.exports = {
    "play": new Command(async function(msg){
        let [url, voiceChannel, channel] = parser(msg, ['string','voiceChannel','channel']);
        if (!url.includes("youtube.com")){
            let searchResults = await ytSearch(msg.content.substring(msg.content.indexOf(' ') + 1));
            url = searchResults['link']
            channel.send("Now playing... "+url);
        }
        await music.joinVoiceChannel(voiceChannel);
        let id = await music.downloadFile(url);
        await music.playFile(id);
    }, "plays music"),
    "volume": new Command(function(msg){
        let [volumeString] = parser(msg, ['string']);
        music.volume(parseInt(volumeString)/100);
    }, "changes volume of music"),
    "stop": new Command(function(){
        music.stop()
    }, "stops music"),
    "pause": new Command(function(){
        music.pause()
    }, "pauses music"),
    "resume": new Command(function(){
        music.resume()
    }, "resumes music"),
    "xxdd": new Command(function(msg){
        let [str, ch] = parser(msg, ['string', 'channel']);
        for (let i = 0; i < 5; i++){
            ch.send(str)
        }
    }, "meme"),
    "crash-bandicoot": new Command(function(msg){
        let a = null;
        a.value = 3;
    }, "meme")
};