const { fetchSettings } = require('../api/fetchSettings');
const { settings } = require('../data');
const { cancelPastBuilds } = require('./cancelPastBuilds');
const { checkProcessed } = require('./checkProcessed');
const { distributeBuilds } = require('./distributeBuilds');

async function lifeCycle() {
    console.log('[lifeCycle starts]');

    const { data } = await fetchSettings();

    if (data && data.id !== settings.id) {
        settings.id = data.id;
        settings.period = data.period;
        settings.repoUrl = `https://github.com/${data.repoName}.git`;
        settings.buildCommand = data.buildCommand;
        settings.mainBranch = data.mainBranch;

        await cancelPastBuilds();
    }

    await checkProcessed();
    await distributeBuilds();

    setTimeout(lifeCycle, 10000);
}

module.exports = { lifeCycle };
