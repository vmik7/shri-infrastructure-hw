const signale = require('signale');

const serverData = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');

async function findPastBuilds() {
    // signale.start('findPastBuilds');

    const { settings, eventEmmiter, actions } = serverData;

    /** Достаём все сборки из базы данных */

    // TODO: Собирать сборки по частям

    const { data: allBuilds } = await fetchBuilds();

    if (!allBuilds) {
        // не удалось получить список сборок
        signale.error('Не удалось получить список сборок!');
        return;
    }

    /** Выбирам сборки, которые в статусе InProgress или Waiting
     * и которые не совпадают с текущими настройками
     * */

    const buildsToCancel = allBuilds.filter((build) => {
        return (
            (build.status === 'InProgress' || build.status === 'Waiting') &&
            build.configurationId !== settings.id
        );
    });

    for (const build of buildsToCancel) {
        eventEmmiter.emit(actions.buildCanceled({ buildId: build.id }));
    }

    /** Отчёт */

    if (buildsToCancel.length) {
        signale.note('Found', buildsToCancel.length, 'past builds');
    }
}

module.exports = { findPastBuilds };
