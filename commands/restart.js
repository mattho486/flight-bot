const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Admin tool'),
    async execute(interaction) {
        if (interaction.user.id !== `211187601007312896`) {
            await CreateDefaultEmbed(interaction, `You don't have permission to use this command!`)
            return
        }

        await CreateDefaultEmbed(interaction,'Restarting...')
        process.exit()
    },
};