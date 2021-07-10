const { task } = require('../data');
const { finishBuild } = require('../utils/finishBuild');

function build(req, res) {
    console.log('Received a new build!');
    console.log('params:', req.body);

    const { id, repoUrl, commitHash, buildCommand } = req.body;

    task.id = id;
    task.repoUrl = repoUrl;
    task.commitHash = commitHash;
    task.buildCommand = buildCommand;

    // TODO: Запустить настоящую сборку, а не заглушку

    setTimeout(async () => {
        console.log('Build is finished!');

        task.status = true;
        task.log = 'Build complited successfully!';

        await finishBuild();
    }, 1000 * 5);

    res.status(200).end();
}

module.exports = { build };
