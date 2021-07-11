const { axiosInstance } = require('../config');

async function fetchSettings() {
    try {
        const response = await axiosInstance.get('/conf');

        if (response.status !== 200) {
            console.error(
                'Settings fetch finished with a status',
                response.status,
            );
            return null;
        }

        return response.data;
    } catch (err) {
        console.error('Settings fetch error!', err);
        return null;
    }
}

module.exports = { fetchSettings };
