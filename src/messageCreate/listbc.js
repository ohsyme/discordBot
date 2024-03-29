module.exports = {
    name: "listbc",
    async execute(message) {
        const { Blocked_Command_Shell, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        const log = require("../log/log").log
        for (let i = 0; i < Blocked_Command_Shell.length; i++) {
            if (i === 0) {
                var listblockc = `${i + 1}. ${Blocked_Command_Shell[i]}\n`
            } else {
                listblockc += `${i + 1}. ${Blocked_Command_Shell[i]}\n`;
            }
            if (i + 1 === Blocked_Command_Shell.length) {
                message.reply({ content: `\`\`\`\n${listblockc}\n\`\`\`` });
                log({
                    color: "Green",
                    interaction: "List Blocked Commands",
                    description: `Command List Blocked Commands was used`,
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`\n${listblockc}\n\`\`\``,
                        },
                        {
                            name: "Used by",
                            value: `${message.author.tag} (${message.author.id})`,
                        },
                        {
                            name: "Used in",
                            value: `${message.channel.name} (${message.channel.id})`,
                        },
                        {
                            name: "Used in guild",
                            value: `${message.guild.name} (${message.guild.id})`,
                        } 
                    ]
                })
            }
        }
    }
}