const signale = require('signale');

const { axiosInstance } = require('../config');
const { task } = require('../data');

async function sendResult() {
    const { id, status, log, duration } = task;

    try {
        const response = await axiosInstance.post('/notify-build-result ', {
            id,
            status,
            log,
            duration,
        });
        if (response.status === 200) {
            return true;
        }
        signale.error('Send result fault! Status', response.status);
        return false;
    } catch (err) {
        signale.error('Send result fault!', err);
        return false;
    }
}

module.exports = { sendResult };
