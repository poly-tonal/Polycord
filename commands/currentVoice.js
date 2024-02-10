const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const userPath = "./userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get_current_voice")
    .setDescription("Get the name of the voice you are currently using"),

  async execute(interaction) {
    var userData = JSON.parse(fs.readFileSync(userPath));
    var voice = null;
    userData.forEach((user) => {
      if (user.UID == interaction.user.username) {
        voice = user.selected_voice;
      }
    });
    await interaction.reply(`Your voice name is ${voice}`);
  },
};
