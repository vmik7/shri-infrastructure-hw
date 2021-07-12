const signale = require('signale');

const agentData = require('../data');
const { finishBuild } = require('../utils/finishBuild');

function build(req, res) {
    signale.start('Received a new build!');
    signale.note('params:', req.body);

    const { id, repoUrl, commitHash, buildCommand } = req.body;

    agentData.task.id = id;
    agentData.task.repoUrl = repoUrl;
    agentData.task.commitHash = commitHash;
    agentData.task.buildCommand = buildCommand;

    // TODO: Запустить настоящую сборку, а не заглушку

    setTimeout(async () => {
        signale.success('Build is finished!');

        agentData.task.status = 0;
        agentData.task.duration = 123;
        agentData.task.log = 'Build complited successfully!';

        signale.note(agentData.task);

        await finishBuild();
    }, 1000 * 5);

    res.status(200).end();
}

module.exports = { build };
