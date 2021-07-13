// const signale = require('signale');
const serverData = require('../data');

const { eventEmmiter, actions } = serverData;

function notifyAgent(req, res) {
    // signale.log('A new agent found!');
    // signale.log('data:', req.body);

    const { host, port } = req.body;
    eventEmmiter.emit(actions.agentNotified, { host, port });

    res.status(200).end();
}

async function notifyBuildResult(req, res) {
    // signale.log('Build results was received!');
    // signale.log('data:', req.body);

    const { id, status, log, duration } = req.body;

    /* Если агент не зарегистрирован - игнорируем запрос */
    const agentUrl = serverData.agentByBuildId.get(id);
    if (!agentUrl) {
        res.status(404).end();
        return;
    }

    eventEmmiter.emit(actions.agentFinished, { id, status, log, duration });

    res.status(200).end();
}

module.exports = { notifyAgent, notifyBuildResult };
