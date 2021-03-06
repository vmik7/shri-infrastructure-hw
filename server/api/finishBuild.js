const { axiosInstance } = require('../config');

async function finishBuild({ buildId, duration, success, buildLog }) {
    try {
        const response = await axiosInstance.post('/build/finish', {
            buildId,
            duration,
            success,
            buildLog,
        });

        if (response.status !== 200) {
            console.error(
                'FinishBuild finished with the status',
                response.status,
            );
            return null;
        }

        return response.status;
    } catch (err) {
        console.error('FinishBuild error!', err);
        return null;
    }
}

module.exports = { finishBuild };
