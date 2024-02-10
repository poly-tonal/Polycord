const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("help topic")
        .addChoices(
          { name: "change_voice", value: "change_voice" },
          { name: "get_current_voice", value: "get_current_voice" },
          { name: "get_characters", value: "get_characters" },
          { name: "get_voices", value: "get_voices" },
          { name: "join", value: "join" },
          { name: "leave", value: "leave" },
          { name: "set_tts_channel", value: "set_tts_channel" },
          { name: "set_voice", value: "set_voice" }
        )
    ),

  async execute(interaction) {
    switch (interaction.options.getString("topic")) {
      case "change_voice":
        message = "Change the voice TTS uses when you send a message into the TTS channel!"
        break;
      case "get_current_voice":
        message = "Polycord will tell you which voice you are using!"
        break;
      case "get_characters" :
        message = "See how many characters you have spoken via TTS!"
        break;
      case "get_voices":
        message = "Get a link to the list of TTS voices!"
        break;
      case "join":
        message = "Force Polycord to Join the voice channel you are in!"
        break;
      case "leave" :
        message = "Force Polycord to Leave the voice channel!"
        break;
      case "set_tts_channel" :
        message = "ADMIN USE ONLY. Set the text channel Polycord listens in to where this command was sent"
        break;
      case "set_voice":
        message = "ADMIN USE ONLY. Set another user's TTS voice"
        break;
      default:
        message = `Join a voice channel and send a message into the TTS channel! The bot will read it out loud for you! \n If you need help with a specific command please use /help followed by the command, for example: \n /help change_voice`
        break;
    }

    await interaction.reply({
      content: message,
      ephemeral: true,
    });
  },
};
