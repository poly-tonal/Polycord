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
} = require("@discordjs/voice");
const path = require("path");
const audioPlayer = createAudioPlayer();

let botId = 1084213550433697863;

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

//read all messages
var { channel } = require("./config.json");

client.on("messageCreate", (message) => {
    if (
        channel == null &&
        message.author.id != botId &&
        message.guildId == guildId
    ) {
        message.reply({
            content:
                "no tts channel set, please set one with /setTTSChannel in the chosen channel",
        });
    } else if (
        message.channelId == channel &&
        message.author.id != botId &&
        message.guildId == guildId
    ) {
        //do tts to it

        //send text to polly
        //get audio from polly

        //rewite to open .mp3 (if too slow direct stream)
        var stream = pollySpeak(message.content);
        //open file
        let voice = createAudioResource(join(__dirname, 'voice.mp3'));
        const connection = getVoiceConnection(message.guild.id);
        audioPlayer.play(voice);
        const subscription = connection.subscribe(audioPlayer);
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
    var ttscontent = message;
    //send message.content to polly
    var params = {
        OutputFormat: "mp3",
        Text: ttscontent,
        // | Ivy | Joanna | Joey | Justin | Kendra | Kimberly | Salli | Conchita | Enrique | Miguel | Penelope | Chantal | Celine | Mathieu | Dora | Karl | Carla | Giorgio | Mizuki | Liv | Lotte | Ruben | Ewa | Jacek | Jan | Maja | Ricardo | Vitoria | Cristiano | Ines | Carmen | Maxim | Tatyana | Astrid | Filiz', /* required */
        VoiceId: "Brian",

        SampleRate: "8000",
        TextType: "text",
    };
    // let speak = polly.SynthesizeSpeechCommand(params);
    // return await polly.send(speak);

    //fix this
    const command = new SynthesizeSpeechCommand(params);
    try {
        const data = await polly.send(command);
        if (!data || !data.AudioStream) throw Error("Bad Responce");
        await saveAudio(data.AudioStream, "voice.mp3");
    } catch (err) {
        console.log(err);
    }
}

function saveAudio(fromStream, outfile){
    return new Promise((resolve, reject) => {
        let toStream = fs.createWriteStream(outfile)
        toStream.on('finish', resolve);
        toStream.on('error', reject);
        fromStream.pipe(toStream)
    })
}


//log into client
client.login(token);
