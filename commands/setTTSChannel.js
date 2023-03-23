const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs")
const configPath = "./config.json"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set_tts_channel")
        .setDescription("Set Channel Listened to by polycord"),
    async execute(interaction) {
        //set channel in config
        configData = JSON.parse(fs.readFileSync(configPath));
        configData.channel = interaction.channelID;
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))
        await interaction.reply(`Channel Set to ${interaction.channel}`);
    },
};