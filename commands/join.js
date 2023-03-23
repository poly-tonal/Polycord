const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join Voice Channel"),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel)
            await interaction.reply({
                content: "You need to be in a voice channel to use this command!"
    });

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
    },
};
