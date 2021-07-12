const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const signale = require('signale');

const { PORT } = require('./config');
const { mainRouter } = require('./router');
const serverData = require('./data');
const { lifeCycle } = require('./utils/lifeCycle');
const { checkSettings } = require('./utils/checkSettings');
const { getLastCommit } = require('./utils/getLastCommit');
const { getNewCommits } = require('./utils/getNewCommits');
// const { findPastBuilds } = require('./utils/findPastBuilds');
const { Agent } = require('./data/Agent');
const { requestBuild, startBuild, finishBuild, cancelBuild } = require('./api');

const { eventEmmiter, actions, agents, agentByBuildId } = serverData;

/** Stream for logs */

const accessLogStream = fs.createWriteStream(path.resolve('access.log'), {
    flags: 'a',
});

const app = express();

/** Logger */

app.use(
    morgan(':method :url', {
        stream: accessLogStream,
        immediate: true,
    }),
);

app.use(express.json());
app.use('/', mainRouter);

app.listen(PORT, async () => {
    signale.start(`Server started! http://localhost:${PORT}`);

    // .on(actions.settingsChanged, (data) => {
    //     signale.star(actions.settingsChanged, ', data:', data);
    //     findPastBuilds();
    // })

    eventEmmiter
        .on(actions.buildRequested, (data) => {
            signale.star(actions.buildRequested, ', data:', data);

            const { commitMessage, commitHash, branchName, authorName } = data;
            requestBuild({ commitMessage, commitHash, branchName, authorName });
        })
        .on(actions.buildStarted, (data) => {
            signale.star(actions.buildStarted, ', data:', data);

            const { buildId, dateTime } = data;
            startBuild({ buildId, dateTime });
        })
        .on(actions.buildFinished, (data) => {
            signale.star(actions.buildFinished, ', data:', data);

            const { buildId, duration, success, buildLog } = data;
            finishBuild({ buildId, duration, success, buildLog });
        })
        .on(actions.buildCanceled, (data) => {
            signale.star(actions.buildCanceled, ', data:', data);

            const { buildId } = data;
            cancelBuild({ buildId });
        })

        .on(actions.agentNotified, (data) => {
            signale.star(actions.agentNotified, ', data:', data);

            const { host, port } = data;

            const agent = new Agent(host, port);
            agents.set(agent.getUrl(), agent);
        })
        .on(actions.agentStarted, (data) => {
            signale.star(actions.agentStarted, ', data:', data);

            const { id, agentUrl } = data;

            agentByBuildId.set(id, agentUrl);
        })
        .on(actions.agentFinished, (data) => {
            signale.star(actions.agentFinished, ', data:', data);

            const { id, status, log, duration } = data;

            eventEmmiter.emit(actions.buildFinished, {
                buildId: id,
                duration,
                success: status === 0,
                buildLog: log,
            });

            const agentUrl = agentByBuildId.get(id);
            // agentByBuildId.delete(id);

            const agent = agents.get(agentUrl);
            agent.buildId = null;
            agent.commitHash = null;
        });

    const settingsFetched = await checkSettings();

    if (!settingsFetched) {
        signale.fatal('Can not fetch settings!');
        process.exit(1);
    }

    await getLastCommit();
    // await findPastBuilds();
    // eventEmmiter.emit(actions.settingsChanged);

    getNewCommits();

    lifeCycle();
});
