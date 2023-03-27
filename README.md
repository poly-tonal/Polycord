# Polycord
Text to speech discord bot using Amazon Polly for voice generation

# Setup
- git clone https://github.com/poly-tonal/Polycord/
- cd Polycord
- run `npm i`
- create `config.json`
- add required information to config.json following example
- run `node deploy-commands.js` to add commands to your server
- run `pm2 startup`
- run `pm2 start index.js` to start bot
- run `pm2 save` to add pm2 job to startup

# commands
- `/join` join current voice channel
- `/leave` leave voice channel
- `/set_TTS_chanel` [admin] set channel command is called in to TTS channel 
- `/change_voice` change voice model
- `/get_voice` get list of voice models from AWS documentation


