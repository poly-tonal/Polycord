const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("Set Timeout")
        .setDescription("Set timeout for TTS bot to leave "),
    async execute(interaction) {
        await interaction.reply('Timeout Set (not yet tho)');
    },
};
