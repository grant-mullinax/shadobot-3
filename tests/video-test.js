const fs = require('fs');
const ytdl = require('ytdl-core');

let tag = 'eh7lp9umG2I';
let url = 'https://www.youtube.com/watch?v='+tag;

let ws = fs.createWriteStream(tag+'wowe.mp3');
ytdl(url, {filter: 'audioonly'}).pipe(ws);

console.log('File downloading!');
ws.on('close', function () {
    console.log('File ready!');
});