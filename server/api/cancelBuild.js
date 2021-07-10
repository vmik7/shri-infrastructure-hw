const { axiosInstance } = require('../config');

async function cancelBuild(buildId) {
    try {
        const response = await axiosInstance.post('/build/cancel', { buildId });
        if (response.status !== 200) {
            console.error(
                'CancelBuild finished with the status',
                response.status,
            );
        }
        return response.status === 200;
    } catch (err) {
        console.error('CancelBuild error!', err);
        return false;
    }
}

module.exports = { cancelBuild };
