const { settings } = require('../data');
const { fetchBuilds } = require('../api/fetchBuilds');
const { cancelBuild } = require('../api/cancelBuild');

async function cancelPastBuilds() {
    console.log('[cancelPastBuilds]');

    // достаём сборки из базы данных
    const { data: allBuilds } = await fetchBuilds();

    if (!allBuilds) {
        // не удалось получить список сборок
        console.error('Не удалось получить список сборок!');
        return;
    }

    // выбирам сборки, которые в статусе InProgress или Waiting
    // и которые не совпадают с текущими настройками
    const buildsToCancel = allBuilds.filter((build) => {
        return (
            (build.status === 'InProgress' || build.status === 'Waiting') &&
            build.configurationId !== settings.id
        );
    });

    console.log('Found', buildsToCancel.length, 'past builds');

    // отменяем нерелевантные сборки
    for (const build of buildsToCancel) {
        await cancelBuild(build.id);
    }
}

module.exports = { cancelPastBuilds };
