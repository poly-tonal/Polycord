const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const namePath = "./voices.json";
const userPath = "./userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set_other_voice")
    .setDescription("set voice for other user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to change by Tag")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("voice").setDescription("Standard Voice").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    var userChoise = interaction.options.getUser("user");
    var voiceChoice = interaction.options.getString("voice");
    var namesData = JSON.parse(fs.readFileSync(namePath));
    var userData = JSON.parse(fs.readFileSync(userPath));
    let voiceFound = false;

    userData.forEach((user) => {
      if (user.UID == userChoise.username) {
        for (i = 0; i < namesData.length; i++) {
          if (namesData[i] == voiceChoice) {
            //write voice for user
            user.selected_voice = voiceChoice;

            var NewUserFile = JSON.stringify(userData);

            fs.writeFileSync("./userData.json", NewUserFile, (err) => {
              // error checking
              if (err) throw err;

              console.log("New data added");
            });

            voiceFound = true;
          }
        }
      }
    });

    if (voiceFound) {
      await interaction.reply({
        content: `TTS Voice changed to ${voiceChoice} for ${userChoise}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Unable to change TTS Voice to ${voiceChoice} for ${userChoise}`,
        ephemeral: true,
      });
    }
  },
};
