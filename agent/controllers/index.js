const signale = require('signale');

const { runBuild } = require('../utils/runBuild');

function build(req, res) {
    signale.start('Received a new build!');
    signale.note('params:', req.body);

    const { id, repoUrl, commitHash, buildCommand } = req.body;

    runBuild({ id, repoUrl, commitHash, buildCommand });

    res.status(200).end();
}

module.exports = { build };
