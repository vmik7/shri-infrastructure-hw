const signale = require('signale');

const { sendResult } = require('../api/sendResult');
const { tryToRegister } = require('./tryToRegister');

async function finishBuild() {
    signale.start('Sending results...');
    const sended = await sendResult();

    if (!sended) {
        signale.error('Results was not saved!');
        signale.await('Waiting for registration...');
        tryToRegister();
    } else {
        signale.success('Results was sended!');
    }
}

module.exports = { finishBuild };
