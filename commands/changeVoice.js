const {
  ActionRowBuilder,
  Events,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const namePath = "./voices.json";
const userPath = "./userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change_voice")
    .setDescription("Change TTS voice for Polly")
    .addStringOption((option) =>
      option
        .setName("voice")
        .setDescription("Polycord voice name")
        .setRequired(true)
    ),
  async execute(interaction) {
    //set Voice variable to new voice ID
    var voiceChoice = interaction.options.getString("voice");
    var namesData = JSON.parse(fs.readFileSync(namePath));
    var userData = JSON.parse(fs.readFileSync(userPath));
    let voiceFound = false;

    userData.forEach((user) => {
      if (user.UID == interaction.user.username) {
        for (i = 0; i < namesData.length; i++) {
          if (namesData[i] == voiceChoice) {
            //write voice for user
            // configData = JSON.parse(fs.readFileSync(configPath));
            // configData.voice = voiceChoice;
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
      await interaction.reply(`TTS Voice changed to ${voiceChoice}`);
    } else {
      await interaction.reply(
        `Unable to change TTS Voice changed to ${voiceChoice}, please check the voice name list and ensure you are using a valid standard name and that you have sent your first tts message.`
      );
    }
  },
};
