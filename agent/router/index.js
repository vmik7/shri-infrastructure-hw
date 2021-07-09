const { Router } = require('express');
const { build } = require('../controllers');

const mainRouter = new Router();

mainRouter.post('/build', build);

/** Health check */
mainRouter.get('/', (req, res) => {
    res.status(200).end();
});

module.exports = { mainRouter };
