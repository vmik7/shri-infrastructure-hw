const { settings, agents, agentByBuildId } = require('../data');
const { startBuild } = require('../api/startBuild');
const { fetchBuilds } = require('../api/fetchBuilds');

async function distributeBuilds() {
    console.log('[distributeBuilds]');

    // счётчик агентов
    let agentIndex = 0;

    // достаём сборки из базы данных
    const { data: allBuilds } = await fetchBuilds();

    if (!allBuilds) {
        // не удалось получить список сборок
        console.error('Не удалось получить список сборок!');
        return;
    }

    // выбирам сборки, которые в статусе Waiting и меняем порядок
    const waitingBuilds = allBuilds
        .filter((build) => build.status === 'Waiting')
        .reverse();

    console.log('Found', waitingBuilds.length, 'waiting builds.');

    let indexToStart = 0;
    while (indexToStart < waitingBuilds.length) {
        const { id, commitHash } = waitingBuilds[indexToStart];

        while (agentIndex < agents.length && !agents[agentIndex].isFree) {
            agentIndex++;
        }
        if (agentIndex >= agents.length) {
            // все агенты заняты, выходим
            console.log('Have no free agents (');
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

            // await startBuild({
            //     buildId: id,
            //     dateTime: new Date().toISOString(),
            // });

            indexToStart++;
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

module.exports = { distributeBuilds };
