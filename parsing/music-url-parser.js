const ytSearch = require('../libs/youtube-wrapper');
const spotify = require('../libs/spotify-wrapper');

module.exports = async function (s) {
    let url;
    if (!s.includes("youtube.com") || s.includes("spotify:")) {
        let search = "";

        if (s.includes("spotify:")) {
            let [name, spotifyId] = await spotify.parseNameAndIdFromURI(s);
            search = await spotify.getRandomSongDescriptionFromPlayist(
                name, spotifyId
            );
        } else {
            search = s;
        }

        let searchResults = await ytSearch(search);
        url = searchResults['link'];
    } else {
        url = s;
    }

    return url;
};