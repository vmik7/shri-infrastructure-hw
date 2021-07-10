require('dotenv').config();

const fs = require('fs');
const axios = require('axios');

const config = JSON.parse(fs.readFileSync('server-conf.json', 'utf-8'));

const PORT = process.env.PORT || config.port;
const API_TOKEN = process.env.API_TOKEN || config.apiToken;
const API_BASE_URL = process.env.API_BASE_URL || config.apiBaseUrl;

/** Constants */

exports.PORT = PORT;
exports.API_TOKEN = API_TOKEN;
exports.API_BASE_URL = API_BASE_URL;

/** Axios configuration */

exports.axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: API_TOKEN,
    },
});
