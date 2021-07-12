const axios = require('axios');

function Agent(host, port) {
    this.host = host;
    this.port = port;
    this.buildId = null;
    this.commitHash = null;
}

Agent.prototype.getUrl = function () {
    return `http://${this.host}:${this.port}`;
};

Agent.prototype.isFree = function () {
    return this.buildId === null;
};

Agent.prototype.isAlive = async function () {
    try {
        const response = await axios.get(this.getUrl());
        return response.status === 200;
    } catch (err) {
        console.error('Can not connect with agent', this.getUrl(), '!', err);
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
        const response = await axios.post(`${this.getUrl()}/build`, {
            id,
            repoUrl,
            commitHash,
            buildCommand,
        });
        if (response.status === 200) {
            this.buildId = id;
            this.commitHash = commitHash;
            return true;
        }
        return false;
    } catch (err) {
        console.error('Can not connect with agent', this.getUrl(), '!', err);
        return false;
    }
};

module.exports = { Agent };
