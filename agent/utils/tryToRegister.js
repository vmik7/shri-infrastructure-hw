const signale = require('signale');

const { tryToConnectInterval } = require('../config');
const { registerMe } = require('../api/registerMe');

async function tryToRegister() {
    // signale.await('Try to register...');

    const connected = await registerMe();

    if (!connected) {
        setTimeout(tryToRegister, tryToConnectInterval);
    } else {
        signale.success('Registration completed!');
    }
}

module.exports = { tryToRegister };
