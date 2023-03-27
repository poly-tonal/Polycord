const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token, guildId } = require("./config.json");
const fs = require("fs");
const {
    PollyClient,
    SynthesizeSpeechCommand,
    synthesizeSpeechInput,
} = require("@aws-sdk/client-polly");
const {
    getVoiceConnection,
    VoiceConnectionStatus,
    createAudioResource,
    createAudioPlayer,
    joinVoiceChannel,
} = require("@discordjs/voice");
const path = require("path");
const audioPlayer = createAudioPlayer();
const staticconfig = require("./config.json")

let botId = staticconfig.botId

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on("messageCreate", (message) => {
    //read all messages
        var configPath = path.resolve(__dirname, "config.json");
    var configData = JSON.parse(fs.readFileSync(configPath));
    if (
        configData.channel == null &&
        message.author.id != botId &&
        message.guildId == guildId &&
        message.member.voice.channel != null
    ) {
        message.reply({
            content:
                "no tts channel set, please have an Admin set one with /set_TTS_Channel in the chosen channel",
        });
    } else if (
        message.channelId == configData.channel &&
        message.author.id != botId &&
        message.guildId == guildId &&
        message.member.voice.channel != null
    ) {
        const voiceChannel = message.member.voice.channel;
    if (voiceChannel){
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        });}
        //do tts to it
        message.guild.members.cache.get(client.user.id).setNickname(`TTS[${message.author.tag}]`)
        pollySpeak(message);
        message.delete()
    }
}),
    client.on("voiceStateUpdate", async (oldState, newState) => {
        // Check if the bot has joined a voice channel
        if (
            newState.connection &&
            newState.connection.state.status === VoiceConnectionStatus.Ready
        ) {
            console.log(`Joined voice channel: ${newState.channel.name}!`);
        }
    });

async function pollySpeak(message) {
    const polly = new PollyClient({ region: "eu-west-2" });
    var ttscontent = message.content;
    var configPath = path.resolve(__dirname, "config.json");
    var configData = JSON.parse(fs.readFileSync(configPath));
    var voice = configData.voice;
    //send message.content to polly
    var params = {
        OutputFormat: "mp3",
        Text: ttscontent,
        VoiceId: voice,
        SampleRate: "24000",
        TextType: "text",
    };

    const command = new SynthesizeSpeechCommand(params);
    try {
        const data = await polly.send(command);
        if (!data || !data.AudioStream) throw Error("Bad Responce");

        let voice = createAudioResource(data.AudioStream);
        const connection = getVoiceConnection(message.guild.id);
        audioPlayer.play(voice);
        const subscription = connection.subscribe(audioPlayer);
    } catch (err) {
        console.log(err);
    }
}

//log into client
client.login(token);
