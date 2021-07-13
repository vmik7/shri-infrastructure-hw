const signale = require('signale');

const serverData = require('../data');
const { Agent } = require('../data/Agent');
const {
    requestBuild,
    startBuild,
    finishBuild,
    cancelBuild,
} = require('../api');
const { findPastBuilds } = require('./findPastBuilds');

const { actions, agents, agentByBuildId } = serverData;

serverData.eventEmmiter

    /* Поменялись настройки */
    .on(actions.settingsChanged, (data) => {
        signale.star(actions.settingsChanged, ', data:', data);
        findPastBuilds();
    })

    /* Добавить сборку в очередь */
    .on(actions.buildRequested, async (data) => {
        // signale.star(actions.buildRequested, ', data:', data);

        const { commitMessage, commitHash, branchName, authorName } = data;
        if (
            !(await requestBuild({
                commitMessage,
                commitHash,
                branchName,
                authorName,
            }))
        ) {
            setTimeout(() => {
                serverData.eventEmmiter.emit(actions.buildRequested, {
                    commitMessage,
                    commitHash,
                    branchName,
                    authorName,
                });
            }, 1000);
        }
    })

    /* Сборка началась */
    .on(actions.buildStarted, async (data) => {
        // signale.star(actions.buildStarted, ', data:', data);

        const { buildId, dateTime } = data;

        if (!(await startBuild({ buildId, dateTime }))) {
            setTimeout(() => {
                serverData.eventEmmiter.emit(actions.buildStarted, {
                    buildId,
                    dateTime,
                });
            }, 1000);
        }
    })

    /* Сборка завершилась */
    .on(actions.buildFinished, async (data) => {
        // signale.star(actions.buildFinished, ', data:', data);

        const { buildId, duration, success, buildLog } = data;
        if (!(await finishBuild({ buildId, duration, success, buildLog }))) {
            setTimeout(() => {
                serverData.eventEmmiter.emit(actions.buildFinished, {
                    buildId,
                    duration,
                    success,
                    buildLog,
                });
            }, 1000);
        }
    })

    /* Сборка отменена */
    .on(actions.buildCanceled, async (data) => {
        // signale.star(actions.buildCanceled, ', data:', data);

        const { buildId } = data;
        if (!(await cancelBuild({ buildId }))) {
            setTimeout(() => {
                serverData.eventEmmiter.emit(actions.buildCanceled, {
                    buildId,
                });
            }, 1000);
        }
    })

    /* Агент зарегистрировался */
    .on(actions.agentNotified, (data) => {
        signale.star(actions.agentNotified, ', data:', data);

        const { host, port } = data;

        const agent = new Agent(host, port);
        agents.set(agent.getUrl(), agent);
    })

    /* Агент начал сборку */
    .on(actions.agentStarted, (data) => {
        signale.star(actions.agentStarted, ', data:', data);

        const { id, agentUrl } = data;

        agentByBuildId.set(id, agentUrl);
    })

    /* Агент закончил сборку */
    .on(actions.agentFinished, (data) => {
        signale.star(actions.agentFinished, ', data:', data);

        const { id, status, log, duration } = data;

        serverData.eventEmmiter.emit(actions.buildFinished, {
            buildId: id,
            duration,
            success: status === 0,
            buildLog: log,
        });

        const agentUrl = agentByBuildId.get(id);
        agentByBuildId.delete(id);

        const agent = agents.get(agentUrl);
        agent.buildId = null;
        agent.commitHash = null;
    });
