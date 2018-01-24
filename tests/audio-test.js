voiceChannel.join().then(connection => {
    connection.playFile(__dirname + '\\audio-downloads\\' + id + '.mp3');
});