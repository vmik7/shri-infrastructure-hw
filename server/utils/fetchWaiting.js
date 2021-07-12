const signale = require('signale');

const { mainQueue } = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');

async function fetchWaiting() {
    // signale.start('fetchWaiting');

    /** Последняя сборка, добавленная в очередь */
    const lastQueuedId = mainQueue.length
        ? mainQueue[mainQueue.length - 1].id
        : null;

    const newBuilds = [];

    const limit = 25;
    let offset = 0;
    let allLoaded = false;

    while (!allLoaded) {
        /** Достаём сборки из базы данных */
        const { data: allBuilds } = await fetchBuilds({ limit, offset });

        if (!allBuilds) {
            signale.error('Не удалось получить список сборок!');
            return;
        }

        /** Выбирам сборки, которые в статусе Waiting */
        const waitingBuilds = allBuilds
            .filter((build) => build.status === 'Waiting')
            .map((build) => {
                return {
                    id: build.id,
                    commitHash: build.commitHash,
                };
            });

        /** Если массив пустой, значи уже всё загружено */
        if (waitingBuilds.length === 0) {
            allLoaded = true;
        }

        /** Выбираем все сборки, которые ещё не в очереди */
        for (const build of waitingBuilds) {
            if (build.id === lastQueuedId) {
                allLoaded = true;
                break;
            } else {
                newBuilds.push(build);
            }
        }

        if (!allLoaded) {
            offset += limit;
        }
    }

    /** Вставляем новые сборки в очередь в обратном порядке */
    mainQueue.push(...newBuilds.reverse());

    /** Отчёт */
    if (newBuilds.length) {
        signale.note('Found', newBuilds.length, 'waiting builds.');
    }
}

module.exports = { fetchWaiting };
