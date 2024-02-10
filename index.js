const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { accessKeyId, secretAccessKey, region, token, guildId } = require("./config.json");
const fs = require("fs");
const {
  PollyClient,
  SynthesizeSpeechCommand,
  synthesizeSpeechInput,
} = require("@aws-sdk/client-polly");

const AWS = require("aws-sdk")

const  { fromIni }  = require("@aws-sdk/credential-providers");



const awsPollyCredentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
};
  AWS.config.credentials = awsPollyCredentials;
  AWS.config.region = region;


  const polly = new PollyClient(AWS.config);

const {
  getVoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const path = require("path");
const audioPlayer = createAudioPlayer();
const staticconfig = require("./config.json");
// const { PollyClient } = require("@aws-sdk/client-polly");

let botId = staticconfig.botId;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// AWS.config.loadFromPath(polypath)


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
    if (voiceChannel) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guildId,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
    }
    //do tts to it
    message.guild.members.cache
      .get(client.user.id)
      .setNickname(`TTS[${message.author.tag}]`);
    pollySpeak(message);
    message.delete();
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

  var ttscontent = message.content;

  userFilePath = path.resolve(__dirname, "userData.json");

  if (!fs.existsSync(userFilePath)) {
    console.log("creating user config file")
    fs.writeFileSync(userFilePath, '[]');
  }
  userFile = JSON.parse(fs.readFileSync(userFilePath));
  let voice = null;
  userFile.forEach((user) => {
    if (user.UID == message.author.tag) {
      voice = user.selected_voice;
      user.characters += message.content.length;
    }
  });

  if (voice == null) {
    var newUser = {
      UID: message.author.tag,
      selected_voice: "Brian",
      characters: message.content.length,
    };
    voice = "Brian";
    userFile.push(newUser);
  }
  var NewUserFile = JSON.stringify(userFile);

  fs.writeFileSync("./userData.json", NewUserFile, (err) => {
    // error checking
    if (err) throw err;

    console.log("New data added");
  });

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
