const delay = require('delay');

const { tryToConnectInterval } = require('../config');
const { registerMe } = require('../api/registerMe');

async function waitForRegister() {
    console.log('Try to register...');
    let connected = await registerMe();
    while (!connected) {
        console.log('Registration failed!');
        await delay(tryToConnectInterval);

        console.log('Try to register...');
        connected = await registerMe();
    }

    console.log('Registration completed!');
}

module.exports = { waitForRegister };
