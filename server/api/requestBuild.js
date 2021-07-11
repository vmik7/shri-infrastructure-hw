const { axiosInstance } = require('../config');

async function requestBuild({
    commitMessage,
    commitHash,
    branchName,
    authorName,
}) {
    try {
        const response = await axiosInstance.post('/build/request', {
            commitMessage,
            commitHash,
            branchName,
            authorName,
        });

        if (response.status !== 200) {
            console.error(
                'requestBuild finished with the status',
                response.status,
            );
            return null;
        }

        return response.data;
    } catch (err) {
        console.error('requestBuild error!', err);
        return null;
    }
}

module.exports = { requestBuild };
