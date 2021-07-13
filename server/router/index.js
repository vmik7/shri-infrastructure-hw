const { Router } = require('express');
const { notifyAgent, notifyBuildResult } = require('../controllers');

const mainRouter = new Router();

mainRouter.post('/notify-agent', notifyAgent);
mainRouter.post('/notify-build-result', notifyBuildResult);

module.exports = { mainRouter };
