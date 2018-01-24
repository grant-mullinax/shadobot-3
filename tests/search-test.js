let search = require('../libs/youtube-wrapper');
const util = require('util')

async function test() {
    console.log(util.inspect(await search('jacksepticeye'), false, null))
}

test().then();
