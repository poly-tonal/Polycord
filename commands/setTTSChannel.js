const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs")
const configPath = "./config.json"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set_tts_channel")
        .setDescription("Set Channel Listened to by polycord")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        //set channel in config
        configData = JSON.parse(fs.readFileSync(configPath));
        configData.channel = interaction.channel.id;
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))
        await interaction.reply(`Channel Set to ${interaction.channel}`);
    },
};