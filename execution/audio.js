const fs = require('fs');
const ytdl = require('ytdl-core');
const opus = require('opusscript');

let voiceConnection;

//todo more servers!

module.exports = {
    /*recordAudio: async function(user){
        if (!voiceConnection)
            return;

        if (!voiceReceiver){
            voiceReceiver = voiceConnection.createReceiver();
        }
        let opusStream = voiceReceiver.createOpusStream(user);

        let samplingRate = 48000;
        let frameDuration = 20;
        let channels = 2;

        let encoder = new opus(samplingRate, channels, opus.Application.VOIP);
        let frameSize = samplingRate * frameDuration / 1000;

        let decoded;
        setTimeout(async function () {
            //console.log(opusStream);
            decoded = encoder.decode(opusStream);
            //console.log(decoded);
        }, 5000);
    },*/

    joinVoiceChannel: async function(voiceChannel){
        if (voiceConnection)
            if (voiceConnection.channel === voiceChannel) {
                return voiceConnection;
            }

        if (voiceConnection)
            voiceConnection.dispatcher.end();

        voiceChannel.join().then(connection => {
            voiceConnection = connection;
            return connection;
        });
    },

    getAudioFromUrl: async function(url){
        return new Promise((resolve, reject) => {
            if (!ytdl.validateURL(url)){
                reject();
                return;
            }

            let id = ytdl.getURLVideoID(url);
            fs.access(__dirname + '\\audio-downloads\\' + id + '.mp3', fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    let request;
                    try { //todo get rid of maybe
                        request = ytdl(url, {filter: 'audioonly'});
                    }catch(error) {
                        reject(new Error('invalid youtube link caused error : ' + error));
                        return;
                    }

                    //can i play directly from writestream?
                    let writeStream = fs.createWriteStream('audio-downloads/' + id + '.mp3');

                    /*writeStream.on('close', function () {
                        console.log('File ready!');
                        resolve(id);
                    });*/

                    let tryout = function () {
                        if (writeStream.bytesWritten>1000)
                            resolve(id);
                        else
                            setTimeout(tryout, 200);
                    };
                    request.pipe(writeStream);
                    setTimeout(tryout, 200);
                }else{
                    //console.log('File retrieved!');
                    resolve(id);
                }
            });
        });
    },

    playFile: async function(id){
        return new Promise((resolve, reject) => {
            if (voiceConnection) {
                console.log('Playing file! .\\audio-downloads\\' + id + '.mp3');
                voiceConnection.playFile('.\\audio-downloads\\' + id + '.mp3');
                voiceConnection.dispatcher.setVolume(0.2);
                resolve(voiceConnection.dispatcher);
            } else {
                reject(new Error('No voice connection in playfile!'));
            }
        });
    },

    pause: function(){
        if (voiceConnection.dispatcher)
            voiceConnection.dispatcher.pause();
    },

    resume: function(){
        if (voiceConnection.dispatcher)
            voiceConnection.dispatcher.resume();
    },

    stop: function() {
        if (voiceConnection.dispatcher)
            voiceConnection.dispatcher.end();
    },

    disconnect: function(){
        if (voiceConnection) {
            voiceConnection.disconnect();
            voiceConnection = null;
        }
    },

    volume: function(v){
        if (voiceConnection.dispatcher)
            voiceConnection.dispatcher.setVolume(v)
    },

    isPlaying: function () {
        if (voiceConnection.dispatcher)
            return voiceConnection.dispatcher.isPlaying();
    }
};