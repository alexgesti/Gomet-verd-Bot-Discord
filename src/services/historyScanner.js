const { 
    getGuildSettings, 
    setInitialized,
    updateLastMessage
} = require("../database/guildSettings");

const { processMessage } = require("./scoreService");
const { clearScores } = require("../database/scores");


async function scanGuildHistory(client, guildId) {

    const settings = await getGuildSettings(guildId);


    if (!settings) {
        return;
    }


    const channel = await client.channels.fetch(
        settings.channel_id
    );


    if (!channel) {
        return;
    }



    /*
        PRIMERA VEZ:
        Cuenta todo el historial
    */

    if (!settings.initialized) {

        console.log(
            "Primer escaneo del servidor..."
        );


        await clearScores(guildId);


        let before;
        let lastMessageId;


        while (true) {

            const messages = await channel.messages.fetch({
                limit: 100,
                before
            });


            if (messages.size === 0) {
                break;
            }


            const orderedMessages = [
                ...messages.values()
            ].reverse();



            for (const message of orderedMessages) {

                await processMessage(message);

                lastMessageId = message.id;

            }


            before = messages.last().id;

        }


        await setInitialized(
            guildId,
            lastMessageId
        );


        return;

    }



    /*
        BOT REINICIADO:
        Solo mensajes nuevos
    */


    console.log(
        "Recuperando mensajes pendientes..."
    );


    const messages = await channel.messages.fetch({
        after: settings.last_processed_message_id,
        limit: 100
    });



    const orderedMessages = [
        ...messages.values()
    ].sort(
        (a, b) => a.createdTimestamp - b.createdTimestamp
    );



    let lastMessageId =
        settings.last_processed_message_id;



    for (const message of orderedMessages) {

        await processMessage(message);

        lastMessageId = message.id;

    }



    if (
        lastMessageId !== settings.last_processed_message_id
    ) {

        await updateLastMessage(
            guildId,
            lastMessageId
        );

    }

}


module.exports = {
    scanGuildHistory
};