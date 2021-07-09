function build(req, res) {
    console.log('Hello from notifyAgent()');

    console.log('query:', req.query);
    console.log('body:', req.body);

    res.status(200).end();
}

module.exports = { build };
