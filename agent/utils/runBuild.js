const fs = require('fs');
const path = require('path');
const signale = require('signale');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const { finishBuild } = require('./finishBuild');
const { bash } = require('./bash');

async function runBuild({ id, repoUrl, commitHash, buildCommand }) {
    /** Логи */
    signale.start('Начало сборки');
    signale.log('id:', id);
    signale.log('repoUrl:', repoUrl);
    signale.log('commitHash:', commitHash);
    signale.log('buildCommand:', buildCommand);

    /** Папка для сборки будет называться по уникальному id билда */
    const buildDirectory = path.resolve(id);

    /** Засекаем время */
    const buildStart = Date.now();

    try {
        /** Чистим папку на всякий случай */
        await fs.promises.rm(buildDirectory, {
            recursive: true,
            force: true,
        });
        signale.success('Directory', buildDirectory, 'was cleaned');

        /** Клонируем репозиторий */
        await execFile('git', ['clone', repoUrl, buildDirectory]);
        signale.success('Repository', repoUrl, 'was cloned');

        /** Переключаемся на нужный коммит */
        await execFile('git', ['checkout', commitHash], {
            cwd: buildDirectory,
        });
        signale.success('Now on', commitHash, 'commit');

        /** Переключаемся на нужный коммит */
        await execFile('npm', ['ci'], {
            cwd: buildDirectory,
        });
        signale.success('Dependences was installed');

        /** Выполняем bash комманду */
        const { out, code } = await bash(
            `cd ${buildDirectory} && ${buildCommand}`,
        );
        signale.info('Command', buildCommand, 'finished with code', code);

        /** Отправляем результат */
        signale.success('Build is finished!');
        await finishBuild({
            id,
            status: code,
            log: out,
            duration: Date.now() - buildStart,
        });

        /** Чистим папку после работы */
        await fs.promises.rm(buildDirectory, {
            recursive: true,
            force: true,
        });
    } catch (err) {
        /** Отправляем ошибки */
        signale.error(err);
        finishBuild({
            id,
            status: -1,
            log: err,
            duration: Date.now() - buildStart,
        });

        /** Чистим папку после работы */
        await fs.promises.rm(buildDirectory, {
            recursive: true,
            force: true,
        });
    }
}

module.exports = { runBuild };
