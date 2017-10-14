const spotify = require('../libs/spotify-wrapper');

setTimeout(function () {
    spotify.getRandomSongDescriptionFromPlayist(0,1);
},1000);