const { processMessage } = require("../services/scoreService");

module.exports = async (message) => {

    try {

        await processMessage(message);

    } catch (error) {

        console.error(error);

    }

};