const {
    EmbedBuilder,
    SlashCommandBuilder,
    AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get_voices")
    .setDescription("Get list of voices for Polly"),
  async execute(interaction) {

    const names = new AttachmentBuilder("./voices.json");
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("names list")
      .setDescription("JSON file attached with the list of usable names");

    await interaction.reply({
      content: `<https://docs.aws.amazon.com/polly/latest/dg/voicelist.html> - Standard voices only`,
      ephemeral: false,
      embeds: [embed],
      files: [names],
    });
  },
};
