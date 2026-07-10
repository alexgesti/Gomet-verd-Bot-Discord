const { saveGuildSettings } = require("../database/guildSettings");
const { scanGuildHistory } = require("../services/historyScanner");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configura el bot.")
        .addChannelOption(option =>
            option
                .setName("canal")
                .setDescription("Canal donde se contarán los puntos.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("advinanza")
                .setDescription("Rol de Advinanza.")
                .setRequired(true)
        ),

    async execute(interaction) {

    await interaction.deferReply({
        ephemeral: true
    });

    const channel = interaction.options.getChannel("canal");
    const advinanzaRole = interaction.options.getRole("advinanza");

    await saveGuildSettings({
        guildId: interaction.guild.id,
        channelId: channel.id,
        advinanzaRoleId: advinanzaRole.id,
        masterUserId: interaction.user.id
    });

    await scanGuildHistory(interaction.client, interaction.guild.id);

    await interaction.editReply(
        "✅ Configuración guardada y recuento inicial completado."
    );}
};