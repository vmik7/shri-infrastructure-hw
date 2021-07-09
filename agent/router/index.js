const { Router } = require('express');
const { build } = require('../controllers');

const mainRouter = new Router();

mainRouter.post('/build', build);

module.exports = { mainRouter };
