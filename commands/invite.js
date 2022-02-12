const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Replies with the link that can invite Flight Bot to your server'),
    async execute(interaction) {
        await interaction.reply("https://discord.com/api/oauth2/authorize?client_id=941894883449393254&permissions=8&scope=bot%20applications.commands")
    },
};