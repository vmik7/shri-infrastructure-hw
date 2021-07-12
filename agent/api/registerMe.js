const signale = require('signale');

const { PORT, axiosInstance } = require('../config');

async function registerMe() {
    try {
        const response = await axiosInstance.post('/notify-agent', {
            host: 'localhost',
            port: PORT,
        });
        if (response.status === 200) {
            return true;
        }
        // signale.error('Register fault! Status', response.status);
        return false;
    } catch (err) {
        // signale.error('Register fault!', err);
        return false;
    }
}

module.exports = { registerMe };
