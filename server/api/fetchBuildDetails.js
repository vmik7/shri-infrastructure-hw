const { axiosInstance } = require('../config');

async function fetchBuildDetails({ buildId }) {
    try {
        const response = await axiosInstance.get('/build/details', {
            params: {
                buildId,
            },
        });

        if (response.status !== 200) {
            console.error(
                'Fetch details response has a status',
                response.status,
            );
            return null;
        }

        return response.data;
    } catch (err) {
        console.error('Fetch details error!', err);
        return null;
    }
}

module.exports = { fetchBuildDetails };
