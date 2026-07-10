module.exports = async (interaction) => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });

        }

    }

};