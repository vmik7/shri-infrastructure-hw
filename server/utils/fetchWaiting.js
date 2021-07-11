const signale = require('signale');

const { mainQueue } = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');

async function fetchWaiting() {
    // signale.start('fetchWaiting');

    /** Достаём сборки из базы данных */

    // TODO: Собирать сборки по частям

    const { data: allBuilds } = await fetchBuilds();

    if (!allBuilds) {
        // не удалось получить список сборок
        signale.error('Не удалось получить список сборок!');
        return;
    }

    /** Выбирам сборки, которые в статусе Waiting и меняем порядок */

    const waitingBuilds = allBuilds
        .filter((build) => build.status === 'Waiting')
        .reverse();

    // TODO: Пушить сборки только если они ещё не в очереди

    mainQueue.push(...waitingBuilds);

    /** Отчёт */

    if (waitingBuilds.length) {
        signale.note('Found', waitingBuilds.length, 'waiting builds.');
    }
}

module.exports = { fetchWaiting };
