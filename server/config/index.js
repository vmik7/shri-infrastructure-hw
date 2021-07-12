require('dotenv').config();

const fs = require('fs');
const axios = require('axios');
const { Octokit } = require('@octokit/core');

const config = JSON.parse(fs.readFileSync('server-conf.json', 'utf-8'));

const PORT = process.env.PORT || config.port;
const API_TOKEN = process.env.API_TOKEN || config.apiToken;
const API_BASE_URL = process.env.API_BASE_URL || config.apiBaseUrl;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || config.githubToken;

/** Constants */

exports.PORT = PORT;

/** Axios configuration */

exports.axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: API_TOKEN,
    },
});

/** Octokit configuration */

const MyOctokit = Octokit.defaults({
    auth: GITHUB_TOKEN,
    baseUrl: 'https://api.github.com',
});

exports.myOctokit = new MyOctokit();
