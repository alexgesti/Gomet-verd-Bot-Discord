const { getGuildSettings, setInitialized } = require("../database/guildSettings");
const { processMessage } = require("./scoreService");
const { clearScores } = require("../database/scores");

async function scanGuildHistory(client, guildId) {

    const settings = await getGuildSettings(guildId);

    if (!settings) {
        return;
    }

    await clearScores(guildId);

    const channel = await client.channels.fetch(settings.channel_id);

    if (!channel) {
        return;
    }

    let lastMessageId = null;
    let before;

    while (true) {

        const messages = await channel.messages.fetch({
            limit: 100,
            before
        });

        if (messages.size === 0) {
            break;
        }

        const orderedMessages = [...messages.values()].reverse();

        for (const message of orderedMessages) {
        
            await processMessage(message);
        
            lastMessageId = message.id;
        
        }

        before = messages.last().id;

    }

    await setInitialized(guildId, lastMessageId);

}

module.exports = {
    scanGuildHistory
};