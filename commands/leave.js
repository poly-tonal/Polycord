const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('Leave')
        .setDescription('Leave the voice channel'),
    async execute(interaction) {
        const voiceConnection = getVoiceConnection(interaction.guildId);

        if (voiceConnection) {
            voiceConnection.destroy();
            await interaction.reply('Leaving voice channel.');
        } else {
            await interaction.reply('Bot is not in a voice channel.');
        }
    },
};