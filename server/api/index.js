const { fetchSettings } = require('./fetchSettings');

const { fetchBuilds } = require('./fetchBuilds');
const { fetchBuildDetails } = require('./fetchBuildDetails');

const { requestBuild } = require('./requestBuild');
const { startBuild } = require('./startBuild');
const { finishBuild } = require('./finishBuild');
const { cancelBuild } = require('./cancelBuild');

module.exports = {
    fetchSettings,
    fetchBuilds,
    fetchBuildDetails,
    requestBuild,
    startBuild,
    finishBuild,
    cancelBuild,
};
