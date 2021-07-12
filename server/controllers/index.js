// const signale = require('signale');

const { eventEmmiter, actions } = require('../data');

function notifyAgent(req, res) {
    // console.log('A new agent found!');
    // console.log('data:', req.body);

    const { host, port } = req.body;
    eventEmmiter.emit(actions.agentNotified, { host, port });

    res.status(200).end();
}

async function notifyBuildResult(req, res) {
    // console.log('Build results was received!');
    // console.log('data:', req.body);

    const { id, status, log, duration } = req.body;
    eventEmmiter.emit(actions.agentFinished, { id, status, log, duration });

    res.status(200).end();
}

module.exports = { notifyAgent, notifyBuildResult };
