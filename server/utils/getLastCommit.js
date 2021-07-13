const signale = require('signale');

const { myOctokit } = require('../config');
const serverData = require('../data');

/**
 * Находит последний коммит в репозитории и запоминает его дату
 * @returns {undefined}
 */
async function getLastCommit() {
    // signale.start('getLastCommit');

    const {
        settings: { repoOwner, repoName },
    } = serverData;

    /* Получаем последний коммит в главной ветке */

    const {
        data: [lastCommit],
    } = await myOctokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: repoOwner,
        repo: repoName,
        per_page: 1,
    });

    if (!lastCommit) {
        signale.error('Can not fetch last commit!');
        return;
    }

    serverData.lastCommitDate = lastCommit.commit.author.date;

    /* Отчёт */
    signale.note('last commit date is', serverData.lastCommitDate);
}

module.exports = { getLastCommit };
