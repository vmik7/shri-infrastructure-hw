const signale = require('signale');

const serverData = require('../data');
const { checkSettings } = require('./checkSettings');
const { fetchWaiting } = require('./fetchWaiting');
const { findPastBuilds } = require('./findPastBuilds');
const { getLastCommit } = require('./getLastCommit');
const { checkAgents } = require('./checkAgents');
const { distributeBuilds } = require('./distributeBuilds');

async function lifeCycle() {
    // signale.start('lifeCycle');

    const { actions, eventEmmiter } = serverData;

    const settingsChanged = await checkSettings();

    if (settingsChanged) {
        serverData.mainQueue = [];
        await getLastCommit();
        await findPastBuilds();
        eventEmmiter.emit(actions.settingsChanged);
    }

    await fetchWaiting();
    await checkAgents();
    await distributeBuilds();

    setTimeout(lifeCycle, 0);
}

module.exports = { lifeCycle };
