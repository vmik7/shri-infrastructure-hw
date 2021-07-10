const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');
const { mainRouter } = require('./router');
const { fetchSettings } = require('./api/fetchSettings');
const { cancelPastBuilds } = require('./utils/cancelPastBuilds');
const { settings } = require('./data');
const { lifeCycle } = require('./utils/lifeCycle');

/** Stream for logs */

const accessLogStream = fs.createWriteStream(path.resolve('access.log'), {
    flags: 'a',
});

const app = express();

/** Logger */

app.use(
    morgan(':method :url', {
        stream: accessLogStream,
        immediate: true,
    }),
);

app.use(express.json());
app.use('/', mainRouter);

app.listen(PORT, async () => {
    console.log(`Server started! http://localhost:${PORT}`);

    const { data } = await fetchSettings();

    if (!data) {
        process.exit(-1);
    }

    settings.id = data.id;
    settings.period = data.period;
    settings.repoUrl = `https://github.com/${data.repoName}.git`;
    settings.buildCommand = data.buildCommand;
    settings.mainBranch = data.mainBranch;

    await cancelPastBuilds();

    lifeCycle();
});
