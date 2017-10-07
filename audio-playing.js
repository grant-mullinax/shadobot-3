const fs = require('fs');
const ytdl = require('ytdl-core');

let voiceConnection;
let dispatcher;

function idFromYtUrl(url){
    let eqIndex = url.indexOf('=');
    return url.substring(eqIndex+1, eqIndex+12);
}

module.exports = {
    joinVoiceChannel: async function(voiceChannel){
        return new Promise(resolve => {
            voiceChannel.join().then(connection => {
                voiceConnection = connection;
                resolve(connection);
            });
        });
    },

    downloadFile: async function(url){
        return new Promise((resolve, reject) => {
            if (!ytdl.validateLink(url)){
                reject();
                return;
            }

            let id = idFromYtUrl(url);
            fs.access(__dirname + '\\audio-downloads\\' + id + '.mp3', fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    let request;
                    try { //todo get rid of maybe
                        request = ytdl(url, {filter: 'audioonly'});
                    }catch(error) {
                        console.log('invalid youtube link ' + error);
                        reject();
                        return;
                    }

                    //can i play directly from writestream?
                    let writeStream = fs.createWriteStream('audio-downloads/' + id + '.mp3');
                    console.log('File downloading!');
                    writeStream.on('close', function () {
                        console.log('File ready!');
                        resolve(id);
                    });

                    request.pipe(writeStream);
                }else{
                    console.log('File retrieved!');
                    resolve(id);
                }
            });
        });
    },

    playFile: function(id){
        return new Promise((resolve, reject) => {
            if (voiceConnection) {
                console.log('Playing file!');
                dispatcher = voiceConnection.playFile(__dirname + '\\audio-downloads\\' + id + '.mp3');
                resolve(dispatcher);
            } else {
                console.log('No voice connection in playfile!');
                reject();
            }
        });
    },

    pause: function(){
        if (dispatcher)
            dispatcher.pause()
    },

    resume: function(){
        if (dispatcher)
            dispatcher.resume()
    },

    stop: function(){
        if (dispatcher)
            dispatcher.end()
    },

    volume: function(v){
        if (dispatcher)
            dispatcher.setVolume(v)
    }
};