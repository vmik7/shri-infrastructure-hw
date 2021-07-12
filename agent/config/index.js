require('dotenv').config();

const fs = require('fs');
const axios = require('axios');

const config = JSON.parse(fs.readFileSync('agent-conf.json', 'utf-8'));

const PORT = process.env.PORT || config.port;
const SERVER_HOST = process.env.SERVER_HOST || config.serverHost;
const SERVER_PORT = process.env.SERVER_PORT || config.serverPort;

/** Constants */

exports.PORT = PORT;
exports.tryToConnectInterval = 1000 * 10;

/** Axios configuration */

exports.axiosInstance = axios.create({
    baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
});
