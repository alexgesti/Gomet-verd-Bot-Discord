const supabase = require("./supabase");

async function getLeaderboard(guildId) {

    const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("guild_id", guildId)
        .order("points", { ascending: false });

    if (error) {
        throw error;
    }

    return data;

}

async function addPoint(guildId, user) {

    const { data } = await supabase
        .from("scores")
        .select("*")
        .eq("guild_id", guildId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (!data) {

        const { error } = await supabase
            .from("scores")
            .insert({
                guild_id: guildId,
                user_id: user.id,
                username: user.username,
                points: 1
            });

        if (error) throw error;

        return;
    }

    const { error } = await supabase
        .from("scores")
        .update({
            points: data.points + 1,
            username: user.username
        })
        .eq("guild_id", guildId)
        .eq("user_id", user.id);

    if (error) throw error;

}

async function clearScores(guildId) {

    const { error } = await supabase
        .from("scores")
        .delete()
        .eq("guild_id", guildId);

    if (error) {
        throw error;
    }

}

module.exports = {
    getLeaderboard,
    addPoint,
    clearScores
};