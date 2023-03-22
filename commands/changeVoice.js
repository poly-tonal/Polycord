const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("change_voice")
        .setDescription("Change TTS voice for Polly"),
    async execute(interaction) {
        //set Voice variable to new voice ID 
        await interaction.reply('TTS Voice changed');
    },
};
