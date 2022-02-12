const { SlashCommandBuilder } = require('@discordjs/builders');
const {CreateDefaultEmbed} = require("../helpers/CreateDefaultEmbed");
const child = require("child_process")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('terminal')
        .setDescription('Admin tool')
        .addStringOption(option => option.setName('line').setDescription('Argument').setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== `211187601007312896`) {
            await CreateDefaultEmbed(interaction, `You don't have permission to use this command!`)
            return
        }

        let command = interaction.options.getString('line')

        //const command = line.join(" ")

        child.exec(command, async (err, res) => {
            if (err) return console.log(err)
            await CreateDefaultEmbed(interaction, res.slice(0, 2000), {code: "js"})
        })


    },
};