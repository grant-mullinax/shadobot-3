const keys = require('./api-keys');

let search = require('youtube-search');
const util = require('util');

let opts = {
    maxResults: 1,
    key: keys.youtube
};

module.exports = async function (query) {
    return new Promise((resolve, reject) => {
        search(query, opts, function(err, results) {
            if(err){
                console.log("error pasring youtube search: "+ err);
                reject();
                return;
            }

            for (let i=0; i<10;i++){
                let item = results[i];
                if (item['kind'] = 'youtube#video'){
                    resolve(item);
                    return;
                }
            }
        });
    });
};