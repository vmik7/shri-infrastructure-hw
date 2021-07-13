const signale = require('signale');

const serverData = require('../data');

/**
 * Проверяет всех зарегистрированных агентов, живы ли они
 * @returns {undefined}
 */
async function checkAgents() {
    // signale.start('checkAgents');

    const { agents } = serverData;

    for (const agentUrl of agents.keys()) {
        const agent = agents.get(agentUrl);

        if (agent.buildId && (await !agent.isAlive())) {
            const { buildId, commitHash } = agent;
            serverData.rebuildQueue.push({ buildId, commitHash });

            agents.delete(agentUrl);

            signale.error(
                `Agent ${agentUrl} disconnected! Build ${buildId} will be rebuilded`,
            );
        }
    }
}

module.exports = { checkAgents };
