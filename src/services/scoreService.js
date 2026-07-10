const { getGuildSettings } = require("../database/guildSettings");
const { addPoint } = require("../database/scores");

async function processMessage(message) {

    if (!message.guild) {
        return;
    }

    const settings = await getGuildSettings(message.guild.id);

    if (!settings) {
        return;
    }

    if (message.channel.id !== settings.channel_id) {
        return;
    }

    if (message.author.id !== settings.master_user_id) {
        return;
    }

    const hasRole = message.mentions.roles.has(settings.advinanza_role_id);

    if (!hasRole) {
        return;
    }

    if (message.mentions.users.size !== 1) {
        return;
    }

    const winner = message.mentions.users.first();

    await addPoint(message.guild.id, winner);

}

module.exports = {
    processMessage
};