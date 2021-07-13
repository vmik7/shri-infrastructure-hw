const { spawn } = require('child_process');

/**
 * @typedef Result
 * @property {string} out   Output (stdout, stderr).
 * @property {number} code  Exit code.
 */

/**
 * Выполнение bash комманды
 * @param {string} command      Command to run on bash shell.
 * @returns {Promise<Result>}   Promise that will be resolved when command finished.
 */
function bash(command) {
    return new Promise((resolve) => {
        const child = spawn('bash');
        let out = '';

        child.on('close', (code) => {
            resolve({ out, code });
        });

        child.stdout.on('data', (d) => {
            out += String(d);
        });
        child.stderr.once('data', (d) => {
            out += String(d);
        });

        child.stdin.end(`${command}\n`);
    });
}

module.exports = { bash };
