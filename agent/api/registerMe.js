const { PORT, axiosInstance } = require('../config');

async function registerMe() {
    try {
        const response = await axiosInstance.post('/notify-agent', {
            host: 'localhost',
            port: PORT,
        });
        return response.status === 200;
    } catch {
        return false;
    }
}

module.exports = { registerMe };
