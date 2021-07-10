const { axiosInstance } = require('../config');

async function fetchBuilds({ offset, limit } = {}) {
    const params = {};
    if (offset) {
        params.offset = offset;
    }
    if (limit) {
        params.limit = limit;
    }

    try {
        const response = await axiosInstance.get('/build/list', { params });

        if (response.status === 200) {
            return response.data;
        }

        console.error('Fetch builds response has a status', response.status);
        return false;
    } catch (err) {
        console.error('Fetch builds error!', err);
        return false;
    }
}

module.exports = { fetchBuilds };
