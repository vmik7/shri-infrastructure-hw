const { axiosInstance } = require('../config');

async function cancelBuild({ buildId }) {
    try {
        const response = await axiosInstance.post('/build/cancel', { buildId });
        if (response.status !== 200) {
            console.error(
                'CancelBuild finished with the status',
                response.status,
            );
            return null;
        }
        return response.status;
    } catch (err) {
        console.error('CancelBuild error!', err);
        return null;
    }
}

module.exports = { cancelBuild };
