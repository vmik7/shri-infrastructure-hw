const { axiosInstance } = require('../config');
const { task } = require('../data');

async function sendResult() {
    const { id, status, log } = task;
    console.log(id, status, log);
    try {
        const response = await axiosInstance.post('/notify-build-result ', {
            id,
            status,
            log,
        });
        return response.status === 200;
    } catch {
        return false;
    }
}

module.exports = { sendResult };
