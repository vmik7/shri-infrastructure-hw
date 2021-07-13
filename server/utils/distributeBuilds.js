const signale = require('signale');

const serverData = require('../data');

/**
 * Распределяет задачи из очередей по свободным агентам
 * @returns {undefined}
 */
async function distributeBuilds() {
    // signale.start('distributeBuilds');

    const {
        settings: { repoUrl, buildCommand },
        agents,
        mainQueue,
        rebuildQueue,
        eventEmmiter,
        actions,
    } = serverData;

    /* Ищем свободных агентов */

    const freeAgents = [];

    agents.forEach((agent, agentUrl) => {
        if (agent.isFree()) {
            freeAgents.push(agentUrl);
        }
    });

    /* Распределяем задачи с очереди перезапуска */

    let agentIndex = 0;
    let currentBuildIndex = 0;

    while (currentBuildIndex < rebuildQueue.length) {
        const { id, commitHash } = rebuildQueue[currentBuildIndex];

        if (agentIndex >= freeAgents.length) {
            break;
        }

        const agent = agents.get(freeAgents[agentIndex]);

        if (
            await agent.build({
                id,
                repoUrl,
                commitHash,
                buildCommand,
            })
        ) {
            /* Агент запустился, запускаем events */
            eventEmmiter.emit(actions.agentStarted, {
                id,
                agentUrl: agent.getUrl(),
            });
            eventEmmiter.emit(actions.buildStarted, {
                buildId: id,
                dateTime: new Date().toISOString(),
            });
            currentBuildIndex++;
        } else {
            /* Агент не смог запустить сборку, забываем о нём навсегда */
            agents.delete(freeAgents[agentIndex]);
        }
        agentIndex++;
    }

    /* Удаляем перезапущенные задачи из очереди */
    rebuildQueue.splice(0, currentBuildIndex);

    /* Отчёт */
    if (currentBuildIndex) {
        signale.note(`Перезапущено ${currentBuildIndex} сборок`);
    }

    /* Распределяем задачи с очереди перезапуска */

    currentBuildIndex = 0;

    while (currentBuildIndex < mainQueue.length) {
        const { id, commitHash } = mainQueue[currentBuildIndex];

        if (agentIndex >= freeAgents.length) {
            break;
        }

        const agent = agents.get(freeAgents[agentIndex]);

        if (
            await agent.build({
                id,
                repoUrl,
                commitHash,
                buildCommand,
            })
        ) {
            /* Агент запустился, запускаем event */
            eventEmmiter.emit(actions.agentStarted, {
                id,
                agentUrl: agent.getUrl(),
            });
            eventEmmiter.emit(actions.buildStarted, {
                buildId: id,
                dateTime: new Date().toISOString(),
            });
            currentBuildIndex++;
        } else {
            /* Агент не смог запустить сборку, забываем о нём навсегда */
            agents.delete(freeAgents[agentIndex]);
        }
        agentIndex++;
    }

    /* Удаляем запущенные задачи из очереди */
    mainQueue.splice(0, currentBuildIndex);

    /* Отчёт */
    if (currentBuildIndex) {
        signale.note(`Запущено ${currentBuildIndex} сборок`);
    }
}

module.exports = { distributeBuilds };
