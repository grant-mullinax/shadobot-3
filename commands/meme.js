const Command = require('./command');
const parser = require('./arg-parser');

module.exports = {
    "xxdd": new Command(function(msg){
        let [str, ch] = parser(msg, ['string', 'channel']);
        for (let i = 0; i < 5; i++){
            ch.send(str)
        }
    }, "meme"),
    "crash-bandicoot": new Command(function(msg){
        let a = null;
        a.value = 3;
    }, "meme"),
};