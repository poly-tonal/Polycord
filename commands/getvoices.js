const {
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_voices")
        .setDescription("Get list of voices for Polly"),
        async execute(interaction) {
            await interaction.reply(`<https://docs.aws.amazon.com/polly/latest/dg/voicelist.html>\nSet a voice by using: **/change_voice {Name}**\nExample: __/change_voice Brian__\nStandard voices only`)
        },
    };