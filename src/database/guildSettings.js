const supabase = require("./supabase");

async function saveGuildSettings({
    guildId,
    channelId,
    advinanzaRoleId,
    masterUserId
}) {

    const { error } = await supabase
        .from("guild_settings")
        .upsert({
            guild_id: guildId,
            channel_id: channelId,
            advinanza_role_id: advinanzaRoleId,
            master_user_id: masterUserId,
            initialized: false,
            last_processed_message_id: null
        });

    if (error) {
        throw error;
    }

}

async function getGuildSettings(guildId) {

    const { data, error } = await supabase
        .from("guild_settings")
        .select("*")
        .eq("guild_id", guildId)
        .single();

    if (error) {
        return null;
    }

    return data;

}

async function setInitialized(guildId, lastMessageId) {

    const { error } = await supabase
        .from("guild_settings")
        .update({
            initialized: true,
            last_processed_message_id: lastMessageId
        })
        .eq("guild_id", guildId);

    if (error) {
        throw error;
    }

}

module.exports = {
    saveGuildSettings,
    getGuildSettings,
    setInitialized
};