const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./agent-conf.json', 'utf-8'));

const PORT = config.port || 5051;
const SERVER_HOST = config.serverHost || 'host.docker.internal';
const SERVER_PORT = config.serverPort || 5050;

console.log(PORT, SERVER_HOST, SERVER_PORT);
