const signale = require('signale');

const { fetchSettings } = require('../api');
const serverData = require('../data');

async function checkSettings() {
    // signale.start('checkSettings');

    /** Получаем настройки */

    const { data: settings } = await fetchSettings();

    if (!settings) {
        signale.error('Can not fetch settings!');
        return false;
    }

    /** Сравниваем с текущими */

    if (serverData.settings.id !== settings.id) {
        /** Сохраняем */

        serverData.settings.id = settings.id;
        serverData.settings.repoOwner = settings.repoName.split('/')[0];
        serverData.settings.repoName = settings.repoName.split('/')[1];
        serverData.settings.repoUrl = `https://github.com/${settings.repoName}.git`;
        serverData.settings.period = settings.period;
        serverData.settings.buildCommand = settings.buildCommand;
        serverData.settings.mainBranch = settings.mainBranch;

        /** Отчёт */

        signale.note('settings changed!');
        console.log(serverData.settings);

        return true;
    }
    return false;
}

module.exports = { checkSettings };
