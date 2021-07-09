require('dotenv').config();
const axios = require('axios');

const fs = require('fs');

const config = JSON.parse(fs.readFileSync('server-conf.json', 'utf-8'));

/** Constants */

const PORT = process.env.PORT || config.port;
const API_TOKEN = process.env.API_TOKEN || config.apiToken;
const API_BASE_URL = process.env.API_BASE_URL || config.apiBaseUrl;

/** Axios configuration */

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: API_TOKEN,
    },
});

/** Exports */

module.exports = {
    PORT,
    API_TOKEN,
    API_BASE_URL,
    axiosInstance,
};
