require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { Client, GatewayIntentBits } = require("discord.js");

const readyEvent = require("./events/ready");
const interactionCreate = require("./events/interactionCreate");
const messageCreate = require("./events/messageCreate");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Map();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if (!command.data || !command.execute) {
        console.warn(`⚠️ El comando ${file} no está bien definido.`);
        continue;
    }

    client.commands.set(command.data.name, command);
}

client.once("ready", () => readyEvent(client));

client.on("interactionCreate", interactionCreate);

client.on("messageCreate", messageCreate);

client.login(process.env.DISCORD_TOKEN);