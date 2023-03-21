const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs")
const configPath = "../config.json"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("Set TTS Channel")
        .setDescription("Set Channel Listened to by polycord"),
    async execute(interaction) {
        //set channel in config
        configData = Json.Parse(fs.readFileSync(configPath));
        configData.channel = interaction.channelID;
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))
        await interaction.reply(`Channel Set to ${interaction.channel}`);
    },
};
