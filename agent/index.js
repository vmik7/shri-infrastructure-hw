const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const signale = require('signale');

const { PORT } = require('./config');
const { mainRouter } = require('./router');

const { tryToRegister } = require('./utils/tryToRegister');

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

app.listen(PORT, () => {
    signale.start(`Agent started! http://localhost:${PORT}`);

    signale.await('Waiting for registration...');
    tryToRegister();
});
