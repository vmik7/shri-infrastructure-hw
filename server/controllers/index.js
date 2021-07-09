function notifyAgent(req, res) {
    console.log('Hello from notifyAgent()');

    console.log('query:', req.query);
    console.log('body:', req.body);

    res.status(200).end();
}
function notifyBuildResult(req, res) {
    console.log('Hello from notifyBuildResult()');

    console.log('query:', req.query);
    console.log('body:', req.body);

    res.status(200).end();
}

module.exports = { notifyAgent, notifyBuildResult };
