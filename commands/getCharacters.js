const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const userPath = "./userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get_characters")
    .setDescription("Get list of number of characters spoken"),

  async execute(interaction) {
    var userData = JSON.parse(fs.readFileSync(userPath));
    var characters = 0;
    userData.forEach((user) => {
      if (user.UID == interaction.user.username) {
        characters = user.characters;
      }
    });
    await interaction.reply(`You have spoken ${characters} characters`);
  },
};
