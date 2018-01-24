const Command = require('./command');
const parser = require('../parsing/arg-parser');

module.exports = {
    "slots": new Command(function(msg){
        let [member, ch] = parser(msg, ['member', 'channel']);
        const slotOpts = [':lemon:', ':strawberry:', ':grapes:', ':tangerine:', ':cherries:']; //':apple:'
        let won = true;
        let rand, lastRand = -1;
        let response = "";
        for (let i = 0; i < 3; i++){
            rand = Math.floor(Math.random()*slotOpts.length);
            response += " "+slotOpts[rand];
            if (rand !== lastRand && lastRand !== -1)
                won = false;

            lastRand = rand;
        }

        ch.send('**[' + response + ']**\n' + member.displayName +(won ? " wins! :confetti_ball:" : " loses!"));
    }, "hit the slots"),
    "roll": new Command(function(msg){
        let [str, member, ch] = parser(msg, ['string', 'member', 'channel']);
        let [count, suffix] = str.split('d');
        let [limit, bonus] = suffix.split('+');
        let total = 0;

        if (count>1000 || limit>10000){
            ch.send('woah. relax.');
            return;
        }

        for (let i = 0; i<count;i++)
            total += Math.ceil(Math.random() * (parseInt(limit) || 0));

        total += parseInt(bonus) || 0;

        ch.send('**' + member.displayName + ' rolled a '+total + '**');
    }, "roll a D&D die")
};