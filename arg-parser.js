module.exports = function(msg, argTypes){
    let splitMsg = msg.content.split(" ");
    let args = [];
    let userInputIndex = 1; //0 is command name
    for (let i = 0; i < argTypes.length; i++) {
        let argType = argTypes[i];

        switch (argType.toLowerCase()){
            case 'member':
                args.push(msg.member);
                break;
            case 'voicechannel':
                args.push(msg.member.voiceChannel);
                break;
            case 'string':
                args.push(splitMsg[userInputIndex]);
                userInputIndex++;
                break;
            case 'channel':
                args.push(msg.channel);
                break;
        }
    }
    return args;
};