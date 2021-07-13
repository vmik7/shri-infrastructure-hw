const express = require('express');
const signale = require('signale');

const { PORT, currentHost } = require('./config');
const { mainRouter } = require('./router');

const { tryToRegister } = require('./utils/tryToRegister');

const app = express();

app.use(express.json());
app.use('/', mainRouter);

app.listen(PORT, () => {
    signale.start(`Agent started! http://${currentHost}:${PORT}`);

    signale.await('Waiting for registration...');
    tryToRegister();
});
