const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Flight Bot\'s Features'),
    async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setTitle('List of Commands')
            .setColor('#25548c')
            .setAuthor({ name: 'Help', iconURL: interaction.user.avatarURL()})
            //.setThumbnail('') FLIGHT BOT LOGO
            .addField(name = "Flight Tracker", "`Real time tracking`, `blah blah`")

        await interaction.reply({ embeds: [helpEmbed] });
    },
};