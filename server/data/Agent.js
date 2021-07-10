const axios = require('axios');

function Agent(host, port) {
    this.host = host;
    this.port = port;
    this.isFree = true;
}

Agent.prototype.isAlive = async function () {
    try {
        const response = await axios.get(`http://${this.host}:${this.port}`);
        return response.status === 200;
    } catch {
        console.error('Can not connect with agent!');
        return false;
    }
};

Agent.prototype.build = async function ({
    id,
    repoUrl,
    commitHash,
    buildCommand,
}) {
    try {
        const response = await axios.post(
            `http://${this.host}:${this.port}/build`,
            { id, repoUrl, commitHash, buildCommand },
        );
        return response.status === 200;
    } catch (err) {
        console.error('Can not connect with agent!', err);
        return false;
    }
};

module.exports = { Agent };
