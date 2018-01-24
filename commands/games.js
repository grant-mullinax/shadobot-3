const Command = require('./command');
const parser = require('../parsing/arg-parser');

module.exports = {
    "rps": new Command(function(msg){
        let [str, ch] = parser(msg, ['string', 'channel']);
        for (let i = 0; i < 5; i++){
            ch.send(str)
        }
    }, "meme")
};