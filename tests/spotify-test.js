const spotify = require('../libs/spotify');

setTimeout(function () {
    spotify.getRandomSongDescriptionFromPlayist(0,1);
},1000);