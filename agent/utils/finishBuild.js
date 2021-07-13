const signale = require('signale');

const { sendResult } = require('../api/sendResult');
const { tryToRegister } = require('./tryToRegister');

async function finishBuild({ id, status, log, duration }) {
    signale.await('Sending results...');

    /** Отправка результатов */
    const sended = await sendResult({ id, status, log, duration });

    if (!sended) {
        signale.error('Results was not sended!');

        /** Результаты не отправлениы, регистрируемся заново */
        signale.await('Waiting for registration...');
        tryToRegister();
    } else {
        /** Всё получилось */
        signale.success('Results was sended!');
    }
}

module.exports = { finishBuild };
