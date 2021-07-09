require('dotenv').config();
const axios = require('axios');

const fs = require('fs');

const config = JSON.parse(fs.readFileSync('agent-conf.json', 'utf-8'));

/** Constants */

const PORT = process.env.PORT || config.port;
const SERVER_HOST = process.env.SERVER_HOST || config.serverHost;
const SERVER_PORT = process.env.SERVER_PORT || config.serverPort;

/** Axios configuration */

const axiosInstance = axios.create({
    baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
});

/** Exports */

module.exports = {
    PORT,
    SERVER_HOST,
    SERVER_PORT,
    axiosInstance,
};
