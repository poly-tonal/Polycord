const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("Change Voice")
        .setDescription("Change TTS voice for Polly"),
    async execute(interaction) {
        //set Voice variable to new voice ID 
        await interaction.reply('TTS Voice changed');
    },
};
