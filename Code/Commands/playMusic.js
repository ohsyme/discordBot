module.exports = {
    data: {
        name: 'playmusic',
        description: 'Play music in a voice channel',
        options: [
            {
                name: 'link',
                description: 'The link to the music',
                type: 3,
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const link = interaction.options.getString('link');
        const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
        const { OWNER_ID } = require("../../config.json")
        const https = require('https');
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({
                content: "This command is still in development and is not available to the public yet.",
                ephemeral: true
            })
        }
        try {
            const { createAudioPlayer } = require("@discordjs/voice");
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: "You must be in a voice channel to use this command.",
                    ephemeral: true
                })
            }
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true,
                // dont make it true smh
                selfMute: false
            });
            const ytdl = require("ytdl-core");
            const stream = ytdl(link, {
                lang: "en",
                liveBuffer: 40000,
                filter: "audioonly",
                highWaterMark: 1 << 25,
                quality: "highestaudio",
                type: "opus",
                requestOptions: {
                    headers: {
                        cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+999"
                    },
                    agent: new https.Agent({
                        rejectUnauthorized: false,
                        keepAlive: true,
                        keepAliveMsecs: 10000,
                        maxSockets: 50,
                        maxFreeSockets: 10,
                        scheduling: "fifo",
                        maxTotalSockets: 50,
                        timeout: 60000,
                        freeSocketTimeout: 30000
                    })
                }
            });
            const { createAudioResource } = require("@discordjs/voice");
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);
            interaction.reply({
                content: `Playing ${link}`,
                ephemeral: true
            })
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}