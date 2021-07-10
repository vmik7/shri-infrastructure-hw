const { Agent } = require('../data/Agent');
const { agents, agentByBuildId } = require('../data');
const { finishBuild } = require('../api/finishBuild');
const { fetchBuildDetails } = require('../api/fetchBuildDetails');

function notifyAgent(req, res) {
    console.log('A new agent found!');
    console.log('data:', req.body);

    const { host, port } = req.body;
    agents.push(new Agent(host, port));

    console.log('Current agents:', agents);

    res.status(200).end();
}

async function notifyBuildResult(req, res) {
    console.log('Build results was received!');
    console.log('data:', req.body);

    const { id, status, log } = req.body;

    const {
        data: { status: dbStatus, start },
    } = await fetchBuildDetails(id);

    // if (dbStatus === 'InProgress') {
    //     await finishBuild({
    //         buildId: id,
    //         duration: Date.now() - new Date(start).valueOf(),
    //         success: status === 0,
    //         buildLog: log,
    //     });
    // }

    const agent = agentByBuildId.get(id);
    agent.isFree = true;

    console.log('Current agents:', agents);

    res.status(200).end();
}

module.exports = { notifyAgent, notifyBuildResult };
