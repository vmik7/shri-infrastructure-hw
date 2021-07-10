const { settings, agents, agentByBuildId } = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');

async function checkProcessed() {
    console.log('[checkProcessed]');

    // достаём сборки из базы данных
    const { data: allBuilds } = await fetchBuilds();

    if (!allBuilds) {
        // не удалось получить список сборок
        console.error('Не удалось получить список сборок!');
        return;
    }

    // выбирам сборки, которые в статусе InProgress
    const processedBuilds = allBuilds.filter(
        (build) => build.status === 'InProgress',
    );

    let buildsToRestart = [];
    for (const build of processedBuilds) {
        const agent = agentByBuildId(build.id);
        if (!(await agent.isAlive())) {
            buildsToRestart.push(build);
        }
    }
    buildsToRestart = buildsToRestart.reverse();

    // счётчик агентов
    let agentIndex = 0;
    let indexToRestart = 0;

    while (indexToRestart < buildsToRestart.length) {
        const { id, commitHash } = buildsToRestart[indexToRestart];

        while (agentIndex < agents.length && !agents[agentIndex].isFree) {
            agentIndex++;
        }
        if (agentIndex >= agents.length) {
            // все агенты заняты, выходим
            break;
        }

        const agent = agents[agentIndex];

        const isStarted = agent.build({
            id,
            repoUrl: settings.repoUrl,
            commitHash,
            buildCommand: settings.buildCommand,
        });
        if (isStarted) {
            // запуск успешен

            agentByBuildId.set(id, agent);
            agent.isFree = false;

            console.log('Current agents:', agents);

            indexToRestart++;
            agentIndex++;
        } else if (!(await agent.isAlive())) {
            console.error('Не удалось запустить сборку, агент не отвечает!');

            agents.splice(agentIndex, 1);
        } else {
            console.error('Не удалось запустить сборку, но агент жив!');

            agentIndex++;
        }
    }
}

module.exports = { checkProcessed };
