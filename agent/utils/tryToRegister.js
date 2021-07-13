const signale = require('signale');

const { tryToConnectInterval } = require('../config');
const { registerMe } = require('../api/registerMe');

async function tryToRegister() {
    // signale.await('Try to register...');

    /** Попытка регистрации */
    const connected = await registerMe();

    if (!connected) {
        /** Следующая попытка */
        setTimeout(tryToRegister, tryToConnectInterval);
    } else {
        /** Успешная регистрация */
        signale.success('Registration completed!');
    }
}

module.exports = { tryToRegister };
