const spotifyApi = require('spotify-web-api-node');
const keys = require('./api-keys');

const api = new spotifyApi(keys.spotify);

api.clientCredentialsGrant()
    .then(function(data) {
       api.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Spotify lib token error ', err);
    });

module.exports = {
    getRandomSongDescriptionFromPlayist: async function (user, id) {
        console.log(user, id);
        return new Promise((resolve, reject) => {
            //wew lad
            //gotta get the total list
            //todo make less stupid
            api.getPlaylistTracks(user, id, {'fields': 'total'}).then(function (lengthData) {
                let length = lengthData.body['total'];
                let index = Math.ceil(Math.random() * length);
                api.getPlaylistTracks(user, id, {'offset': index, 'limit': 1, 'fields': 'items'}).then(function (data) {
                    //console.log(data.body);
                    let items = data.body['items'];
                    let item = items[0];
                    let track = item['track'];
                    resolve(track['name'] + ' - ' + track['artists'][0]['name'])
                }, function (err) {
                    console.log('Spotify lib error ', err);
                });
            });
        });
    },
    parseNameAndIdFromURI: function (str) {
        const userEndIndex = str.indexOf(":user:") + 6; //add for str len
        const playlistStartIndex = str.indexOf(":playlist:");
        return [str.substring(userEndIndex, playlistStartIndex), str.substring(playlistStartIndex + 10)]
    }
};