const { axiosInstance } = require('../config');

async function fetchBuildDetails(id) {
    try {
        const response = await axiosInstance.get('/build/details', {
            params: {
                buildId: id,
            },
        });

        if (response.status === 200) {
            return response.data;
        }

        console.error('Fetch details response has a status', response.status);
        return false;
    } catch (err) {
        console.error('Fetch details error!', err);
        return false;
    }
}

module.exports = { fetchBuildDetails };
