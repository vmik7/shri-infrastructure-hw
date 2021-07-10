const { axiosInstance } = require('../config');

async function fetchSettings() {
    try {
        const response = await axiosInstance.get('/conf');

        if (response.status === 200) {
            return response.data;
        }

        console.error('Settings fetch finished with a status', response.status);
        return false;
    } catch (err) {
        console.error('Settings fetch error!', err);
        return false;
    }
}

module.exports = { fetchSettings };
