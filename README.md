# Polycord
Text to speech discord bot using [Amazon Polly](https://aws.amazon.com/polly/) for voice generation

# Prerequisites
- [ffmpeg](https://ffmpeg.org/) must be installed where Polucord is running
- An IAM user with access to AWS Polly is needed for credentials

# Setup
- `git clone https://github.com/poly-tonal/Polycord/`
- `cd Polycord`
- run `npm i`
- create `config.json`
- add required information to `config.json` following example file `config-example.json`
- deploy commands with `node .\deploy-commands.js`
- run Polycord with `node .\index.js`
- assign a tts channel with the `/set_TTS_channel` as Admin

# Commands
- `/help` get information on how to use the bot, command information available when specified eg `/help /join` will give an explaination of the `/join` command
- `/join` join current voice channel
- `/leave` leave voice channel
- `/change_voice` change voice model to specified standard AWS Polly voice
- `/get_voices` get list of standard voice models from AWS documentation
- `/get_characters` get the number of characters processed by Polycord from `userData.json`
- `/get_curent_voice` get the current voice assigned to the user
- `/set_TTS_chanel` [admin] set channel command is called in to TTS channel 
- `/set_other_voice` [admin] set the voice of another user

# Docker Image
To run in docker, create `config.json` then run `docker build .` in the polycord directory to create the docker image

