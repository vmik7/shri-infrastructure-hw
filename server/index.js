const express = require('express');
const signale = require('signale');

const { PORT } = require('./config');
const { mainRouter } = require('./router');
const serverData = require('./data');
const { lifeCycle } = require('./utils/lifeCycle');
const { checkSettings } = require('./utils/checkSettings');
const { getLastCommit } = require('./utils/getLastCommit');
const { getNewCommits } = require('./utils/getNewCommits');
require('./utils/initEvents');

const { eventEmmiter, actions } = serverData;

const app = express();

app.use(express.json());
app.use('/', mainRouter);

app.listen(PORT, async () => {
    signale.start(`Server started! http://localhost:${PORT}`);

    /* Подтягиваем настройки */
    const settingsFetched = await checkSettings();

    if (!settingsFetched) {
        /* Без настроек никуда */
        signale.fatal('Can not fetch settings!');
        process.exit(1);
    }

    /* Получаем последний коммит из репозитория */
    await getLastCommit();

    eventEmmiter.emit(actions.settingsChanged);

    /* Настраиваем интервал проверки новых коммитов */
    setInterval(getNewCommits, serverData.settings.period * 1000 * 60);

    /* Запуск основного цикла */
    lifeCycle();
});
