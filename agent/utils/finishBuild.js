const { sendResult } = require('../api/sendResult');
const { waitForRegister } = require('./waitForRegister');

async function finishBuild() {
    console.log('Sending results...');
    const result = await sendResult();

    // if (!result) {
    //     console.log('Results was not saved! Have some errors!');
    //     await waitForRegister();
    // }

    console.log('Results was sended!');
}

module.exports = { finishBuild };
