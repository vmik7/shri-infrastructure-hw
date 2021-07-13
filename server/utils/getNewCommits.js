const signale = require('signale');
const add = require('date-fns/add');

const { myOctokit } = require('../config');
const serverData = require('../data');
const { getLastCommit } = require('./getLastCommit');

const perPage = 100;

/**
 * Ищет новые коммиты в репозитории
 * @returns {undefined}
 */
async function getNewCommits() {
    // signale.start('getNewCommits');

    const {
        settings: { repoOwner, repoName },
        lastCommitDate,
        eventEmmiter,
        actions,
    } = serverData;

    /* Дата последнего коммита + 1 секунда */
    const nextDate = add(new Date(lastCommitDate), {
        seconds: 1,
    }).toISOString();

    /* Получаем главную ветку */

    const {
        data: { default_branch: defaultBranch },
    } = await myOctokit.request('GET /repos/{owner}/{repo}', {
        owner: repoOwner,
        repo: repoName,
    });

    if (!defaultBranch) {
        signale.error('Can not fetch default branch!');
        return;
    }

    /* Получаем новые коммиты */

    const newCommits = [];
    let currentPage = 1;
    let allLoaded = false;

    while (!allLoaded) {
        const { data: commits } = await myOctokit.request(
            'GET /repos/{owner}/{repo}/commits',
            {
                owner: repoOwner,
                repo: repoName,
                per_page: perPage,
                page: currentPage,
                since: nextDate,
            },
        );

        if (!commits) {
            signale.error('Can not fetch commits!');
            return;
        }

        const commitsData = commits.map((commit) => {
            return {
                commitMessage: commit.commit.message,
                commitHash: commit.sha,
                branchName: defaultBranch,
                authorName: commit.commit.author.name,
            };
        });

        newCommits.push(...commitsData);

        if (commitsData.length === 0) {
            allLoaded = true;
        } else {
            currentPage++;
        }
    }

    /* Добавляем новые коммиты в очередь */
    newCommits.forEach(
        ({ commitMessage, commitHash, branchName, authorName }) => {
            eventEmmiter.emit(actions.buildRequested, {
                commitMessage,
                commitHash,
                branchName,
                authorName,
            });
        },
    );

    /* Отчёт */
    if (newCommits.length) {
        signale.note('Found', newCommits.length, 'new commits.');
    }

    /* Обновляем последний коммит */
    getLastCommit();
}

module.exports = { getNewCommits };
