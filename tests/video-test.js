const fs = require('fs');
const ytdl = require('ytdl-core');

let tag = 'eh7lp9umG2I';
let url = 'https://www.youtube.com/watch?v='+tag;
ytdl(url, {filter: 'audioonly'})
    .pipe(fs.createWriteStream(tag+'.mp3'));