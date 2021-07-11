const { axiosInstance } = require('../config');

async function startBuild({ buildId, dateTime }) {
    try {
        const response = await axiosInstance.post('/build/start', {
            buildId,
            dateTime,
        });

        if (response.status !== 200) {
            console.error(
                'StartBuild finished with the status',
                response.status,
            );
            return null;
        }

        return response.status;
    } catch (err) {
        console.error('StartBuild error!', err);
        return null;
    }
}

module.exports = { startBuild };
