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
                reject(new Error("error pasring youtube search: "+ err));
                return;
            }

            for (let i=0; i<10;i++){
                let item = results[i];
                if (!item){
                    reject(new Error("cannot find video for search"));
                    return;
                }

                if (item['link'].includes('watch?v')){
                    resolve(item);
                    return;
                }
            }
        });
    });
};