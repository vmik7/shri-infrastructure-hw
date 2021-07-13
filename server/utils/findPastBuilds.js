const signale = require('signale');

const serverData = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');

/**
 * Ищет билды в БД, которые не совпадают с текущей кофигурацией
 * @returns {undefined}
 */
async function findPastBuilds() {
    // signale.start('findPastBuilds');

    const { settings, eventEmmiter, actions } = serverData;

    const pastBuilds = [];

    const limit = 25;
    let offset = 0;
    let allLoaded = false;

    while (!allLoaded) {
        /* Достаём сборки из базы данных */
        const { data: allBuilds } = await fetchBuilds({ limit, offset });

        if (!allBuilds) {
            signale.error('Не удалось получить список сборок!');
            return;
        }

        /* Выбирам сборки, которые в статусе InProgress или Waiting
        и не совпадают с текущими настройками */
        const buildsToCancel = allBuilds.filter((build) => {
            return (
                (build.status === 'InProgress' || build.status === 'Waiting') &&
                build.configurationId !== settings.id
            );
        });

        /* Если массив пустой, значи уже всё загружено */
        if (buildsToCancel.length === 0) {
            allLoaded = true;
        }

        pastBuilds.push(...buildsToCancel);

        if (!allLoaded) {
            offset += limit;
        }
    }

    for (const build of pastBuilds) {
        eventEmmiter.emit(actions.buildCanceled({ buildId: build.id }));
    }

    /* Отчёт */
    if (pastBuilds.length) {
        signale.note('Found', pastBuilds.length, 'past builds');
    }
}

module.exports = { findPastBuilds };
