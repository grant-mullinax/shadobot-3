const music = require('./audio-playing');
const ytSearch = require('./libs/youtube-search-wrapped');
const parser = require('./arg-parser');
const spotify = require('./libs/spotify');

class Command{
    constructor(execute, description){
        this.execute = execute;
        this.description = description;
    }
}

module.exports = {
    "play": new Command(async function(msg){
        let [param, voiceChannel, channel] = parser(msg, ['string','voiceChannel','channel']);
        let url;
        if (!param.includes("youtube.com") || param.includes("spotify")){
            let search = "";
            if (param.includes("spotify")){
                const userEndIndex = param.indexOf(":user:")+6; //add for str len
                const playlistStartIndex = param.indexOf(":playlist:");
                search = await spotify.getRandomSongDescriptionFromPlayist(
                    param.substring(userEndIndex, playlistStartIndex),
                    param.substring(playlistStartIndex+10)
                );
            }else{
                search = msg.content.substring(msg.content.indexOf(' ') + 1);
            }
            console.log(search);
            let searchResults = await ytSearch(search);
            url = searchResults['link'];
            channel.send("Now playing... "+url);
        }else{
            url = param;
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
    "rec": new Command(function(msg){
        music.recordAudio(msg.author)
    }, "records"),
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
    "slots": new Command(function(msg){
        let [member, ch] = parser(msg, ['member', 'channel']);
        const slotOpts = [':lemon:', ':strawberry:', ':grapes:', ':tangerine:', ':cherries:']; //':apple:'
        let won = true;
        let rand, lastRand = -1;
        let response = "";
        for (let i = 0; i < 3; i++){
            rand = Math.floor(Math.random()*slotOpts.length);
            response += " "+slotOpts[rand];
            if (rand !== lastRand && lastRand !== -1)
                won = false;

            lastRand = rand;
        }

        ch.send('**[' + response + ']**\n' + member.displayName +(won ? " wins! :confetti_ball:" : " loses!"));
    }, "hit the slots"),
    "roll": new Command(function(msg){
        let [str, member, ch] = parser(msg, ['string', 'member', 'channel']);
        let [count, suffix] = str.split('d');
        let [limit, bonus] = suffix.split('+');
        let total = 0;

        if (count>1000 || limit>10000){
            ch.send('woah. relax.');
            return;
        }

        for (let i = 0; i<count;i++)
            total += Math.ceil(Math.random() * (parseInt(limit) || 0));

        total += parseInt(bonus) || 0;

        ch.send('**' + member.displayName + ' rolled a '+total + '**');
    }, "roll a D&D die")
};