const {
    ActionRowBuilder,
    Events,
    StringSelectMenuBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const namePath = "./voices.json";
const configPath = "./config.json";

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
        let voiceFound = false
        for (i = 0; i < namesData.length; i++) {
            if (namesData[i] == voiceChoice) {
                configData = JSON.parse(fs.readFileSync(configPath));
                configData.voice = voiceChoice;
                fs.writeFileSync(
                    configPath,
                    JSON.stringify(configData, null, 2)
                );
                voiceFound = true
            }
        }
        if (voiceFound){
            await interaction.reply(`TTS Voice changed to ${voiceChoice}`);
        }else{
            await interaction.reply(
                `Unable to change TTS Voice changed to ${voiceChoice}, please check the voice name list and ensure you are using a valid standard name`
            );
        }
    },
};
