const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getLeaderboard } = require("../database/scores");


module.exports = {

    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Muestra el ranking de puntos."),


    async execute(interaction) {

        await interaction.deferReply();


        try {

            const scores = await getLeaderboard(
                interaction.guild.id
            );


            if (scores.length === 0) {

                return interaction.editReply(
                    "Todavía no hay puntuaciones."
                );

            }


            const embeds = [];

            const winner = await interaction.client.users.fetch(
                scores[0].user_id
            );


            const winnerEmbed = new EmbedBuilder()
                .setTitle("🟢 GOMETS VERDS")
                .setColor("#FFD700")
                .setImage(
                    winner.displayAvatarURL({
                        extension: "png",
                        size: 512
                    })
                )
                .addFields({
                    name:
                        `🥇 ${scores[0].username}`,
                    value:
                        `\n🟢 **${scores[0].points} gomets**`,
                    inline: false
                })
                .setFooter({
                    text: "Gomets verds"
                })
                .setTimestamp();


            embeds.push(winnerEmbed);

            if (scores[1]) {

                const second = await interaction.client.users.fetch(
                    scores[1].user_id
                );


                const secondEmbed = new EmbedBuilder()
                    .setColor("#C0C0C0")
                    .setThumbnail(
                        second.displayAvatarURL({
                            extension: "png",
                            size: 256
                        })
                    )
                    .addFields({
                        name:
                            `🥈 ${scores[1].username}`,
                        value:
                            `\n🟢 **${scores[1].points} gomets**`,
                        inline: false
                    });


                embeds.push(secondEmbed);

            }

            if (scores[2]) {

                const third = await interaction.client.users.fetch(
                    scores[2].user_id
                );


                const thirdEmbed = new EmbedBuilder()
                    .setColor("#CD7F32")
                    .setThumbnail(
                        third.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })
                    )
                    .addFields({
                        name:
                            `🥉 ${scores[2].username}`,
                        value:
                            `\n🟢 **${scores[2].points} gomets**`,
                        inline: false
                    });


                embeds.push(thirdEmbed);

            }

            const numberEmojis = [
                "4️⃣",
                "5️⃣",
                "6️⃣",
                "7️⃣",
                "8️⃣",
                "9️⃣",
                "🔟"
            ];


            let rest = "";


            scores.slice(3, 10).forEach((player, index) => {

                rest +=
                    `${numberEmojis[index]} **${player.username}**\n🟢 ${player.points} gomets\n\n`;

            });


            if (rest) {

                const rankingEmbed = new EmbedBuilder()
                    .setTitle("📜 Ranking")
                    .setColor("#00FF55")
                    .setDescription(rest);


                embeds.push(rankingEmbed);

            }



            await interaction.editReply({
                embeds
            });


        } catch (error) {

            console.error(error);

            await interaction.editReply(
                "❌ Error generando el leaderboard."
            );

        }

    }

};